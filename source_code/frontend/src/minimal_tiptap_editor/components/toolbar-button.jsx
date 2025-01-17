import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Toggle } from "../../components/ui/toggle";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { TooltipContentProps } from "@radix-ui/react-tooltip";

/**
 * @typedef {Object} ToolbarButtonProps
 * @property {boolean} [isActive] - Whether the button is active.
 * @property {string} [tooltip] - The tooltip text to display.
 * @property {Object} [tooltipOptions] - Options for the tooltip content.
 * @extends React.ComponentPropsWithoutRef<typeof Toggle>
 */

/**
 * ToolbarButton component with tooltip and active state.
 * @param {ToolbarButtonProps} props - The props for the ToolbarButton component.
 * @param {React.Ref<HTMLButtonElement>} ref - The ref for the button element.
 * @returns {JSX.Element}
 */

const ToolbarButton = forwardRef(function ToolbarButton(
  { isActive, children, tooltip, className, tooltipOptions, ...props },
  ref
) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            size="sm"
            {...props}
            ref={ref}
            className={cn(
              "rounded disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
              {
                "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary":
                  isActive,
              },
              className
            )}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent {...tooltipOptions}>
            <div className="flex flex-col items-center text-center">
              {tooltip}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});

ToolbarButton.displayName = "ToolbarButton";

export { ToolbarButton };
