import { useState } from "react";
import axios from "axios";
import { Button, TextField, CircularProgress, Typography, Box, IconButton } from "@mui/material";
import { Send, ClearAll } from "@mui/icons-material";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [teachMode, setTeachMode] = useState(false);
  const [teachAnswer, setTeachAnswer] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);
    setLoading(true);
    
    // Local API = http://127.0.0.1:5000/
    
    try {
      const response = await axios.post("https://learnheart-chatbot-server.onrender.com/chat", { question: input });
      if (response.data.learn) {
        setMessages((prev) => [...prev, { sender: "Bot", text: "I don't know. Can you teach me?" }]);
        setTeachMode(true);
      } else {
        setMessages((prev) => [...prev, { sender: "Bot", text: response.data.response }]);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: "Bot", text: "Error: Unable to connect" }]);
    }

    setInput("");
    setLoading(false);
  };

  const handleTeach = async () => {
    if (teachAnswer.trim()) {
      const question = messages[messages.length - 2].text;
  
      try {
        await axios.post("https://learnheart-chatbot-server.onrender.com/learn", {
          question: question,
          answer: teachAnswer,
        });
  
        setMessages((prev) => [
          ...prev,
          { sender: "You", text: teachAnswer },
          { sender: "Bot", text: "Thanks for teaching me!" },
        ]);
  
        setTeachMode(false);
        setTeachAnswer("");
      } catch (error) {
        console.error("Error learning new answer:", error);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTeachMode(false);
    setTeachAnswer("");
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="py-4">
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '600px', md: '800px' }, // Responsive maxWidth
          margin: 'auto',
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          padding: { xs: '16px', sm: '24px' },
          display: 'flex',
          flexDirection: 'column',
          height: { xs: '90vh', sm: '80vh' },
        }}
      >
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#1976d2', marginBottom: '3px' }}>
          Feel free to ask any questions you have about LearnHeart.
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#EAEFFB',
            marginBottom: '16px',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#1976d2',
              borderRadius: '4px',
            },
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                padding: '12px',
                marginBottom: '8px',
                maxWidth: { xs: '90%', sm: '75%' }, // Responsive maxWidth
                borderRadius: '12px',
                backgroundColor: msg.sender === "You" ? '#1976d2' : '#e0e0e0',
                color: msg.sender === "You" ? '#ffffff' : '#000000',
                alignSelf: msg.sender === "You" ? 'flex-end' : 'flex-start',
                textAlign: msg.sender === "You" ? 'right' : 'left',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                {msg.sender}
              </Typography>
              <Typography variant="body1">{msg.text}</Typography>
            </Box>
          ))}
        </Box>

        {teachMode && (
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              backgroundColor: '#f1f1f1',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              flexDirection: { xs: 'column', sm: 'row' }, // Responsive flexDirection
            }}
          >
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Teach me something..."
              value={teachAnswer}
              onChange={(e) => setTeachAnswer(e.target.value)}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                '& .MuiOutlinedInput-root': {
                  color: '#000000',
                  '& fieldset': {
                    borderColor: '#ddd',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleTeach}
              sx={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#115293',
                },
                width: { xs: '100%', sm: 'auto' }, // Responsive width
              }}
            >
              Teach
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            borderTop: '1px solid #ddd',
            paddingTop: '16px',
            flexDirection: { xs: 'column', sm: 'row' }, // Responsive flexDirection
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Add keydown event listener
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                color: '#000000',
                '& fieldset': {
                  borderColor: '#ddd',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: '8px', width: { xs: '100%', sm: 'auto' } }}> {/* Responsive width */}
            <IconButton
              onClick={sendMessage}
              disabled={loading}
              sx={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#115293',
                },
                flex: { xs: 1, sm: 'none' }, // Responsive flex
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <Send />}
            </IconButton>
            <IconButton
              onClick={clearChat}
              sx={{
                border: '1px solid #1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                },
                flex: { xs: 1, sm: 'none' }, // Responsive flex
              }}
            >
              <ClearAll />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default ChatWindow;