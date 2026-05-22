import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, Chip, Paper } from "@mui/material";

const SessionsList = ({ title, sessions }) => {
  return (
    <Paper elevation={3} sx={{ bgcolor: "#4db6ac", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2} sx={{ textAlign: "center", color: "white" }}>
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {session.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.school} - {session.address}
                    </Typography>
                    {session.subject && (
                      <Typography variant="body2" color="text.secondary">
                        {session.subject}
                      </Typography>
                    )}
                    {session.grade && (
                      <Typography variant="body2" color="text.secondary">
                        Grade {session.grade}
                      </Typography>
                    )}
                  </Box>
                  {session.status && (
                    <Chip label={session.status} color="success" size="small" />
                  )}
                  <Typography variant="body2" color="text.secondary">
                      Contact: {session.phoneNumber}
                    </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No upcoming seminars found.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

SessionsList.propTypes = {
  title: PropTypes.string.isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      school: PropTypes.string.isRequired,
      subject: PropTypes.string,
      grade: PropTypes.string,
      address: PropTypes.string,
      phoneNumber: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};

export default SessionsList;
