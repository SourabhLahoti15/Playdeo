import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const updatePost = (updatedPost) => {
    setPosts(prev =>
      prev.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};