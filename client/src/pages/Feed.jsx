import { useState, useEffect } from "react";
import api from "../api/axiosInstance";

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
        setErrMsg(err?.response?.data?.message);
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  const loadingView = () => <div className="loading-view">Loading...</div>; 

  const postDetails = () => {
      return <h1>Post</h1>
  }

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
