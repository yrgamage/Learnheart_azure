import Footer from "../../components/Footer";
import SclHeader from "../../components/school/SclHeader";

import { Container, Grid, Box } from "@mui/material";
import { SchoolProfile } from "../../components/school/SchoolProfile";
import { RequestSession } from "../../components/school/RequestSession";

import { useEffect, useState } from "react";
import axios from "axios";
import SessionStatus from "../../components/school/SessionStatus";

function SclDashboard() {
  const [completedSessions, setCompletedSessions] = useState([]);
  const [scheduledSessions, setScheduledSessions] = useState([]);

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        const response1 = await axios.get(
          "http://localhost:3001/api/seminars/past"
        );
        setCompletedSessions(response1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchScheduledSessions = async () => {
      try {
        const response2 = await axios.get(
          "http://localhost:3001/api/seminars/upcoming"
        );
        setScheduledSessions(response2.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCompletedSessions();
    fetchScheduledSessions();
  }, []);
  console.log(completedSessions);
  console.log(scheduledSessions);
  
  return (
    <div className="h-screen bg-custom-page">
      <div className="flex flex-col min-h-screen">
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom right, #e0f2fe, #e0e7ff)",
          }}
        >
          <SclHeader />
          <Container maxWidth="xl" sx={{ py: 10 }}>
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={11} md={3} lg={3}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <SchoolProfile />
                </Box>
              </Grid>

              {/* Middle Column */}
              <Grid item xs={11} md={3} lg={6}>
                <RequestSession />
              </Grid>

              {/* Right Column */}
              <Grid item xs={11} md={3} lg={3}>
                <SessionStatus />
              </Grid>
            </Grid>
          </Container>

          <Footer />
        </Box>
      </div>
    </div>
  );
}

export default SclDashboard;
