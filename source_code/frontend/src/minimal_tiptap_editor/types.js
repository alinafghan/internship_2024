import { Editor } from "@tiptap/core";
import { EditorView } from "@tiptap/pm/view";
import { EditorState } from "@tiptap/pm/state";

/**
 * @typedef {Object} LinkProps
 * @property {string} url - The URL to link to.
 * @property {string} [text] - The text to display for the link.
 * @property {boolean} [openInNewTab] - Whether to open the link in a new tab.
 */

/**
 * @typedef {Object} ShouldShowProps
 * @property {Editor} editor - The Tiptap editor instance.
 * @property {EditorView} view - The Tiptap editor view instance.
 * @property {EditorState} state - The current editor state.
 * @property {EditorState} [oldState] - The previous editor state (optional).
 * @property {number} from - The start position of the selection.
 * @property {number} to - The end position of the selection.
 */
