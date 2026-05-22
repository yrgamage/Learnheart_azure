import { Box, Typography, Button } from '@mui/material';

const NotFound = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #e0f2fe, #e0e7ff)'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
          Page not found
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          href="/"
          size="large"
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;