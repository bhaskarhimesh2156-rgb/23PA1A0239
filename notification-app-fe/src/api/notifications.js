const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

export async function fetchNotifications(token, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;
  const res = await fetch(url, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}