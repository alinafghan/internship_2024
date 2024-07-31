import { useRef, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Menubar, MenubarMenu } from "../components/ui/menubar";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode, selectDarkMode } from "../lib/store";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from "../components/ui/sheet";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { Settings, LogOut, UserCog, UserRoundSearch } from "lucide-react";
import { FloatingLabelInput } from "../components/ui/floatinginput";
import { useSearch } from "../reusable/SearchContext";
import { AvatarFallback } from "../components/ui/avatar";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isDarkMode = useSelector(selectDarkMode);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchContainerRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const { setSearchResults } = useSearch();
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    location.pathname.substring(1) || "feed"
  );
  const [isFrontPage, setIsFrontPage] = useState(location.pathname === "/");

  useEffect(() => {
    setSearchResults([]);
  }, [setSearchResults]);

  const searchPosts = async () => {
    try {
      console.log("searching", searchInput);

      const response = await fetch(
        `http://localhost:5232/api/Search/by-category/${searchInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        console.log("No posts found for the given category.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.$values);
      console.log("Search results:", data.$values);
    } catch (error) {
      console.error("Error while searching:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5232/api/Account/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const userData = await response.json();

        console.log("header", userData.userId);

        if (userData.userId) {
          // Fetch user details by ID
          const userResponse = await fetch(
            `http://localhost:5232/api/Users/${userData.userId}`
          );
          const data = await userResponse.json();
          setUserDetails(data);

          console.log("profile picture", userDetails.profilePic);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Handle Logout function called");

      const response = await fetch("http://localhost:5232/api/Account/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error during logout: ${response.statusText}`);
      }

      const responseBody = await response.json();
      console.log(responseBody);

      if (
        responseBody.status === "success" &&
        responseBody.message === "Logout successful"
      ) {
        console.log("Logout successful!");
        setUserDetails({});
        navigate("/");
      } else {
        console.log("Unexpected response:", responseBody);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const OpenSearch = () => {
    setIsSearchVisible(true);
  };

  const CloseSearch = () => {
    setIsSearchVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleClick = (page) => {
    setSearchResults([]);
    const timestamp = new Date().getTime(); // Generate a unique key
    navigate(`/${page}?timestamp=${timestamp}`);
  };

  useEffect(() => {
    setIsFrontPage(location.pathname === "/");
  }, [location.pathname]);

  return (
    <Menubar>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 md:space-x-8">
          <MenubarMenu className="flex items-center space-x-2 md:space-x-8">
            <Button
              onClick={() => handleClick("feed")}
              variant={currentPage === "feed" ? "custom_selected" : "custom"}
              size="custom"
            >
              Home
            </Button>
            <Button
              onClick={() => handleClick("about")}
              variant={currentPage === "about" ? "custom_selected" : "custom"}
              size="custom"
            >
              About
            </Button>
            <Button
              onClick={() => handleClick("write")}
              variant={currentPage === "write" ? "custom_selected" : "custom"}
              size="custom"
            >
              Write
            </Button>
            {!isSearchVisible && (
              <Button variant="custom" size="custom" onClick={OpenSearch}>
                Search
              </Button>
            )}
          </MenubarMenu>
          {isSearchVisible && (
            <div
              className="transition-all duration-300"
              ref={searchContainerRef}
            >
              <FloatingLabelInput
                id="search"
                label="Search..."
                className="transition-all duration-300"
                autoFocus
                onClick={CloseSearch}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    searchPosts();
                  }
                }}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mr-12">
          {!isFrontPage && (
            <Sheet>
              <SheetTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userDetails.profilePic} alt="Avatar" />
                  <AvatarFallback>AA</AvatarFallback>
                </Avatar>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <div className="flex flex-col gap-4">
                    <SheetTitle>Account</SheetTitle>
                    <SheetDescription>Settings & Preferences</SheetDescription>
                    <Separator className="my-4" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={handleToggleDarkMode}
                      />
                      <span>Toggle Dark Mode</span>
                    </div>
                    <Separator className="my-2" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <UserCog />
                      <span>
                        <a href="/profile">Edit Profile</a>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRoundSearch />
                      <span>
                        <a href="/insights">View your Post Insights</a>
                      </span>
                    </div>
                    <Separator className="my-2" />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Settings />
                      <span>Settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LogOut />
                      <span>
                        <Button
                          onClick={handleLogout}
                          variant="normal"
                          size="custom"
                        >
                          Log Out
                        </Button>
                      </span>
                    </div>
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </Menubar>
  );
}

export default Header;
