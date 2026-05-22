import { useState } from "react";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatWindow from "./ChatWindow";

const ChatbotIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button
        data-aos="zoom-in"
        data-aos-duration="300"
        onClick={() => setIsModalOpen(true)}
        data-aos-once="true"
        className={"fixed bottom-5 right-5 z-50 p-2.5 rounded-full text-white shadow-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out"}
      >
        <TbMessageChatbotFilled className="h-9 w-9 lg:w-11 lg:h-10" />
      </button>

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
            width: { xs: "90%", sm: "70%", md: "50%" }, // Responsive width
            maxWidth: "800px", // Optional: Set a max-width for very large screens
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => setIsModalOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <ChatWindow />
        </Box>
      </Modal>
    </div>
  );
};

export default ChatbotIcon;