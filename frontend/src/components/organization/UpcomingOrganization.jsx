import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, Chip, Paper, Button, CircularProgress, IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const SessionsList = ({ title, sessions, handleComplete, isLoading, onRefresh }) => {
  return (
    <Paper elevation={3} sx={{ bgcolor: "#4db6ac", p: 3, borderRadius: 2, maxHeight: 800, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0}>
        <Typography variant="h6" sx={{ textAlign: "center", color: "black" }}>
          {title}
        </Typography>
        <IconButton onClick={onRefresh}  sx={{ padding: '6px', color: 'black' }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {sessions.length > 0 ? (
            sessions.slice(0, 3).map((session, index) => (
              <Card key={index} variant="outlined" sx={{ position: 'relative' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {session.date}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {session.school} - {session.address}
                      </Typography>
                      {session.subject && (
                        <Typography variant="body2" color="text.secondary">
                          {session.subject} | Grade {session.grade} | Medium: {session.medium}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Required Teacher Count: {session.expTeacherCount} | Num of Students: {session.expStudentCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Additional Requests: {session.additionalRequests}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {session.phoneNumber} | {session.email}
                      </Typography>
                    </Box>
                    {session.status && (
                      <Chip label={session.status} color="primary" size="small" />
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    sx={{ position: 'absolute', bottom: 8, right: 8 }}
                    onClick={() => handleComplete(session)}
                  >
                    Completed
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" fontWeight="bold" sx={{ height: 215, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              No upcoming seminars found.
            </Typography>
          )}
        </Box>
      )}
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
      medium: PropTypes.string,
      grade: PropTypes.string,
      address: PropTypes.string,
      phoneNumber: PropTypes.string,
      email: PropTypes.string,
      status: PropTypes.string,
      expTeacherCount: PropTypes.string,
      expStudentCount: PropTypes.string,
      additionalRequests: PropTypes.string
    })
  ).isRequired,
  handleComplete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

const UpcomingOrganization = () => {
  const user = useUser().user;
  const [seminars, setSeminars] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [schools, setSchools] = useState([]);
  const [specificSeminar, setSpecificSeminar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ProcessDate = (seminar) => {
    const date = seminar.expDate ? new Date(seminar.expDate) : null;
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replaceAll('/', '.') || 'N/A';
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [orgResponse, seminarResponse, schoolResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/organizations'),
        axios.get('http://localhost:3001/api/seminars'),
        axios.get('http://localhost:3001/api/schools')
      ]);
      
      setOrganizations(orgResponse.data);
      setSeminars(seminarResponse.data);
      setSchools(schoolResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && seminars.length && organizations.length) {
      const filteredSeminars = seminars.filter(seminar => seminar.status === "accepted");
      const userOrganization = organizations.find(org => org.userID === user?.id);

      if (userOrganization) {
        const specificSeminars = filteredSeminars.filter(seminar => seminar.organizationId === userOrganization._id);
        const combinedData = specificSeminars.map(seminar => {
          const school = schools.find(school => school._id === seminar.schoolId);
          return {
            id: seminar._id,
            date: ProcessDate(seminar),
            school: school?.schoolName,
            address: school?.address,
            phoneNumber: seminar.phoneNumber,
            email: school?.email,
            subject: seminar.subject,
            grade: seminar.grade,
            status: seminar.status,
            medium: seminar.medium,
            expTeacherCount: seminar.expTeacherCount,
            expStudentCount: seminar.expStudentCount,
            additionalRequests: seminar.additionalRequests
          };
        });
        setSpecificSeminar(combinedData);
      }
    }
  }, [isLoading, seminars, organizations, schools, user?.id]);

  const handleComplete = async (completedSession) => {
    try {
      await axios.put(`http://localhost:3001/api/seminars/${completedSession.id}`, { status: 'completed' });
      setSpecificSeminar(prev => prev.filter(session => session.id !== completedSession.id));
    } catch (error) {
      console.error('Error updating seminar status:', error);
    }
  };

  return (
    <SessionsList
      title="Upcoming Seminars"
      sessions={specificSeminar}
      handleComplete={handleComplete}
      isLoading={isLoading}
      onRefresh={fetchData}
    />
  );
};

export default UpcomingOrganization;
