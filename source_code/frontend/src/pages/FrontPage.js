("use client");
import React from "react";
import { useState, useEffect, useRef } from "react";
import imageUrl from "../assets/Irises1.jpg";
import imageUrl2 from "../assets/Irises2.jpg";
import imageUrl3 from "../assets/Irises3.webp";
import { Button } from "../components/ui/button";
import { Card, CardImage } from "../components/ui/card";
import { MoveRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Calendar } from "../components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import Header from "../reusable/Header";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";

function FrontPage() {
  const navigate = useNavigate();
  const [openLocation, setOpenLocation] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [userNotExist, setUserNotExist] = useState(false);

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    PhoneNum: "",
    DateOfBirth: "",
    CityStateCountry: "",
    PassHash: "",
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    UserRole: 0,
    About: "",
    ProfilePic: "",
    FirstName: "",
    LastName: "",
    Gender: "",
  });

  const genders = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
    {
      value: "other",
      label: "Other",
    },
  ];

  const locations = [
    {
      value: "Karachi, Pakistan",
      label: "Karachi, Pakistan",
    },
    {
      value: "Lahore, Pakistan",
      label: "Lahore, Pakistan",
    },
    {
      value: "Mumbai, India",
      label: "Mumbai, India",
    },
    {
      value: "New York, USA",
      label: "New York, USA",
    },
    {
      value: "Boston, USA",
      label: "Boston, USA",
    },
  ];

  const [loginData, setLoginData] = useState({
    UserName: "",
    PassHash: "",
  });

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [date, setDate] = useState(null);

  const handleDateSelect = (selectedDate) => {
    const isoDate = selectedDate.toISOString();
    setDate(selectedDate);
    setFormData({ ...formData, DateOfBirth: isoDate });
  };

  const handleRegister = async () => {
    try {
      console.log("Handle Register function called");

      console.log(formData);

      const response = await fetch("http://localhost:5232/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error during registration: ${response.statusText}`);
      }

      const responseBody = await response.json();

      console.log(responseBody);

      if (responseBody.message === "This Username has already been taken.") {
        setShowChangeUsername(true);
      } else {
        if ((responseBody.statusCode = 500))
          alert(
            "Registration successful. Please log in with your new username and password."
          );
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Handle Login function called");
      console.log(loginData);

      const response = await fetch("http://localhost:5232/api/Account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error during login: ${response.statusText}`);
      }

      const responseBody = await response.json();

      console.log(responseBody);

      if (responseBody.status === "failure") {
        console.log(responseBody.message);
        setUserNotExist(true);
      }

      if (
        responseBody.status === "success" &&
        responseBody.message === "Login successful"
      ) {
        console.log("Login successful!");
        navigate("/feed");
      } else {
        console.log("Unexpected response:", responseBody);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const data = [
    {
      title: "Featured Blog Post 1",
      imageUrl: imageUrl,
    },
    {
      title: "Featured Blog Post 2",
      imageUrl: imageUrl2,
    },
    {
      title: "Featured Blog Post 3",
      imageUrl: imageUrl3,
    },
  ];

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [step, setStep] = useState(1);

  const handleClickOpenLogin = () => {
    setUserNotExist(false);
    setOpenLogin(true);
  };

  const handleClickOpenRegister = () => {
    setShowChangeUsername(false);
    setOpenRegister(true);
  };

  const handleGoBack = () => {
    setStep(step - 1);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const scrollContainerRef = useRef(null);

  const handleScroll = (event) => {
    if (
      isLandscapeOrientation() &&
      scrollContainerRef.current &&
      event.deltaY
    ) {
      scrollContainerRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener("wheel", handleScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  const isLandscapeOrientation = () => {
    return window.innerWidth >= window.innerHeight;
  };

  return (
    <div className="h-screen overflow-x-hidden md:overflow-x-auto overflow-y-hidden bg-background justify-between flex flex-col">
      <Header></Header>

      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Tags you are interested in</DialogTitle>
            <DialogDescription>
              Your feed will be curated based on these interests
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div
        className="overflow-x-hidden md:overflow-x-auto md:overflow-y-hidden h-full md:mt-0 mt-[8vh]"
        ref={scrollContainerRef}
      >
        <div className="flex md:flex-row flex-col">
          <div className="flex-[30_0_50vw] flex flex-col gap-5 pl-[10vw] pt-20">
            <h1 className="text-5xl">
              Narrate your stories, post your pictures, inspire the world.
            </h1>
            <h4>
              "First of all, let me get something straight. This is a JOURNAL,
              not a diary." - Jeff Kinney
            </h4>
            <div className="flex justify-start">
              <div className="flex flex-col gap-[5px] items-center">
                <div className="flex flex-row items-center gap-2">
                  <MoveRight />
                  <Dialog className="mx-auto max-w-sm">
                    <DialogTrigger>
                      <Button
                        variant="custom"
                        size="custom"
                        onClick={handleClickOpenLogin}
                      >
                        Log In
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Login</DialogTitle>
                        <DialogDescription>
                          Enter your email and password below to login to your
                          account
                        </DialogDescription>
                      </DialogHeader>
                      {userNotExist && (
                        <p className="text-red-500 text-xs mt-1">
                          This user does not exist. Please register first.
                        </p>
                      )}
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="username">username</Label>
                          <Input
                            id="username"
                            type="UserName"
                            placeholder="Username"
                            name="UserName"
                            required
                            onChange={handleLoginInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label htmlFor="PassHash">Password</Label>
                            <a
                              href="#"
                              className="ml-auto inline-block text-sm underline"
                            >
                              Forgot your password?
                            </a>
                          </div>
                          <Input
                            id="password"
                            name="PassHash"
                            type="password"
                            onChange={handleLoginInputChange}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          onClick={handleLogin}
                        >
                          Login
                        </Button>
                        <Button variant="outline" className="w-full">
                          Login with Google
                        </Button>
                      </div>
                      <div className="flex flex-row gap-2 items-center justify-center mt-4 text-center text-sm pb-2">
                        <div>Don't have an account?</div>
                        <a href="/" className="underline">
                          Sign up
                        </a>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <MoveRight />
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        variant="custom"
                        size="custom"
                        onClick={handleClickOpenRegister}
                      >
                        Register
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mx-auto max-w-sm p-4">
                      {step === 1 && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl">
                              Sign Up
                            </DialogTitle>
                            <DialogDescription>
                              Enter your information to create an account
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input
                                  id="first-name"
                                  placeholder="First Name"
                                  name="FirstName"
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input
                                  id="last-name"
                                  placeholder="Last Name"
                                  name="LastName"
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                name="Email"
                                placeholder="m@example.com"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                type="text"
                                placeholder="Username..."
                                required
                                name="Username"
                                onChange={handleInputChange}
                                id="username"
                              ></Input>
                              {showChangeUsername && (
                                <p className="text-red-500 text-xs mt-1">
                                  This username is already taken.
                                </p>
                              )}
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="phone_num">Phone Number</Label>
                              <Input
                                type="text"
                                placeholder="Phone number..."
                                name="PhoneNum"
                                onChange={handleInputChange}
                                id="phone_num"
                              ></Input>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                name="PassHash"
                                type="password"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <Button
                              type="button"
                              className="w-full"
                              onClick={handleNextStep}
                            >
                              Next
                            </Button>
                          </div>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="text-xl">
                              Sign Up
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="location">Location</Label>
                              <Popover
                                open={openLocation}
                                onOpenChange={setOpenLocation}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openLocation}
                                    className="justify-between"
                                  >
                                    {location
                                      ? locations.find(
                                          (loc) => loc.value === location
                                        )?.label
                                      : "Select Location..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-100 p-0">
                                  <Command>
                                    <CommandInput placeholder="Search location..." />
                                    <CommandEmpty>
                                      No location found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {locations.map((loc) => (
                                        <CommandList key={loc.value}>
                                          <CommandItem
                                            value={loc.value}
                                            onSelect={(selectedLocation) => {
                                              setLocation(selectedLocation);
                                              setFormData({
                                                ...formData,
                                                CityStateCountry:
                                                  selectedLocation,
                                              });
                                              setOpenLocation(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                location === loc.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {loc.label}
                                          </CommandItem>
                                        </CommandList>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="gender">Gender</Label>
                              <Popover
                                open={openGender}
                                onOpenChange={setOpenGender}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openGender}
                                    className="justify-between"
                                  >
                                    {gender
                                      ? genders.find((g) => g.value === gender)
                                          ?.label
                                      : "Select Gender..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-100 p-0">
                                  <Command>
                                    <CommandInput placeholder="Search gender..." />
                                    <CommandEmpty>
                                      No gender found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {genders.map((g) => (
                                        <CommandList key={g.value}>
                                          <CommandItem
                                            value={g.value}
                                            onSelect={(selectedGender) => {
                                              setGender(selectedGender);
                                              setFormData({
                                                ...formData,
                                                Gender: selectedGender,
                                              });
                                              setOpenGender(false); // Close the popover after selecting
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                gender === g.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {g.label}
                                          </CommandItem>
                                        </CommandList>
                                      ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="dob">Date of Birth</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? (
                                      format(date, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-background">
                                  <Calendar
                                    className={"bg-background"}
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="grid gap-2">
                              <div className="flex flex-row gap-[3px] items-center">
                                <Checkbox id="terms"></Checkbox>
                                <Label htmlFor="terms">
                                  I have read and agreed to the terms and
                                  conditions
                                </Label>
                              </div>
                            </div>
                            <Button
                              type="go_back"
                              onClick={handleGoBack}
                              className="w-full border bg-background"
                            >
                              Go Back
                            </Button>
                            <Button
                              type="submit"
                              className="w-full"
                              onClick={handleRegister}
                            >
                              Register
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-[30_0_30vw] h-screen flex md:flex-row flex-col justify-start items-start gap-[5vw] bg-transparent pl-[16vw] pt-10 pr-[24vw]">
            {data.map((post, index) => (
              <div key={index} className="relative m-5 right-[30px]">
                <Card className="relative md:h-[400px] md:w-[250px] rounded-3xl overflow-hidden shadow h-[150px] w-[250px]">
                  <div className="absolute top-[30px] left-[30px] z-2">
                    <p className="text-white font-bold font-nunito">
                      {post.title}
                    </p>
                  </div>
                  <div className="h-full w-full">
                    <CardImage
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full z-1 filter brightness-80 transition-transform duration-300 ease object-cover transform hover:scale-110"
                    />
                  </div>
                </Card>
              </div>
            ))}
            <div className="font-bold text-xlg pl-5 pt-20 pb-20 md:pb-0">
              Thanks for visiting!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FrontPage;
