import { useState } from "react";
import api from "../api/axiosInstance";

const CreatePostForm = ({ onPostCreated }) => {
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const createPost = async (event) => {
    event.preventDefault();
    if (!text && !imageFile) {
      setErrMsg("Give anyone's details");
      return;
    }
    try {
      setErrMsg("");
      setLoading(true);

      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const response = await api.post("/post", { text, image: imageUrl });
      setText("");
      setImageFile(null);
      onPostCreated(response?.data?.post);
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="new-post-container">
      <h1 className="post-head">Create Post</h1>
      <form onSubmit={createPost} className="new-post">
        <label htmlFor="content">Write Something</label>
        <textarea
          id="content"
          rows={5}
          cols={30}
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />
        <label htmlFor="image">Upload image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading} className="post-button">
          {loading ? "Posting..." : "Post"}
        </button>
        {errMsg && <p className="post-error">{errMsg}</p>}
      </form>
    </div>
  );
};

export default CreatePostForm;
