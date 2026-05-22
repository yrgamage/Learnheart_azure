import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
// import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Loader from "../Spinner";
// import { Link } from 'react-router-dom';

const SinglePost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const displaySinglePost = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3001/api/posts/post/${id}`);
      setTitle(data.post.title);
      setContent(data.post.content);
      setImage(data.post.image);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    displaySinglePost();
  }, [id]);

  return (
    <div>
      <Navbar />
      <Box className="flex justify-center min-h-screen p-4 py-20 bg-custom-page">
        {loading ? (
          <Loader />
        ) : (
          <Card className="w-full max-w-3xl">
            <CardHeader
              // action={
              //   <Link to={`/post/edit/${id}`}>
              //     <IconButton aria-label="settings"><MoreVertIcon /></IconButton>
              //   </Link>
              // }
              title={title}
            />
            {image && (
              <CardMedia 
                component="img" 
                height="190" 
                image={image} 
                alt={title} 
              />
            )}
            <CardContent>
              <Box dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
          </Card>
        )}
      </Box>
      <Footer />
    </div>
  );
};

export default SinglePost;