import React from "react";
import Footer from "../reusable/Footer";
import Header from "../reusable/Header";
import { Separator } from "../components/ui/separator";
import {
  CardDescription,
  CardHeader,
  Card,
  CardContent,
} from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow">
        <div className="main mt-[15vh] ml-[10vw] mr-[10vw] flex flex-col md:flex-row gap-[10vw]">
          <div className="md:w-[60%] w-full space-y-8">
            <div>
              <h1 className="font-bold text-2xl pb-[4vh]">About Us</h1>
              <Separator />
              <h2 className="text-md pt-[3vh]">
                Narrate is a small-scale blogging website where anyone can come
                and share their story. You can customize your blog post
                according to your needs and upload image media to illustrate.
                Happy writing!!
              </h2>
            </div>
            <div>
              <h1 className="font-bold text-2xl pb-[4vh]">FAQ</h1>
              <Separator />
              <h2 className="text-md space-y-2 pt-[3vh]">
                <p className="font-bold">How can I make a post on Narrate?</p>
                <p>
                  ans. Click on the header button that says <i>Write</i>, type
                  out your story, upload your pictures and click post. Easy as
                  that!
                </p>
                <p className="font-bold">
                  How can I see who is viewing and rating my post?
                </p>
                <p>
                  ans. Click on your avatar at the top right of your screen.
                  This should open a side drawer, where you can click the 'View
                  your Post Insights' button to see all the stats your little
                  heart desires.
                </p>
              </h2>
            </div>
          </div>
          <div className="md:w-[30%] w-full text-lg">
            <Card className="shadow shadow-xl bg-secondary border border-2 border-text">
              <CardContent className="flex flex-col justify-content items-center">
                <CardHeader>Contact Us</CardHeader>
                <CardDescription className="flex flex-col gap-[2vh]">
                  Find our social media below.
                </CardDescription>
                <p className="flex flex-col gap-[1vh] items-center">
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="custom"
                            size="aboutCard"
                            className="text-sm pt-[4vh]"
                            onClick={() => navigate("/")}
                          >
                            Instagram
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="border-md bg-background">
                          Go to Instagram
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="custom"
                            size="aboutCard"
                            className="text-sm pt-[4vh]"
                            onClick={() => navigate("/")}
                          >
                            Twitter
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="border-md bg-background">
                          Go to Twitter
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="custom"
                            size="aboutCard"
                            className="text-sm pt-[4vh]"
                            onClick={() => navigate("/")}
                          >
                            LinkedIn
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="border-md bg-background">
                          Go to LinkedIn
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
