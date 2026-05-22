import { useEffect, useState } from "react";
import axios from "axios";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import VideoModal from "../../components/resourceBank/VideoModal";
import PdfModal from "../../components/resourceBank/PdfModal";
import PDFIMAGE from '../../assets/images/resource_bank-img/PDF.jpg';
import VIDEOIMAGE from '../../assets/images/resource_bank-img/VIDEO.jpg';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Spinner from "../../components/Spinner";

const ResourceBank = () => {
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [notesPage, setNotesPage] = useState(1);
  const [videosPage, setVideosPage] = useState(1);
  const [totalNotesPages, setTotalNotesPages] = useState(1);
  const [totalVideosPages, setTotalVideosPages] = useState(1);
  const [isGradeSelected, setIsGradeSelected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [notesPage, videosPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNotes(), fetchVideos()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/resources/notes/withPaginate",
        { subject: subject.toLowerCase(), grade, page: notesPage, limit: 3, sort: "title", order: "asc" }
      );
      setNotes(response.data.data || []);
      setTotalNotesPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/resources/videos/withPaginate",
        { subject: subject.toLowerCase(), grade, page: videosPage, limit: 3, sort: "title", order: "asc" }
      );
      setVideos(response.data.data || []);
      setTotalVideosPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleSearch = () => {
    setNotesPage(1);
    setVideosPage(1);
    fetchData();
  };

  const handleNotesPagination = (direction) => {
    if (direction === "prev" && notesPage > 1) setNotesPage(notesPage - 1);
    if (direction === "next" && notesPage < totalNotesPages) setNotesPage(notesPage + 1);
  };

  const handleVideosPagination = (direction) => {
    if (direction === "prev" && videosPage > 1) setVideosPage(videosPage - 1);
    if (direction === "next" && videosPage < totalVideosPages) setVideosPage(videosPage + 1);
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
    setIsGradeSelected(e.target.value !== "");
  };

  
  return (
    <>
      <Navbar />
      {loading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen p-6 bg-custom-page">
          {/* Subject Search Bar */}
          <div className="flex flex-col items-center justify-center p-3 mt-20 mb-6 rounded-lg md:flex-row bg-custom-light-green">
            <div className="flex flex-col items-center mb-4 md:items-start md:flex-row md:mb-0">
              <label htmlFor="subject" className="mr-2 font-semibold text-custom-black">Subject:</label>
              <input
                id="subject"
                type="text"
                placeholder="Search subject here"
                className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-[400px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Grade Dropdown */}
            <div className="flex flex-col items-center mb-4 md:items-start md:flex-row md:mb-0">
              <label htmlFor="grade" className="mr-2 font-semibold text-custom-black">&nbsp;&nbsp;&nbsp;Grade:</label>
              <select
                id="grade"
                className={`px-4 py-2 w-full max-w-[400px] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${isGradeSelected ? 'text-custom-black' : 'text-gray-400'}`}
                value={grade}
                onChange={handleGradeChange}
              >
                <option className="text-custom-black" value="" disabled hidden>
                  Select Grade
                </option>
                <option className="text-gray-700" value="">All</option>
                {Array.from({ length: 13 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="text-gray-700">
                    Grade {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="flex items-center px-4 py-2 ml-2 transition duration-200 rounded-md bg-custom-orange text-custom-white hover:bg-orange-600 active:bg-orange-700"
              onClick={handleSearch}
            >
              SEARCH
            </button>
          </div>

          {/* Notes Section */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-center">Notes</h2>
            <div className="relative flex items-center">
              <MdChevronLeft
                className={`text-custom-white text-5xl cursor-pointer absolute left-0 z-10 rounded-f bg-custom-lightb rounded-full p-1 shadow-md ${notesPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleNotesPagination("prev")}
                disabled={notesPage === 1}
              />
              <div className="grid w-[1280px] h-auto gap-6 md:grid-cols-3 mx-auto">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div
                      key={note._id}
                      className="relative flex flex-col items-center justify-between w-auto h-auto p-4 overflow-hidden border shadow-xl cursor-pointer rounded-xl"
                      onClick={() => setSelectedPdf(note)}
                      style={{ background: 'white' }}
                    >
                      <img src={PDFIMAGE} alt="Book" className="w-[1280px] h-auto object-contain mb-3 rounded-xl" />
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-800">{note.title}</h3>
                        <p className="text-sm text-gray-700">{note.grade} - {note.subject}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-64 col-span-3">
                    <p className="text-center text-gray-500">No notes available.</p>
                  </div>
                )}
              </div>
              <MdChevronRight
                className={`text-custom-white text-5xl cursor-pointer absolute right-0 z-10 rounded-f bg-custom-lightb rounded-full p-1 shadow-md ${notesPage === totalNotesPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleNotesPagination("next")}
                disabled={notesPage === totalNotesPages}
              />
            </div>
          </div>

          {/* Pre-recorded Seminars Section */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-center">Pre-recorded Seminars</h2>
            <div className="relative flex items-center">
              <MdChevronLeft
                className={`text-custom-white text-5xl cursor-pointer absolute left-0 z-10 rounded-f bg-custom-lightb rounded-full p-1 shadow-md ${videosPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleVideosPagination("prev")}
                disabled={videosPage === 1}
              />
              <div className="grid w-[1280px] h-auto gap-6 md:grid-cols-3 mx-auto">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div
                      key={video._id}
                      className="relative flex flex-col items-center justify-between h-auto p-4 overflow-hidden border shadow-xl cursor-pointer w-1280px rounded-xl"
                      onClick={() => setSelectedVideo(video)}
                      style={{ background: 'white' }}
                    >
                      <img src={VIDEOIMAGE} alt="Video" className="w-[1280px] h-auto object-contain mb-3 rounded-xl" />
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                        <p className="text-sm text-gray-700">{video.grade} - {video.subject}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-64 col-span-3">
                    <p className="text-center text-gray-500">No seminars available.</p>
                  </div>
                )}
              </div>
              <MdChevronRight
                className={`text-custom-white text-5xl cursor-pointer absolute right-0 z-10 rounded-f bg-custom-lightb rounded-full p-1 shadow-md ${videosPage === totalVideosPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleVideosPagination("next")}
                disabled={videosPage === totalVideosPages}
              />
            </div>
          </div>

          {/* Video Modal */}
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

          {/* PDF Modal */}
          <PdfModal pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />

         {/* Testimonials Section */}
          <div className="p-6 mt-10 bg-custom-page ">
            <h2 className="mb-4 text-2xl font-semibold text-center">Testimonials</h2>
            <div className="grid gap-6 md:grid-cols-3">
        
            {/* Testimonial 1 */}
            <div className="p-4 text-white rounded-lg bg-custom-blue">
              <p className="italic text-center">
              LearnHeart has transformed the way we connect with volunteers. 
              Finding experienced speakers for students was a challenge, 
              but now it is simple.
              </p>
              <p className="mt-2 font-semibold text-right">- Principal -</p>
            </div>

            {/* Testimonial 2 */}
            <div className="p-4 text-white rounded-lg bg-custom-blue">
              <p className="italic text-center">
              As a volunteer, I wanted to give back to rural schools, but finding the right opportunities was difficult. 
              It&apos;s an incredible platform that truly bridges the gap in education!
              </p>
              <p className="mt-2 font-semibold text-right">- Volunteer -</p>
            </div>

            {/* Testimonial 3 */}
            <div className="p-4 text-white rounded-lg bg-custom-blue">
              <p className="italic text-center">
              Thanks to LearnHeart, I attended a seminar on software development that changed my perspective. 
              The resource bank also helped me access valuable study materials.
              </p>
              <p className="mt-2 font-semibold text-right">- Student -</p>
            </div>
          </div>
        </div>
      </div>
      )}
      <Footer />
    </>
  );
};

export default ResourceBank;