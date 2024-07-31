import { Separator } from "../../../components/ui/separator";
import { ToolbarButton } from "../toolbar-button";
import {
  CopyIcon,
  ExternalLinkIcon,
  LinkBreak2Icon,
} from "@radix-ui/react-icons";
import { useState } from "react";

const LinkPopoverBlock = ({ link, onClear, onEdit }) => {
  const [copyTitle, setCopyTitle] = useState("Copy");

  const handleCopy = (e) => {
    e.preventDefault();

    setCopyTitle("Copied!");
    navigator.clipboard.writeText(link.href);

    setTimeout(() => {
      setCopyTitle("Copy");
    }, 1000);
  };

  return (
    <div className="flex h-10 overflow-hidden rounded bg-background p-2 shadow-lg">
      <div className="inline-flex items-center gap-1">
        <ToolbarButton tooltip="Edit link" onClick={onEdit}>
          Edit link
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip="Open link in a new tab"
          onClick={() => window.open(link.href, "_blank")}
        >
          <ExternalLinkIcon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton tooltip="Clear link" onClick={onClear}>
          <LinkBreak2Icon className="size-4" />
        </ToolbarButton>
        <Separator orientation="vertical" />
        <ToolbarButton
          tooltip={copyTitle}
          onClick={handleCopy}
          tooltipOptions={{
            onPointerDownOutside: (e) => {
              if (e.target === e.currentTarget) e.preventDefault();
            },
          }}
        >
          <CopyIcon className="size-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export { LinkPopoverBlock };
