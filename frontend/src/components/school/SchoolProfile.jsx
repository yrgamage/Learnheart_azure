import { Paper, Box, Typography, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import OrgSearchList from "../organization/OrgSearchList";

export const SchoolProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schoolProfiles, setSchoolProfiles] = useState([]); // Pluralized state name
  const { user } = useUser();
  const curruntID = user?.id;

  // Get school from Clerk's user object
  const matchingSchool = schoolProfiles.find(
    (sch) => sch.userID === curruntID
  ); // Find the specific school

  useEffect(() => {
    const fetchSchoolProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/schools/");
        setSchoolProfiles(response.data); // Set all schools
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchSchoolProfiles();
  }, []);
  
  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: "#3657AD" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: 580,
          textAlign: "center",
        }}
      >
        <div className="flex flex-col items-center justify-center flex-grow pointer-events-none">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-24 h-24 md:w-32 md:h-32",
                userButtonAvatarImage: "w-full h-full object-cover",
              },
            }}
          />
          <br />
          <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
            <strong>{user?.fullName}</strong>
          </Typography>
          <br />
          <Typography variant="body" sx={{ mb: 2, color: "white" }}>
            <strong>{matchingSchool?.description}</strong>
            <br />
            {matchingSchool?.address}
            <br />
            {matchingSchool?.contact}
            <br />
            {matchingSchool?.email}
          </Typography>
        </div>

        <button className="px-2 py-2 duration-300 bg-white border rounded-xl hover:scale-105 hover:bg-blue-50 text-custom-blue" onClick={() => setIsModalOpen(true)}>
          <SearchIcon />Find Organizations
        </button><br />
        <div className="flex items-center justify-center w-full space-x-3">
          <button className="py-2 text-white duration-300 border md:w-1/2 rounded-xl hover:scale-105 bg-custom-orange hover:bg-orange-600">
            <Link to="/"> Back to Home </Link>
          </button>
        </div>
      </Box>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          sx={{
            transform: "translate(-50%, -50%)",
            bgcolor: "#EAEFFB", 
            p: 3, 
            borderRadius: 2,
            width: {
              xs: '90%',
              sm: '75%',
              md: '60%',
              lg: '50%',
              xl: '35%'
            },
            maxHeight: "80vh", 
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
          <OrgSearchList />
        </Box>
      </Modal>


    </Paper>
  );
};
