import { UserButton, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Modal, IconButton, Chip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import OrgSearchList from "../organization/OrgSearchList";
import CVUpload from "./CVUpload";

function VolProfilebar() {
    const [volunteers, setVolunteers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const user = useUser().user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

    const clarkId = volunteers.find((vol) => vol.userID === user?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/volunteers");
                setVolunteers(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/volunteers/accepted-organizations/${user?.id}`);
                setOrganizations(response.data);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };
    
        if (user?.id) {
            fetchOrganizations();
        }
    }, [user]);

    const renderSkills = () => {
        if (!clarkId?.skills || clarkId.skills.length === 0) {
            return <Typography variant="body2" color="textSecondary"></Typography>;
        }

        return (
            <div className="flex flex-wrap justify-center gap-2 mt-4 sm:justify-start">
                {clarkId.skills.map((skill, index) => (
                    <Chip 
                        key={index} 
                        label={skill} 
                        color="secondary" 
                        size="small"
                        className="transition duration-300 ease-in-out hover:scale-110"
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative flex flex-col items-center p-6 text-white rounded-lg bg-custom-blue w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto shadow-lg min-h-[400px] flex-grow">
            <div className="flex flex-col items-center justify-center flex-grow pointer-events-none">
                <UserButton 
                    appearance={{ 
                        elements: { 
                            userButtonAvatarBox: "w-24 h-24 md:w-32 md:h-32",
                            userButtonAvatarImage: "w-full h-full object-cover"
                        } 
                    }} 
                />
                <h2 className="mt-4 text-3xl font-semibold text-center md:text-xl">
                    <strong>{user?.fullName}</strong>
                </h2>
                <p className="px-4 mt-2 text-sm text-center md:text-base md:px-6">
                    {clarkId?.description} <br />
                    {renderSkills()}
                </p>
                <div className="mt-10">
                    <h3 className="font-semibold text-center text-md md:text-lg">Joined Organizations</h3>
                    <ul className="list-disc list-inside">
                        {organizations.map((org, index) => (
                            <li key={index}>{org}</li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <br />
            <div className="flex flex-col items-center w-full pb-6 mt-4 space-y-3">
                <button className="px-2 py-2 duration-300 bg-white border rounded-xl hover:scale-105 hover:bg-blue-50 text-custom-blue" onClick={() => setIsModalOpen(true)}>
                    <SearchIcon />Find Organizations
                </button>
                <button className="w-3/4 py-2 duration-300 bg-white border md:w-1/2 rounded-xl hover:scale-105 hover:bg-blue-50 text-custom-blue" onClick={() => setIsSkillModalOpen(true)}>
                    Verify Skills
                </button>
                <button className="w-3/4 py-2 text-white duration-300 border md:w-1/2 rounded-xl hover:scale-105 bg-custom-orange hover:bg-orange-600">
                    <Link to="/"> Back to Home </Link>
                </button>
            </div>
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
            <Modal open={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)}>
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
                    xs: '100%',
                    sm: '95%',
                    md: '80%',
                    lg: '70%',
                    xl: '55%'
                    },
                    maxHeight: "90vh", 
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
                >
                <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={() => setIsSkillModalOpen(false)}>
                    <CloseIcon />
                </IconButton>
                <CVUpload />
                </Box>
            </Modal>
        </div>
    );
}

export default VolProfilebar;