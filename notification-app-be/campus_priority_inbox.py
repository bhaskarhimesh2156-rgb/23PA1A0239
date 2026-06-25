"""
Campus Notification Priority Inbox
Author: Malluri Bhaskar Himesh (23PA1A0239)
Description: Fetches campus notifications and ranks them by importance + recency
"""

import requests
import sys
from datetime import datetime, timezone
import math


NOTIFICATION_ENDPOINT = "http://4.224.186.213/evaluation-service/notifications"

# Priority levels — higher means more critical
PRIORITY_MAP = {
    "Placement": 10,
    "Result":     6,
    "Event":      3,
}


def pull_notifications(auth_token: str) -> list:
    """Hit the campus notification API and return the list."""
    req_headers = {
        "Authorization": f"Bearer {auth_token}",
        "Accept": "application/json"
    }
    resp = requests.get(NOTIFICATION_ENDPOINT, headers=req_headers, timeout=10)

    if resp.status_code != 200:
        print(f"[ERROR] API returned {resp.status_code}: {resp.text}")
        sys.exit(1)

    return resp.json().get("notifications", [])


def compute_importance(item: dict, current_time: datetime) -> float:
    """
    Importance Score Formula:
        score = base_priority + decay_bonus

    base_priority → fixed weight by notification type
    decay_bonus   → logarithmic recency bonus (higher for newer items)

    Using log decay so that very recent notifications get a
    meaningful boost without completely overshadowing type priority.
    """
    base_priority = PRIORITY_MAP.get(item.get("Type", ""), 0)

    posted_at = datetime.strptime(item["Timestamp"], "%Y-%m-%d %H:%M:%S")
    # Make both timezone-naive for safe subtraction
    age_in_minutes = (current_time - posted_at).total_seconds() / 60

    # log(1) = 0, so brand-new items get 0 bonus; older ones get negative
    # We invert: bonus shrinks as age grows
    decay_bonus = 1 / (1 + math.log1p(age_in_minutes))

    return round(base_priority + decay_bonus, 6)


def build_priority_inbox(auth_token: str, top_n: int = 10) -> list:
    """
    Main logic:
    1. Fetch all notifications
    2. Attach a score to each
    3. Sort by score descending
    4. Return top N
    """
    raw_notifications = pull_notifications(auth_token)
    now = datetime.utcnow()

    ranked = []
    for notif in raw_notifications:
        score = compute_importance(notif, now)
        ranked.append({**notif, "_score": score})

    # Sort highest score first
    ranked.sort(key=lambda x: x["_score"], reverse=True)

    return ranked[:top_n]


def print_inbox(results: list, top_n: int):
    border = "─" * 55
    print(f"\n{border}")
    print(f"  📬  PRIORITY INBOX  |  Showing Top {top_n}")
    print(f"{border}")

    for rank, item in enumerate(results, start=1):
        tag = f"[{item['Type'].upper()}]"
        print(f"\n  #{rank}  {tag}")
        print(f"       Message   : {item['Message']}")
        print(f"       Timestamp : {item['Timestamp']}")
        print(f"       Score     : {item['_score']}")
        print(f"       ID        : {item['ID']}")

    print(f"\n{border}\n")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python campus_priority_inbox.py <bearer_token> [top_n]")
        print("Example: python campus_priority_inbox.py eyJhbG... 10")
        sys.exit(1)

    bearer_token = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    inbox = build_priority_inbox(bearer_token, n)
    print_inbox(inbox, n)