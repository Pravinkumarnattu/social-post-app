import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import "./Feed.css"

const views = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  loading: "LOADING",
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [currView, setCurrView] = useState(views.initial);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setCurrView(views.loading);
        const response = await api.get("/post");
        setPosts(response?.data);
        setCurrView(views.success);
      } catch (err) {
        setCurrView(views.failure);
        setErrMsg(err?.response?.data?.message || "Something went wrong");
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const loadingView = () => <div className="loading-view">Loading...</div>;

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const updatedPostLikes = (updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post,
    );
    setPosts(updatedPosts);
  };

  const updatedPostComments = (updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post._id === updatedPost._id ? updatedPost : post,
    );
    setPosts(updatedPosts);
  };

  const postDetails = () => {
    return (
      <div className="posts-container">
        <section className="create-post-container">
          <CreatePostForm onPostCreated={handlePostCreated} />
        </section>
        {posts.length !== 0 ? (
          <section className="feeds-container">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                updateLikes={updatedPostLikes}
                updateComments={updatedPostComments}
              />
            ))}
          </section>
        ) : (
          <div className="no-posts">No posts available right now</div>
        )}
      </div>
    );
  };

  const failureView = () => <div className="failure-view">{errMsg}</div>;

  const render = () => {
    switch (currView) {
      case views.loading:
        return loadingView();
      case views.success:
        return postDetails();
      case views.failure:
        return failureView();
      default:
        return <></>;
    }
  };

  return <>{render()}</>;
};

export default Feed;
