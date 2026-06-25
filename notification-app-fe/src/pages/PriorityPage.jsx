import { useState } from "react";
import { Box, Typography, CircularProgress, Alert, Chip, Card, CardContent, AppBar, Toolbar, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { useViewed } from "../hooks/useViewed";

const TYPE_WEIGHTS = { Placement: 10, Result: 6, Event: 3 };
const TYPE_COLORS = { Placement: "success", Result: "warning", Event: "info" };

function scoreNotification(n) {
  const base = TYPE_WEIGHTS[n.type] || 1;
  const ageMinutes = (Date.now() - new Date(n.createdAt)) / 60000;
  const decay = 1 / (1 + Math.log1p(ageMinutes));
  return base + decay;
}

export default function PriorityPage() {
  const [topN, setTopN] = useState(10);
  const navigate = useNavigate();
  const { notifications, loading, error } = useNotifications({});
  const { viewed, markViewed } = useViewed();

  const prioritized = [...notifications]
    .map(n => ({ ...n, score: scoreNotification(n) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return (
    <Box>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Priority Inbox</Typography>
          <Button color="inherit" onClick={() => navigate("/notifications")}>All Notifications</Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <TextField
          label="Show Top N"
          type="number"
          value={topN}
          onChange={e => setTopN(Number(e.target.value))}
          sx={{ mb: 3, width: 150 }}
          inputProps={{ min: 1 }}
        />

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {prioritized.map((n, i) => (
          <Card
            key={n.id}
            sx={{ mb: 2, opacity: viewed.has(n.id) ? 0.6 : 1, cursor: "pointer", border: viewed.has(n.id) ? "1px solid #ccc" : "1px solid #9c27b0" }}
            onClick={() => markViewed(n.id)}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={1}>
                  <Chip label={`#${i + 1}`} size="small" />
                  <Chip label={n.type} color={TYPE_COLORS[n.type] || "default"} size="small" />
                </Box>
                {viewed.has(n.id)
                  ? <Chip label="Viewed" size="small" variant="outlined" />
                  : <Chip label="New" color="primary" size="small" />}
              </Box>
              <Typography variant="body1" mt={1} fontWeight={viewed.has(n.id) ? "normal" : "bold"}>
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.createdAt).toLocaleString()} | Score: {n.score.toFixed(3)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}