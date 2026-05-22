"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useEffect, useRef } from "react";
import { $createParagraphNode, $createTextNode, $getRoot, FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import type { EditorState, LexicalEditor } from "lexical";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function hasHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function loadInitialContent(editor: LexicalEditor, value: string) {
  const root = $getRoot();
  root.clear();

  if (!value.trim()) {
    root.append($createParagraphNode());
    return;
  }

  if (!hasHtml(value)) {
    value
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .forEach((text) => {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(text));
        root.append(paragraph);
      });
    return;
  }

  const parser = new DOMParser();
  const dom = parser.parseFromString(value, "text/html");
  const nodes = $generateNodesFromDOM(editor, dom);

  if (nodes.length > 0) {
    root.append(...nodes);
  } else {
    root.append($createParagraphNode());
  }
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 transition hover:border-[#026D9B] hover:text-[#026D9B]"
    >
      {children}
    </button>
  );
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
      <ToolbarButton title="Negrito" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        B
      </ToolbarButton>
      <ToolbarButton title="Italico" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        I
      </ToolbarButton>
      <ToolbarButton title="Sublinhado" onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        U
      </ToolbarButton>
      <ToolbarButton title="Lista com marcadores" onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        Lista
      </ToolbarButton>
      <ToolbarButton title="Lista numerada" onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        1.
      </ToolbarButton>
      <ToolbarButton title="Desfazer" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        Desfazer
      </ToolbarButton>
      <ToolbarButton title="Refazer" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        Refazer
      </ToolbarButton>
    </div>
  );
}

function OnChangeHtmlPlugin({ onChange }: { onChange: (html: string) => void }) {
  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      onChange($generateHtmlFromNodes(editor));
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

function InitialHtmlPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    editor.update(() => {
      loadInitialContent(editor, value);
    });
  }, [editor, value]);

  return null;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const initialConfig = {
    namespace: "CampaignRichTextEditor",
    nodes: [ListNode, ListItemNode, LinkNode, AutoLinkNode],
    onError(error: Error) {
      throw error;
    },
    theme: {
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
      },
      list: {
        ul: "list-disc pl-6",
        ol: "list-decimal pl-6",
        listitem: "my-1",
      },
    },
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <InitialHtmlPlugin value={value} />
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-80 w-full resize-y overflow-auto px-4 py-3 text-base leading-7 outline-none [&_a]:text-[#053B80] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6" />
            }
            placeholder={
              <div className="pointer-events-none absolute left-0 top-0 px-4 py-3 text-sm text-gray-400">
                Escreva o conteudo completo da campanha, como um artigo: contexto, objetivo, regras e detalhes importantes.
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <OnChangeHtmlPlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
