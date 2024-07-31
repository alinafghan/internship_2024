import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import About from "./pages/AboutPage";
import Write from "./pages/WritePage";
import FrontPage from "./pages/FrontPage";
import HomePage from "./pages/HomePage";
import Post from "./pages/PostPage";
import Insights from "./pages/InsightPage";
import Profile from "./pages/ProfilePage";
import reportWebVitals from "./reportWebVitals";
import "typeface-nunito";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "../src/components/ui/toaster";
import { SearchProvider } from "./reusable/SearchContext";
import { Provider } from "react-redux";
import store from "./lib/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
        </Routes>
        <Routes>
          <Route path="/feed" element={<HomePage />} />
        </Routes>
        <Routes>
          <Route path="/posts/:postId" element={<Post />} />
        </Routes>
        <Routes>
          <Route path="/insights" element={<Insights />} />
        </Routes>
        <Routes>
          <Route path="/write" element={<Write />} />
        </Routes>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <Toaster></Toaster>
    </SearchProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
