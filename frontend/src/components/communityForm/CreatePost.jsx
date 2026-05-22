import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { modules } from "./moduleToolbar";

const validationSchema = yup.object({
  title: yup.string().min(4, "Title must be at least 4 characters").required("Title is required"),
  content: yup.string().min(10, "Content must be at least 10 characters").required("Content is required"),
});

const CreatePost = () => {
  const navigate = useNavigate();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      title: "",
      content: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        await axios.post("http://localhost:3001/api/posts/post/create", values);
        toast.success("Post created successfully!");
        navigate("/posts");
        actions.resetForm();
      } catch (error) {
        console.error(error);
        toast.error("Failed to create post.");
      }
    },
  });

  return (
    <div className="flex items-center justify-center bg-custom-page">
      <div>
        <form onSubmit={handleSubmit} className="w-full max-w-3xl p-8 mx-auto bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">Post Title</label>
            <input
              name="title"
              type="text"
              placeholder="Post title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.title && errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Post Content</label>
            <ReactQuill
              theme="snow"
              value={values.content}
              onChange={(e) => setFieldValue("content", e)}
              placeholder="Write your post..."
              modules={modules}
            />
            {touched.content && errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
          </div>
          <br/>
          <div className="p-4 border-2 border-blue-500 border-dashed rounded-lg">
            <Dropzone
              accept=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => {
                const reader = new FileReader();
                reader.readAsDataURL(acceptedFiles[0]);
                reader.onloadend = () => setFieldValue("image", reader.result);
              }}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} className={`p-4 text-center cursor-pointer ${isDragActive ? "bg-blue-100" : "bg-gray-100"}`}>
                  <input {...getInputProps()} />
                  {values.image ? (
                    <img className="max-w-24" src={values.image} alt="Uploaded" />
                  ) : (
                    <div>
                      <CloudUploadIcon className="mx-auto text-blue-500" />
                      <p className="text-sm text-gray-600">Drag & Drop or Click to Upload</p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div><br />

          <button type="submit" className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;