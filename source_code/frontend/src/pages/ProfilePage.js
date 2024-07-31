"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import Footer from "../reusable/Footer";
import Header from "../reusable/Header";
import { CardContent, Card, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First Name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  passHash: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  gender: z.enum(["male", "female", "other"], {
    message: "Invalid gender selection.",
  }),
  phone_num: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters"),
  about: z.string().optional(),
  profilePic: z.instanceof(File).refine((file) => file.size < 7000000, {
    message: "Your profile picture must be less than 7MB.",
  }),
  DateOfBirth: z.coerce.date(),
});

function Profile() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showChangeUsername, setShowChangeUsername] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      lastName: "",
      firstName: "",
      email: "",
      gender: "",
      phone_num: 0,
      passHash: "",
      DateOfBirth: undefined,
      profilePic: undefined,
      about: "",
    },
  });

  useEffect(() => {
    const fetchUserId = async () => {
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
        console.log("Received user ID as:", responseBody.userId);
        setUserId(responseBody.userId);
      } catch (error) {
        console.error("Error getting user details:", error);
      }
    };

    fetchUserId();
  }, []);

  const deleteUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:5232/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting user");
      }
      console.log("user deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const onSubmit = async (data) => {
    const currentUserId = userId;

    if (!currentUserId) {
      console.error("User ID not found");
      return;
    }

    console.log("og data", data);

    const formData = new FormData();

    formData.append("userId", currentUserId);
    formData.append("username", data.username);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("passHash", data.passHash);
    formData.append("gender", data.gender);
    formData.append("phone_num", data.phone_num);
    formData.append("about", data.about);
    formData.append("DateOfBirth", data.DateOfBirth.toISOString());
    formData.append("CreatedAt", new Date().toISOString());
    formData.append("UpdatedAt", new Date().toISOString());
    formData.append("UserRole", 0);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    for (var key of formData.entries()) {
      console.log(key[0] + ", " + key[1]);
    }

    try {
      const response = await fetch(
        `http://localhost:5232/api/users/${currentUserId}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating profile: ${response.statusText}`);
      }

      const responseBody = await response.json();
      if (responseBody.message === "This Username has already been taken.") {
        setShowChangeUsername(true);
      }

      console.log("Profile updated successfully:", responseBody);
      setShowChangeUsername(false);

      window.location.href = "/feed";
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="mt-[15vh] mx-[10vw]">
        <Card className="bg-white shadow shadow-md shadow-black text-black dark:bg-gray-400">
          <CardHeader
            className="flex flex-row ju
          stify-between w-full"
          >
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-xlg">Profile</h1>
              <h2 className="text-md pb-[3vh]">
                This is how others will see you on the site.
              </h2>
            </div>
            <Dialog>
              <DialogTrigger>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild className="text-red-400 ">
                      <Button variant="ghost">
                        <Trash2 strokeWidth={1}></Trash2>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <DialogContent className="flex flex-col justify-center justify-content text-center items-center w-[30vw]">
                <div className="text mt-5">
                  Are you sure you want to delete your account? This action
                  cannot be undone
                </div>
                <div className="flex flex-row gap-5">
                  <DialogClose asChild>
                    <Button>No</Button>
                  </DialogClose>
                  <Button className="bg-red-500 " onClick={deleteUser}>
                    Yes, I am sure
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className="pt-[5vh]">
              <Form {...form}>
                <form
                  encType="multipart/form-data"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name. It can be your real
                          name or a pseudonym. You can only change this once
                          every 30 days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {showChangeUsername && (
                    <p className="text-red-500 text-xs mt-1">
                      This username is already taken.
                    </p>
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_num"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passHash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="DateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" id="dob" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="border rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-inherit"
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profilePic"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            {...fieldProps}
                            onChange={(event) =>
                              onChange(
                                event.target.files && event.target.files[0],
                                setProfilePic(event.target.files[0])
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* {console.log("Profile Picture value:", profilePic)} */}
                  {profilePic && (
                    <div className="flex items-center mt-2">
                      <Avatar>
                        <AvatarImage src={URL.createObjectURL(profilePic)} />
                        <AvatarFallback>PP</AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Bio..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
