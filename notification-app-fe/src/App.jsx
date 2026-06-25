import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityPage from "./pages/PriorityPage";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM3BhMWEwMjM5QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3ODIzODA4NzUsImlhdCI6MTc4MjM3OTk3NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjVhMThjMTNiLTUzMGMtNGZmNy1hNGVkLWI3MTQyNWNhZmRlZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbGx1cmkgYmhhc2thciBoaW1lc2giLCJzdWIiOiIyZWJkNDAyMS02M2FmLTRmMTAtYTAzOS1jNTk0MWJlYTRmYzkifSwiZW1haWwiOiIyM3BhMWEwMjM5QHZpc2hudS5lZHUuaW4iLCJuYW1lIjoibWFsbHVyaSBiaGFza2FyIGhpbWVzaCIsInJvbGxObyI6IjIzcGExYTAyMzkiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiIyZWJkNDAyMS02M2FmLTRmMTAtYTAzOS1jNTk0MWJlYTRmYzkiLCJjbGllbnRTZWNyZXQiOiJGdVpTTlRZelREUEhoUnZnIn0.ozc16kdBNnS69PTDvSVbhRbFZX3kmSeyiDamqelZb4s";

export default function App() {
  useEffect(() => {
    localStorage.setItem("afford_token", TOKEN);
  }, []);

  const token = TOKEN;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/notifications" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/notifications" element={token ? <NotificationsPage /> : <Navigate to="/login" />} />
      <Route path="/priority" element={token ? <PriorityPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}