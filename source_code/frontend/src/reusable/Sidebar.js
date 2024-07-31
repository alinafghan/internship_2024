import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { useEffect, useRef, useState } from "react";

function Sidebar({ scrollY }) {
  const componentRef = useRef(null);
  const [Tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.scrollTo(0, scrollY);
    }
  }, [scrollY]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(
          "http://localhost:5232/api/Categories/titles"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    const getPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:5232/api/posts?page=1&limit=3`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data.posts.$values);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchTags();
    getPosts();
  }, []);

  const isSidebarDisabled = window.matchMedia("(max-width:768px)").matches;

  if (isSidebarDisabled) {
    return null;
  }

  return (
    <Card
      ref={componentRef}
      className="fixed overflow-y-auto shadow-black bg-white bottom-[25vh] h-[60vh] border border-secondary w-[20vw] rounded-xlg right-9 top-[25vh] hide-scrollbar"
    >
      <div className="flex pt-[5vh] flex-col items-center pb-[3vh]"></div>
      <div className="flex flex-col ml-[12%] bg-transparent">
        <h2 className="text-lg pb-[2vh] text-black">Staff Picks</h2>
        {posts.map((post, id) => (
          <div key={id} className="pb-[2vh]">
            <Card className="relative h-[8vh] w-[15vw] text-black overflow-hidden border-none flex flex-row items-center gap-[1vw]">
              <Avatar>
                <AvatarImage className="z-2" src={post.headerImage} />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <HoverCard className="bg-background">
                <HoverCardTrigger>
                  <a
                    href={`/posts/${post.postId}`}
                    className="text-black font-bold text-xsm font-nunito"
                  >
                    {post.title}
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col">
                  <div className="text-sm">{post.title} </div>
                  <div className="text-xsm">Click to see more</div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default Sidebar;
