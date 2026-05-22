import { Box, Card, CardContent, Typography, Rating } from "@mui/material";
import PropTypes from "prop-types";

const ReviewsList = () => {
  const reviews = [
    {
      date: "10.05.2024",
      school: "High School, Galle",
      rating: 5,
      comment:
        "Highly recommend. The session was well-organized, and the volunteers were knowledgeable.",
    },
    {
      date: "02.08.2024",
      school: "High School, Galle",
      rating: 4,
      comment: "Highly recommend. The session was well-organized.",
    },
    {
      date: "15.09.2024",
      school: "Central College, Colombo",
      rating: 3,
      comment: "The session was good but could have been more interactive.",
    },
    {
      date: "22.11.2024",
      school: "Junior School, Kandy",
      rating: 5,
      comment: "Amazing experience! The students really enjoyed the session.",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#4db6ac", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ lineHeight: 1.8, textAlign: "center" }}>
        Reviews
      </Typography>
      <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 200,
            overflowY: "auto",
            p: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
      >
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Box>
    </Box>
  );
};

const ReviewCard = ({ date, school, rating, comment }) => {
  return (
    <Card sx={{ p: 2, backgroundColor: "white", borderRadius: 2, minHeight: 280 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ lineHeight: 1.8 }}>
          {date}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {school}
        </Typography>
        <Box sx={{ p: 2, backgroundColor: "#FFFBF1", borderRadius: 1, mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.8 }}>
            {comment}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1, lineHeight: 1.6 }}>
              Rating
            </Typography>
            <Rating value={rating} max={5} readOnly precision={0.5} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

ReviewCard.propTypes = {
  date: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
};

export default ReviewsList;
