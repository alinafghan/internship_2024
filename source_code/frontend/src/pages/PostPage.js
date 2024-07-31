import React, { useState, useEffect } from "react";
import Header from "../reusable/Header";
import Footer from "../reusable/Footer";
import CommentRatings from "../components/ui/commentratings";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Card } from "../components/ui/card";
import { Eye, MessageSquare, Star } from "lucide-react";
import Sidebar from "../reusable/Sidebar";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Trash2, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "../components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";

function Post() {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [editorDetails, setEditorDetails] = useState([]);
  const [comments, setComments] = useState([""]);
  const [comment, setComment] = useState([""]);
  const { postId } = useParams();
  const [userDetails, setUserDetails] = useState([]);
  const [editorId, setEditorId] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:5232/api/Account/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseBody = await response.json();
        setUserDetails(responseBody);
        console.log("user details saved as:", responseBody);
      } catch (error) {
        console.error("Error getting user details:", error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchCommentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5232/api/Comments/post/${postId}/with-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 404) {
          console.log("this post has no comments");
          setComments(["this post has no comments"]);
        }
        if (!response.ok) {
          throw new Error("Error getting comment details");
        }

        const responseBody = await response.json();
        console.log("commenter details saved as:", responseBody);
        setComments(responseBody.$values);
      } catch (error) {
        console.error("error fetching comments:", error);
      }
    };
    fetchCommentDetails();
  }, [postId]);

  const viewData = {
    postId: postId,
    userId: userDetails.userId,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };

  const commentData = {
    postId: postId,
    userId: userDetails.userId,
    content: comment,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
  };

  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5232/api/Posts/${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error getting post details");
        }

        const responseBody = await response.json();
        setPostDetails(responseBody);
        console.log("post details saved as:", postDetails);

        if (responseBody.editorId) {
          setEditorId(responseBody.editorId);
          const userResponse = await fetch(
            `http://localhost:5232/api/users/${responseBody.editorId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!userResponse.ok) {
            throw new Error("Error getting editor details");
          }

          const editorResponseBody = await userResponse.json();
          setEditorDetails(editorResponseBody);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    const postViews = async () => {
      if (userDetails.userId !== editorId) {
        try {
          const response = await fetch(`http://localhost:5232/api/Views`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(viewData),
          });
          if (!response.ok) {
            throw new Error("Error posting post views");
          }
        } catch (error) {
          console.error("Error getting post views:", error);
        }
      }
    };
    postViews();
  }, [userDetails, editorId]);

  const postRating = async (newRating) => {
    try {
      const response = await fetch(`http://localhost:5232/api/Ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          userId: userDetails.userId,
          rating1: newRating, //rating1 since table and column name same in C# cause exception
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Error posting rating");
      }
      console.log("ratings sent");
    } catch (error) {
      console.error("Error posting rating:", error);
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetch(
        `http://localhost:5232/api/Posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting post");
      }
      console.log("post deleted");
      navigate("/feed");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  function timeAgo(date1) {
    const date = new Date(date1);
    const seconds = Math.floor((new Date() - date) / 1000);
    console.log("seconds", seconds);

    const interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years ago";
    }
    if (interval === 1) {
      return interval + " year ago";
    }

    const months = Math.floor(seconds / 2628000);
    if (months > 1) {
      return months + " months ago";
    }
    if (months === 1) {
      return months + " month ago";
    }

    const days = Math.floor(seconds / 86400);
    if (days > 1) {
      return days + " days ago";
    }
    if (days === 1) {
      return days + " day ago";
    }

    const hours = Math.floor(seconds / 3600);
    if (hours > 1) {
      return hours + " hours ago";
    }
    if (hours === 1) {
      return hours + " hour ago";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes > 1) {
      return minutes + " minutes ago";
    }
    if (minutes === 1) {
      return minutes + " minute ago";
    }

    return "just now";
  }

  const postComments = async (e) => {
    e.preventDefault();
    console.log("this is what we r sending", commentData);
    try {
      const response = await fetch(`http://localhost:5232/api/Comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Error posting comments");
      }

      const responseBody = await response.json();
      console.log("this is the response", responseBody);
      navigate(0);
    } catch (error) {
      console.error("error posting comments:", error);
    }
  };

  return (
    <div className="body min-h-screen flex flex-col">
      <Header />
      <Sidebar />
      <div className="main ml-[5%] mr-[25%] md:w-[65%] w-[90%] flex-1">
        {postDetails && (
          <div className="postbody text-md mt-[20vh]">
            <Card className="bg-white dark:bg-background text-black dark:text-white shadow-black relative shadow border-md pt-[8vh]">
              {userDetails && userDetails.userId === editorId && (
                <div className="absolute top-2 right-0 text-red-400 hover:underline">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => navigate("/insights")}
                        >
                          <TrendingUp strokeWidth={1}></TrendingUp>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Go to Post Insight page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog>
                    <DialogTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost">
                              <Trash2 strokeWidth={1}></Trash2>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Post</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col justify-center justify-content text-center items-center w-[30vw]">
                      <div className="text mt-5">
                        Are you sure you want to delete this post?
                      </div>
                      <div className="flex flex-row gap-5">
                        <DialogClose asChild>
                          <Button>No</Button>
                        </DialogClose>
                        <Button className="bg-red-500 " onClick={deletePost}>
                          Yes, I am sure
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              <div className="flex flex-col items-center gap-[3vh] mb-[8%] px-[5vw]">
                <div className="flex flex-col items-center">
                  <div className="title font-bold text-xlg">
                    {postDetails.title}
                  </div>
                </div>
                <div className="user text-md flex flex-row gap-[1vw] items-center">
                  <Avatar>
                    <AvatarImage src={editorDetails.profilePic} />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <b>Narrated by:</b> {editorDetails.userName}
                  </p>
                </div>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: postDetails.content }}
                ></div>
              </div>
              <div className="user flex flex-row justify-between">
                <div className="stats flex justify-start p-[10px] gap-[2vw]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p
                          className="flex flex-row text-sm items-center gap-[1vw]"
                          onClick={toggleCommentsVisibility}
                        >
                          <MessageSquare strokeWidth={1} />
                          {postDetails.numComments}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View More Comments</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="flex flex-row text-sm items-center gap-[1vw]">
                          <Eye strokeWidth={1} />
                          {postDetails.numViews}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{postDetails.numViews} views</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="flex flex-row text-sm items-center gap-[1vw]">
                          <Star strokeWidth={1} />
                          {postDetails.avgRating}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>average rating {postDetails.avgRating}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="mr-[2vw] mb-[2vh]">
                  <CommentRatings
                    rating={0}
                    totalStars={5}
                    size={36}
                    variant="yellow"
                    onRatingChange={postRating}
                  />
                </div>
              </div>
            </Card>

            {/* {showComments && ( */}
            <div
              className={`comments-section flex flex-row justify-between mt-[8%] transition-max-height duration-700 ease-in-out overflow-hidden ${
                showComments ? "max-h-[50rem]" : "max-h-0"
              }`}
            >
              <div className="w-[100%] flex flex-col gap-[3vh]">
                <p className="font-bold">Recent Comments</p>
                {comments.slice(0, 3).map((comment) => (
                  <div
                    key={comment.id}
                    className="comments flex flex-row gap-[1vw]"
                  >
                    <Avatar>
                      <AvatarImage
                        src={comment.profilePic}
                        alt={comment.username}
                      />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <Card className="dark:bg-background bg-white rounded-e-xlg rounded-es-xlg border border-primary p-3">
                      <div className="flex flex-col">
                        <p className="text-xsm">{comment.userName}</p>
                        <p>{comment.content}</p>
                        <p className="text-xsm">{timeAgo(comment.createdAt)}</p>
                      </div>
                    </Card>
                  </div>
                ))}
                <form
                  onSubmit={postComments}
                  className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                  x-chunk="dashboard-03-chunk-1"
                >
                  <Label htmlFor="comment" className="sr-only">
                    Message
                  </Label>
                  <Textarea
                    id="comment"
                    value={comment}
                    onChange={handleInputChange}
                    placeholder="Type your comment here..."
                    className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                  />
                  <div className="flex items-center p-3 pt-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Paperclip className="size-4" />
                            <span className="sr-only">Attach file</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Attach File</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Mic className="size-4" />
                            <span className="sr-only">Use Microphone</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          Use Microphone
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                      Upload Comment
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            {/* )} */}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Post;
