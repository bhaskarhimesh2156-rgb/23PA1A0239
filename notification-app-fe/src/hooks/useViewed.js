import { useState } from "react";

export function useViewed() {
  const [viewed, setViewed] = useState(() => {
    const saved = localStorage.getItem("viewed_ids");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  function markViewed(id) {
    setViewed((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      localStorage.setItem("viewed_ids", JSON.stringify([...updated]));
      return updated;
    });
  }

  return { viewed, markViewed };
}