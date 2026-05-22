import PropTypes from "prop-types";
import { Paper, Typography, Box, Button } from "@mui/material";
import { CalendarCheck, Clock } from "lucide-react";

export const SessionsList = ({ title, sessions, type }) => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.isArray(sessions) && sessions.length > 0 ? (
          sessions.map((session) => (
            <Paper
              key={session.id}
              variant="outlined"
              sx={{
                p: 2,
                "&:hover": {
                  borderColor: "primary.light",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{session.subject}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <CalendarCheck style={{ width: 16, height: 16 }} />
                    <Typography variant="body2">{session.date}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "text.secondary",
                    }}
                  >
                    <Clock style={{ width: 16, height: 16 }} />
                    <Typography variant="body2">{session.time}</Typography>
                  </Box>
                </Box>
                {type === "scheduled" && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => console.log("Join clicked")}
                  >
                    View
                  </Button>
                )}
              </Box>
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No sessions available.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// ✅ Prop Types Validation
SessionsList.propTypes = {
  title: PropTypes.string.isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      subject: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
  type: PropTypes.oneOf(["scheduled", "completed"]),
};

// ✅ Default Props
SessionsList.defaultProps = {
  sessions: [],
  type: "scheduled",
};
