import Header from "../reusable/Header";
import { useToast } from "../components/ui/use-toast";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import Footer from "../reusable/Footer";
import { MinimalTiptapEditor } from "../minimal_tiptap_editor";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

function Write() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const { toast } = useToast();

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

  const handleSavePost = async () => {
    if (!title.trim()) {
      setError("Please enter a heading.");
      toast({
        variant: "destructive",
        title: "Missing Title",
        description: "Please provide a title for your post.",
      });
      return;
    }

    if (!userDetails) {
      console.error("User details not available.");
      return;
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", value);
    formData.append("CreatedAt", new Date().toISOString());
    formData.append("UpdatedAt", new Date().toISOString());
    formData.append("EditorId", userDetails.userId);
    formData.append("NumViews", 0);
    formData.append("AvgRating", 0);
    formData.append("NumRatings", 0);
    formData.append("NumComments", 0);

    if (image) {
      formData.append("headerImage", image);
    }

    console.log(formData);

    try {
      const response = await fetch("http://localhost:5232/api/Posts", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error saving post: ${response.statusText}`);
      }

      const responseBody = await response.json();
      console.log("Post saved successfully:", responseBody);

      if (responseBody.post.postId) {
        await addTags(responseBody.post.postId);
        navigate("/feed");
      } else {
        console.log("Unexpected response:", responseBody);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }

    setError("");
  };

  const [pressedTags, setPressedTags] = useState([]);
  const [tags, setTags] = useState([]);

  const toggleTag = (tag) => {
    setPressedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:5232/api/Categories");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTags(data.$values);
        console.log("Tags fetched successfully:", data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const addTags = async (postId) => {
    try {
      for (const tagTitle of pressedTags) {
        const tag = tags.find((t) => t.title === tagTitle);
        if (tag) {
          const tagData = {
            postId: postId,
            categoryId: tag.categoryId,
          };

          console.log("Tag data:", tagData);

          const response = await fetch(
            "http://localhost:5232/api/postCategories",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tagData),
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Tag saved successfully:", data);
        }
      }
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <div className="flex-1 pt-[10vh] flex flex-col w-screen">
        <div className="flex-1 items-center h-full pl-[10vw]">
          <h2 className="font-bold text-xlg pb-[1vh]">
            Narrate your blog post below
          </h2>
          <h2 className="font-nunito text-sm pb-[2vh]">Tell us your story.</h2>
          <Input
            type="text"
            className="border border-secondary bg-background rounded-lg p-2 mb-4 md:w-[60%] w-[80%]"
            placeholder="Title your post (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            id="picture"
            className="border border-secondary bg-background rounded-lg p-2 mb-4 md:w-[60%] w-[80%]"
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                setImage(event.target.files[0]);
              }
            }}
          ></Input>
          {image && (
            <div className="flex m-2">
              <Avatar>
                <AvatarImage
                  className="w-8 h-8 rounded-full"
                  src={URL.createObjectURL(image)}
                />
                <AvatarFallback>PP</AvatarFallback>
              </Avatar>
            </div>
          )}
          <MinimalTiptapEditor
            className="h-fit-content md:w-[60%] w-[80%]"
            id="post"
            value={value}
            onValueChange={setValue}
            outputValue="html"
            disabled={false}
            contentClass="max-w-3xl mx-auto"
          />
          <div className="flex-none mt-4 mb-4">
            <Button
              onClick={handleSavePost}
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>
      <div className="md:fixed bg-transparent flex flex-col items-center overflow-y-auto border md:h-[60vh] h-[30vh] md:w-[20vw] w-full rounded-xlg md:right-12 md:top-[25vh] top-[10vh] hide-scrollbar">
        <h2 className="text-lg pb-[2vh] pt-[7vh] ">Tags</h2>
        <div className="pb-[5vh] md:pb-0 flex flex-wrap gap-4 justify-center bg-transparent">
          {tags.map((tag) => (
            <Button
              key={tag.category_id}
              onClick={() => toggleTag(tag.title)}
              className={`px-3 py-2 rounded-xlg ${
                pressedTags.includes(tag.title)
                  ? "bg-gray-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {tag.title}
            </Button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Write;
