import { cn } from "../../lib/utils";
import { getShortcutKeys } from "../utils";

/**
 * ShortcutKey component to display a list of shortcut keys.
 * @param {Object} props - The props for the ShortcutKey component.
 * @param {string[]} props.keys - The array of shortcut keys.
 * @param {boolean} [props.withBg] - Whether to display the keys with a background.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.HTMLAttributes<HTMLSpanElement>} [props] - Other HTML attributes.
 * @returns {JSX.Element}
 */
const ShortcutKey = ({ className, keys, withBg, ...props }) => {
  return (
    <span
      className={cn("text-xs tracking-widest opacity-60", className)}
      {...props}
    >
      <span
        className={cn("ml-4", {
          "self-end rounded bg-accent p-1 leading-3": withBg,
        })}
      >
        {getShortcutKeys(keys)}
      </span>
    </span>
  );
};

ShortcutKey.displayName = "ShortcutKey";

export { ShortcutKey };
