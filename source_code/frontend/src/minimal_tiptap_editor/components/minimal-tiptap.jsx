import React, { forwardRef } from "react";
import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Separator } from "../../components/ui/separator";
import { cn } from "../../lib/utils";
import SectionOne from "./section-1";
import SectionTwo from "./section-2";
import SectionThree from "./section-3";
import SectionFour from "./section-4";
import { ImageViewBlock } from "./image/image-view-block";
import { LinkBubbleMenu } from "./bubble-menu/link-bubble-menu";
import { Plugin, TextSelection } from "@tiptap/pm/state";
import { getMarkRange } from "@tiptap/core";
import { getOutput } from "../utils";
import { ImageBubbleMenu } from "./bubble-menu/image-bubble-menu";

/**
 * MinimalTiptapEditor component for creating a Tiptap editor instance.
 * @param {Object} props - The props for the MinimalTiptapEditor component.
 * @param {string|null|undefined} props.value - The initial content for the editor.
 * @param {'html'|'json'|'text'} [props.outputValue='html'] - The format for the editor's output.
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled.
 * @param {string} [props.contentClass] - Additional CSS classes for the editor content.
 * @param {function(string):void} props.onValueChange - Callback for when the editor content changes.
 * @param {string} [props.className] - Additional CSS classes for the editor container.
 * @param {Object} [props] - Other HTML attributes.
 * @param {React.Ref<HTMLDivElement>} ref - The ref for the editor container.
 * @returns {JSX.Element}
 */
const MinimalTiptapEditor = forwardRef(function MinimalTiptapEditor(
  {
    value,
    outputValue = "html",
    disabled,
    contentClass,
    onValueChange,
    className,
    ...props
  },
  ref
) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageViewBlock);
        },
      }),
      Link.configure({
        openOnClick: false,
      }).extend({
        // https://github.com/ueberdosis/tiptap/issues/2571
        inclusive: false,

        addProseMirrorPlugins() {
          return [
            new Plugin({
              // mark the link
              props: {
                handleClick(view, pos) {
                  const { schema, doc, tr } = view.state;
                  const range = getMarkRange(
                    doc.resolve(pos),
                    schema.marks.link
                  );

                  if (!range) {
                    return;
                  }

                  const { from, to } = range;
                  const start = Math.min(from, to);
                  const end = Math.max(from, to);

                  if (pos < start || pos > end) {
                    return;
                  }

                  const $start = doc.resolve(start);
                  const $end = doc.resolve(end);
                  const transaction = tr.setSelection(
                    new TextSelection($start, $end)
                  );

                  view.dispatch(transaction);
                },
              },
            }),
          ];
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose mx-auto focus:outline-none max-w-none prose-stone dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onValueChange(getOutput(editor, outputValue));
    },
    content: value,
    editable: !disabled,
  });

  return (
    <div
      className={cn(
        "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
        className
      )}
      {...props}
      ref={ref}
    >
      {editor && (
        <>
          <LinkBubbleMenu editor={editor} />
          <ImageBubbleMenu editor={editor} />
          <Toolbar editor={editor} />
        </>
      )}
      <div
        className="h-full grow"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} className={cn("p-5", contentClass)} />
      </div>
    </div>
  );
});

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

/**
 * Toolbar component to display various editing options.
 * @param {Object} props - The props for the Toolbar component.
 * @param {TiptapEditor} props.editor - The Tiptap editor instance.
 * @returns {JSX.Element}
 */
const Toolbar = ({ editor }) => {
  return (
    <div className="border-b border-border p-2">
      <div className="flex w-full flex-wrap items-center">
        <SectionOne editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionTwo editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionThree editor={editor} />
        <Separator orientation="vertical" className="mx-2 h-7" />
        <SectionFour editor={editor} />
      </div>
    </div>
  );
};

export { MinimalTiptapEditor };
