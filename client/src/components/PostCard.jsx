import { useState } from "react";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import Cookies from "js-cookie";
import api from "../api/axiosInstance";

const PostCard = ({ post, updateLikes, updateComments }) => {
  const [commentText, setSommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const getTime = (time) => {
    return new Date(time).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const updateLike = async () => {
    try {
      setErrMsg("");
      const response = await api.post(`/post/${post._id}/like`);
      const updatedPost = response?.data;
      updateLikes(updatedPost);
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    try {
      setErrMsg("");
      setLoading(true);
      const response = await api.post(`/post/${post._id}/comment`, {
        text: commentText,
      });
      updateComments(response?.data);
      setSommentText("");
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const currentUser = JSON.parse(Cookies.get("user") || "null");
  const hasLiked = post.likes.some((u) => u._id === currentUser?.id);

  return (
    <div className="post-card">
      <section className="user-name">
        <h1 className="post-head">{post.user.name}</h1>
        <p className="post-time">{getTime(post.createdAt)}</p>
      </section>
      <section className="post-details">
        {post.text && <p className="post-text">{post.text}</p>}
        {post.image && (
          <img src={post.image} alt="image" className="post-image" />
        )}
      </section>
      <section className="behavior">
        <button onClick={updateLike} className="like-button">
          {hasLiked ? (
            <FaHeart size={24} color="red" />
          ) : (
            <FaRegHeart size={20} />
          )}
          {post.likes.length}
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="comment-button"
        >
          <FaRegComment size={20} />
          {post.comments.length}
        </button>
      </section>
      {showComments && (
        <section className="comments-section">
          {post.comments.map((comment) => {
            return (
              <div className="comments" key={comment._id}>
                <h1 className="comment-name">{comment.user.name}</h1>
                <p className="comment-time">{getTime(comment.createdAt)}</p>
                <p className="comment-text">{comment.text}</p>
              </div>
            );
          })}
          <form onSubmit={submitComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setSommentText(e.target.value)}
            />
            <button type="submit" disabled={loading} className="send-button">
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      )}
      {errMsg && <p className="post-error">{errMsg}</p>}
    </div>
  );
};

export default PostCard;
