import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import emailjs from "emailjs-com";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import image6 from "../assets/images/contactUs-img/image6.png"; // Adjust the path if necessary

// Load environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSending, setIsSending] = useState(false); // Track sending state

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission with EmailJS
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true); // Set loading state

    emailjs
      .send(
        EMAILJS_SERVICE_ID, // Service ID from env
        EMAILJS_TEMPLATE_ID, // Template ID from env
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        },
        EMAILJS_PUBLIC_KEY // Public Key from env
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          setShowPopup(true);
          setIsSending(false); // Reset loading state
          setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
          setFormData({ name: "", email: "", message: "" }); // Clear form
        },
        (error) => {
          console.error("Failed to send email:", error);
          alert("Failed to send message. Please try again later.");
          setIsSending(false); // Reset loading state on error
        }
      );
  };

  return (
    <div className="relative flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-grow py-20 bg-custom-page">
        <section className="py-10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center justify-center gap-12 lg:flex-row">
              <div className="w-full p-8 rounded-lg shadow-lg bg-custom-green lg:w-1/2">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <h1 className="mb-6 text-3xl font-bold text-center text-custom-black">
                    Contact Us
                  </h1>

                  <div>
                    <label className="block mb-2 font-bold text-custom-black" htmlFor="name">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-selectBorder focus:ring-2 focus:ring-custom-blue focus:outline-none"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-bold text-custom-black" htmlFor="email">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-selectBorder focus:ring-2 focus:ring-custom-blue focus:outline-none"
                      placeholder="Your Email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-bold text-custom-black" htmlFor="message">
                      Message:
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg border-selectBorder focus:ring-2 focus:ring-custom-blue focus:outline-none"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-center space-x-16">
                    {/* Submit Button with Loading Spinner */}
                    <button
                      type="submit"
                      className={`${
                        isSending
                          ? "bg-indigo-500 cursor-not-allowed opacity-75"
                          : "bg-custom-orange hover:bg-opacity-90 hover:scale-105"
                      } text-custom-white px-6 py-2 rounded-lg transform transition-transform duration-300 flex items-center`}
                      disabled={isSending}
                    >
                      {isSending && (
                        <svg
                          className="mr-3 text-white size-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8h4l-3-3-3 3h4z"
                          ></path>
                        </svg>
                      )}
                      {isSending ? "Processing…" : "Send"}
                    </button>

                    {/* Hide Clear Button While Sending */}
                    {!isSending && (
                      <button
                        type="button"
                        onClick={() => setFormData({ name: "", email: "", message: "" })}
                        className="px-6 py-2 transition-transform duration-300 transform rounded-lg bg-custom-orange text-custom-white hover:bg-opacity-90 hover:scale-105"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex justify-center w-full lg:w-2/5">
                <img src={image6} alt="Contact-Us" className="object-contain max-h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Animated Popup Message - Centered at the Top */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="fixed top-5 left-[41%] transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 w-auto text-center"
            >
              Message submitted successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default ContactUs;
