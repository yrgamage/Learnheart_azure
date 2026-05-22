import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, Chip, Paper, IconButton, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';  // Import the RefreshIcon

const SessionsList = ({ title, sessions, handleRemove, isLoading, handleRefresh }) => {
  return (
    <Paper elevation={3} sx={{ bgcolor: "#4db6ac", p: 3, borderRadius: 2, maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" mb={0} sx={{ textAlign: "center", color: "black" }}>
          {title}
        </Typography>
        <IconButton onClick={handleRefresh} sx={{ padding: '6px', color: 'black' }}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {isLoading ? (
        <Box textAlign="center" mt={2}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <Card key={index} variant="outlined" sx={{ position: 'relative' }}>
                <CardContent>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemove(session.id)}
                    sx={{ position: 'absolute', top: 0, right: 8, padding: '2px' }}
                  >
                    <CloseIcon />
                  </IconButton>
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
                        {session.phoneNumber} | {session.email}
                      </Typography>
                    </Box>
                    {session.status && (
                      <Chip label={session.status} color="success" size="small" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" fontWeight="bold">
              No completed seminars found.
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
  handleRemove: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired // Add handleRefresh prop
};

const CompletedOrganization = () => {
  const user = useUser().user;
  const [seminars, setSeminars] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [schools, setSchools] = useState([]);
  const [completedSeminars, setCompletedSeminars] = useState([]);
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
      const filteredSeminars = seminars.filter(seminar => seminar.status === "completed");
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
        setCompletedSeminars(combinedData);
      }
    }
  }, [isLoading, seminars, organizations, schools, user?.id]);

  const handleRemove = (id) => {
    setCompletedSeminars(prev => prev.filter(session => session.id !== id));
  };

  return (
    <SessionsList title="Completed Seminars" sessions={completedSeminars} handleRemove={handleRemove} isLoading={isLoading} handleRefresh={fetchData} />
  );
};

export default CompletedOrganization;
