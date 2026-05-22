import { useState } from "react";

const AddResource = () => {
  const [title, setTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateGrade = (value) => {
    const gradeValue = parseInt(value, 10);
    if (isNaN(gradeValue) || gradeValue <= 0 || !Number.isInteger(gradeValue)) {
      setError("Grade must be a positive integer.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return false;
    }
    return true;
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    setGrade(value);
    if (value === "") {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateGrade(grade)) {
      return;
    }
    if (type === "Note" && !pdf) {
      setError("Please upload a PDF.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    if (type !== "Note" && !url) {
      setError("Please provide a URL.");
      setTimeout(() => {
        setError("");
      }, 3000);
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("grade", grade);
    formData.append("type", type);
    formData.append("description", description);
    formData.append("subject", subject);

    if (type === "Note" && pdf) {
      formData.append("pdf", pdf);
    } else if (type !== "Note") {
      formData.append("url", url);
    }

    try {
      const response = await fetch("http://localhost:3001/api/resources", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        resetForm();
        setError("");
        setSuccess("Resource added successfully.");
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } else {
        setError("Failed to add resource. Please try again.");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch {
      setError("Error adding resource. Please check your connection.");
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setGrade("");
    setType("");
    setDescription("");
    setUrl("");
    setSubject("");
    setPdf(null);
    setSuccess("");
  };

  return (
    <>
      <div className="flex items-center justify-center px-4 bg-custom-page">
        <div className="w-full max-w-3xl p-8 space-y-6 rounded-lg shadow-2xl bg-custom-white">
          <h1 className="mb-6 text-2xl font-bold text-center text-custom-black">Add New Resource</h1>
          {error && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 mb-4 text-green-700 bg-green-100 border-l-4 border-green-500" role="alert">
              <p className="font-bold">Success</p>
              <p>{success}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1 text-sm font-medium text-custom-lightb">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block mb-1 text-sm font-medium text-custom-lightb">
                  Grade
                </label>
                <input
                  type="number"
                  id="grade"
                  value={grade}
                  onChange={handleGradeChange}
                  required
                  placeholder="Enter grade"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
                />
              </div>
              <div>
                <label htmlFor="type" className="block mb-1 text-sm font-medium text-custom-lightb">
                  Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="Note">Note</option>
                  <option value="Seminar video">Seminar video</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block mb-1 text-sm font-medium text-custom-lightb">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
                rows="3"
              ></textarea>
            </div>
            {type === "Note" && (
              <div>
                <label htmlFor="pdf" className="block mb-1 text-sm font-medium text-custom-lightb">
                  Upload PDF
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="pdf"
                    accept=".pdf"
                    onChange={(e) => setPdf(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("pdf").click()}
                    className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Choose File
                  </button>
                  <span className="text-sm text-custom-lightb">{pdf ? pdf.name : "No file chosen"}</span>
                </div>
              </div>
            )}
            {type !== "Note" && (
              <div>
                <label htmlFor="url" className="block mb-1 text-sm font-medium text-custom-lightb">
                  Resource URL
                </label>
                <input
                  type="url"
                  id="url"
                  placeholder="Enter video URL or Drive link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required={type !== "Note"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
                />
              </div>
            )}
            <div>
              <label htmlFor="subject" className="block mb-1 text-sm font-medium text-custom-lightb">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Enter subject"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-custom-light-green hover:bg-custom-green hover:text-custom-black focus:outline-none focus:ring-2 focus:ring-custom-blue focus:ring-opacity-50"
                }`}
              >
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddResource;
