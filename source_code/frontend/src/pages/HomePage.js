"use client";
import React, { useEffect, useState } from "react";
import Header from "../reusable/Header";
import Footer from "../reusable/Footer";
import Sidebar from "../reusable/Sidebar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "../components/ui/card";
import { htmlToText } from "html-to-text";
import { useSearch } from "../reusable/SearchContext";
import InfiniteScroll from "../reusable/InfiniteScroll";
import { Loader2 } from "lucide-react";
import { Eye, MessageSquare, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

function HomePage() {
  const [postDetails, setPostDetails] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const { searchResults } = useSearch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const displayPosts = searchResults.length > 0 ? searchResults : postDetails;

  const next = async () => {
    console.log("next function called");
    setLoading(true);

    const response = await fetch(
      `http://localhost:5232/api/posts?page=${page}&limit=6`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching posts");
    }

    const data = await response.json();
    console.log("paginated posts", data.posts.$values);
    setPostDetails((prev) => [...prev, ...data.posts.$values]);
    setPage((prev) => prev + 1);

    if (data.posts.$values.length < 6) {
      console.log("no more posts");
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getExcerpt = (content, wordCount) => {
    const plainTextContent = htmlToText(content, {
      wordwrap: 130,
    });
    return (
      plainTextContent.split(" ").slice(0, wordCount).join(" ") +
      (plainTextContent.split(" ").length > wordCount ? "..." : "")
    );
  };

  return (
    <div className="bg-background overflow-y-auto wrapper min-h-screen flex flex-col">
      <Header />
      <Sidebar scrollY={scrollY} />
      <div className="flex flex-1 flex-col gap-[5vh] pl-[6vw] pt-[14vh] pb-[14vh] scrollbar-none w-[80vw] mr-[20vw]">
        <div className="header text-xlg font-bold">Explore your interests</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-none w-[66vw]">
          {displayPosts.map((post) => (
            <div key={post.id} className="relative m-4">
              <div className="relative h-[63vh] md:w-[26vw] w-[64vw]">
                <Card
                  href={`/posts/${post.postId}`}
                  className="relative h-[60vh] shadow shadow-md md:w-[26vw] w-[64vw] overflow-hidden rounded-xlg bg-white flex flex-col items-center justify-center"
                >
                  <CardHeader className="w-full h-[10vh]">
                    <CardTitle className=" text-xl font-bold flex items-center text-black">
                      {getExcerpt(post.title, 3)}
                    </CardTitle>
                  </CardHeader>
                  <CardImage
                    src={post.headerImage}
                    alt={post.title}
                    className="h-[30vh] w-full z-1 border filter brightness-60 transition-transform duration-300 ease object-cover transform hover:scale-110"
                  />
                  <CardFooter className="w-full h-[20vh] text-black pt-2">
                    {getExcerpt(post.content, 10)}
                  </CardFooter>
                </Card>
                <div className="flex justify-center items-center">
                  <div className="bg-secondary absolute z-50 bottom-0 w-[60%] h-[6vh] rounded-xlg border border-black">
                    <div className="flex justify-center h-full">
                      <div className="stats flex flex-row gap-2 h-full text-black">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="flex flex-row text-sm items-center">
                                <MessageSquare
                                  strokeWidth={1}
                                  fill="
#adcdde
"
                                />
                                {post.numComments}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{post.numComments} comments</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="flex flex-row text-sm items-center">
                                <Eye fill="white" strokeWidth={1} />
                                {post.numViews}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{post.numViews} views</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <p className="flex flex-row text-sm items-center">
                                <Star fill="#f0e68b" strokeWidth={1} />
                                {post.avgRating}
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>average rating {post.avgRating}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center w-[36vw]">
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
