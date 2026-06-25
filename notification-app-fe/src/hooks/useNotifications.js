import { useState, useEffect } from "react";

async function getToken() {
  const res = await fetch("http://localhost:5000/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientID: "2ebd4021-63af-4f10-a039-c5941bea4fc9",
      clientSecret: "FuZSNTYzTDPHhRvg",
      email: "23pa1a0239@vishnu.edu.in",
      name: "malluri bhaskar himesh",
      rollNo: "23pa1a0239",
      accessCode: "ahXjvp"
    })
  });
  const data = await res.json();
  return data.access_token;
}

export function useNotifications(params = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = await getToken();
        const query = new URLSearchParams(params).toString();
        const url = query
          ? `http://localhost:5000/api/notifications?${query}`
          : "http://localhost:5000/api/notifications";
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [JSON.stringify(params)]);

  return { notifications, loading, error };
}