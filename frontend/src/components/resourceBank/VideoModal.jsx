import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const getEmbedUrl = (url) => {
    if (url.includes("youtu.be")) {
      // Extract video ID from shortened URL
      const videoId = url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtube.com")) {
      // Extract video ID from standard URL
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("drive.google.com")) {
      // Extract video ID from Google Drive URL
      const videoId = url.match(/[-\w]{25,}/)[0];
      return `https://drive.google.com/file/d/${videoId}/preview`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">{video.title}</h2>
        <iframe
          className="w-full aspect-video rounded-lg"
          src={embedUrl}
          title={video.title}
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
};

VideoModal.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default VideoModal;