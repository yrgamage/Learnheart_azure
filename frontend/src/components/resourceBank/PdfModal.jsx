import { FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';

const PdfModal = ({ pdf, onClose }) => {
  if (!pdf) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">{pdf.title}</h2>
        <iframe
          className="w-full aspect-video rounded-lg"
          src={pdf.pdfUrl}
          title={pdf.title}
        />
        <a
          href={pdf.pdfUrl}
          download
          target="_blank"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center"
        >
          View PDF
        </a>
      </div>
    </div>
  );
};

PdfModal.propTypes = {
  pdf: PropTypes.shape({
    title: PropTypes.string.isRequired,
    pdfUrl: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PdfModal;