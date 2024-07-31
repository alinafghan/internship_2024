import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

const Footer = () => {
  return (
    <footer className="bg-secondary border border-black text-gray-700 py-4 px-6 mt-[10vh] bottom-0 w-full flex justify-between items-center">
      <div>&copy; {new Date().getFullYear()} Narrate</div>
      <div className="flex space-x-4">
        <TooltipProvider>
          {" "}
          <Tooltip>
            <TooltipTrigger>
              <a href="/about" className="text-black hover:underline text-sm">
                About
              </a>
            </TooltipTrigger>
            <TooltipContent className="bg-background rounded-xlg text-sm border">
              Click to see about
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a href="/about" className="text-black hover:underline text-sm">
                Contact Details
              </a>
            </TooltipTrigger>
            <TooltipContent className="bg-background rounded-xlg text-sm border">
              Click to see contact
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a href="#privacy" className="text-black hover:underline text-sm">
                Privacy Policy
              </a>
            </TooltipTrigger>
            <TooltipContent className="bg-background rounded-xlg text-sm border">
              Privacy policy
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </footer>
  );
};

export default Footer;
