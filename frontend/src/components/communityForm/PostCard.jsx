import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PostCard = ({ id, title, subheader, image, content }) => {
  PostCard.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subheader: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  };

  const regex = /(<([^>]+)>)/gi;
  const stripHtmlTags = (str) => {
    return str.replace(regex, '');
  };

  const renderContent = (content) => {
    const strippedContent = content?.replace(regex, "")?.substring(0,100) + "...";
    return { __html: strippedContent };
  };
  const isValidImage = image && image.startsWith('data:image');

  return (
    <div className="w-full max-w-sm overflow-hidden transition-transform duration-300 bg-white border border-gray-200 rounded-lg shadow-lg hover:scale-105">
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{subheader}</p>
        </div>
      </div>

      <Link to={`/post/${id}`}>
        {isValidImage ? (
          <img 
            className="object-cover w-full h-52" 
            src={image} 
            alt="Post" 
          />
        ) : (
          <div className="flex items-center justify-center w-full text-gray-500 bg-gray-300 h-52">
            No Image Available
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-700" dangerouslySetInnerHTML={renderContent(stripHtmlTags(content))}></p>
      </div>

      <div className="px-4 pb-4">
        <Link to={`/post/${id}`} className="text-sm font-medium text-blue-600 hover:underline">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
