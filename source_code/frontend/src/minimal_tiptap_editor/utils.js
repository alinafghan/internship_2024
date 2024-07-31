import { Editor } from "@tiptap/core";
import { MinimalTiptapProps } from "./components/minimal-tiptap";

export const activeItemClass =
  "bg-primary/10 hover:bg-primary/10 focus:bg-primary/10";
export const DropdownMenuItemClass =
  "flex flex-row items-center justify-between gap-4";

let isMac;

/**
 * @typedef {Object} Navigator
 * @property {Object} [userAgentData]
 * @property {Object[]} [userAgentData.brands]
 * @property {string} [userAgentData.brands.brand]
 * @property {string} [userAgentData.brands.version]
 * @property {boolean} [userAgentData.mobile]
 * @property {string} [userAgentData.platform]
 * @property {Function} [userAgentData.getHighEntropyValues]
 * @property {Promise} [userAgentData.getHighEntropyValues.hints]
 * @property {Object} [userAgentData.getHighEntropyValues.platform]
 * @property {string} [userAgentData.getHighEntropyValues.platformVersion]
 * @property {string} [userAgentData.getHighEntropyValues.uaFullVersion]
 */

/**
 * Get the platform from the user agent data or navigator.platform.
 * @returns {string}
 */
function getPlatform() {
  const nav = navigator;

  if (nav.userAgentData) {
    if (nav.userAgentData.platform) {
      return nav.userAgentData.platform;
    }

    nav.userAgentData
      .getHighEntropyValues(["platform"])
      .then((highEntropyValues) => {
        if (highEntropyValues.platform) {
          return highEntropyValues.platform;
        }
      });
  }

  if (typeof navigator.platform === "string") {
    return navigator.platform;
  }

  return "";
}

/**
 * Check if the operating system is macOS.
 * @returns {boolean}
 */
export function isMacOS() {
  if (isMac === undefined) {
    isMac = getPlatform().toLowerCase().includes("mac");
  }

  return isMac;
}

/**
 * Get the shortcut key based on the operating system.
 * @param {string} key - The key to check.
 * @returns {string}
 */
export function getShortcutKey(key) {
  if (key.toLowerCase() === "mod") {
    return isMacOS() ? "⌘" : "Ctrl";
  } else if (key.toLowerCase() === "alt") {
    return isMacOS() ? "⌥" : "Alt";
  } else if (key.toLowerCase() === "shift") {
    return isMacOS() ? "⇧" : "Shift";
  } else {
    return key;
  }
}

/**
 * Get the combined shortcut keys as a string.
 * @param {string[]} keys - The array of keys to combine.
 * @returns {string}
 */
export function getShortcutKeys(keys) {
  return keys.map((key) => getShortcutKey(key)).join("");
}

/**
 * Get the output of the editor based on the format.
 * @param {Editor} editor - The Tiptap editor instance.
 * @param {MinimalTiptapProps['outputValue']} format - The format of the output.
 * @returns {string}
 */
export function getOutput(editor, format) {
  if (format === "json") {
    const jsonValue = JSON.stringify(editor.getJSON());
    return editor.isEmpty ? "" : jsonValue;
  }

  if (format === "html") {
    return editor.getText() ? editor.getHTML() : "";
  }

  return editor.getText();
}
