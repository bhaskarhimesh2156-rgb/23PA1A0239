import { useState } from "react";
import { Box, Typography, CircularProgress, Alert, Chip, Card, CardContent, AppBar, Toolbar, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { useViewed } from "../hooks/useViewed";

const TYPE_COLORS = { Placement: "success", Result: "warning", Event: "info" };

export default function NotificationsPage() {
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();
  const { notifications, loading, error } = useNotifications(
    filterType ? { notification_type: filterType } : {}
  );
  const { viewed, markViewed } = useViewed();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>All Notifications</Typography>
          <Button color="inherit" onClick={() => navigate("/priority")}>Priority Inbox</Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <FormControl sx={{ mb: 3, minWidth: 200 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select value={filterType} label="Filter by Type" onChange={e => setFilterType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {notifications.map(n => (
          <Card
            key={n.id}
            sx={{ mb: 2, opacity: viewed.has(n.id) ? 0.6 : 1, cursor: "pointer", border: viewed.has(n.id) ? "1px solid #ccc" : "1px solid #1976d2" }}
            onClick={() => markViewed(n.id)}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip label={n.type} color={TYPE_COLORS[n.type] || "default"} size="small" />
                {viewed.has(n.id)
                  ? <Chip label="Viewed" size="small" variant="outlined" />
                  : <Chip label="New" color="primary" size="small" />}
              </Box>
              <Typography variant="body1" mt={1} fontWeight={viewed.has(n.id) ? "normal" : "bold"}>
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}