import { useFormik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "./moduleToolbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = yup.object({
  title: yup.string().min(4, "Title should have at least 4 characters"),
  content: yup.string().min(10, "Content should have at least 10 characters"),
});

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: { title, content, image: "" },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      updatePost(values);
      actions.resetForm();
    },
  });

  const singlePostById = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/post/${id}`);
      setTitle(data.post.title);
      setContent(data.post.content);
      setImagePreview(data.post.image.url);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching post");
    }
  };

  useEffect(() => {
    singlePostById();
  }, []);

  const updatePost = async (values) => {
    try {
      const { data } = await axios.put(`http://localhost:3001/api/posts/update/post/${id}`, values);
      if (data.success) {
        toast.success("Post updated successfully");
        navigate("/posts");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  const deletePost = async () => {
    try {
      const { data } = await axios.delete(`http://localhost:3001/api/posts/delete/post/${id}`);
      if (data.success) {
        toast.success("Post deleted successfully");
        navigate("/posts");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="py-20 bg-custom-page">
      <h2 className="mb-6 text-2xl font-bold text-center">Edit Post</h2>

      <form noValidate onSubmit={handleSubmit} className="w-full max-w-3xl p-8 mx-auto mt-4 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Post Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {touched.title && errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="mb-6">
          <ReactQuill
            theme="snow"
            placeholder="Write the post content..."
            modules={modules}
            value={values.content}
            onChange={(e) => setFieldValue("content", e)}
          />
          {touched.content && errors.content && <p className="mt-1 text-xs text-red-600">{errors.content}</p>}
        </div>

        <div className="mb-6">
          <div className="p-6 text-center border-2 border-blue-500 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) =>
                acceptedFiles.map((file) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onloadend = () => {
                    setFieldValue("image", reader.result);
                  };
                })
              }
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
          </div>
        </div>

        {imagePreview && (
          <div className="mt-4 text-center">
            <img src={imagePreview} alt="Preview" className="max-w-[100px] rounded-lg" />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 mt-6 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Post
        </button>

        <button
          type="button"
          onClick={deletePost}
          className="w-full py-3 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;