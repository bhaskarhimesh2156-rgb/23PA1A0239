import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [clientID, setClientID] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await fetch("http://4.224.186.213/evaluation-service/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientID,
          clientSecret,
          email: "23pa1a0239@vishnu.edu.in",
          name: "malluri bhaskar himesh",
          rollNo: "23pa1a0239",
          accessCode: "ahXjvp",
        }),
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("afford_token", data.access_token);
        navigate("/notifications");
      } else {
        setError("Login failed. Check credentials.");
      }
    } catch {
      setError("Network error.");
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
          AffordMed Login
        </Typography>
        <TextField fullWidth label="Client ID" value={clientID} onChange={e => setClientID(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Client Secret" value={clientSecret} onChange={e => setClientSecret(e.target.value)} sx={{ mb: 2 }} />
        {error && <Typography color="error" mb={1}>{error}</Typography>}
        <Button fullWidth variant="contained" onClick={handleLogin}>Login</Button>
      </Paper>
    </Box>
  );
}