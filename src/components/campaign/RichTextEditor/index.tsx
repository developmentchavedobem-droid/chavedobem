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
import { getUploadUrl } from "@/src/actions/campanhas";
import { uploadToSignedCloudinary } from "@/src/utils/cloudinary-upload";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  DecoratorNode,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorState,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

type ImagePayload = {
  altText: string;
  src: string;
};

type SerializedImageNode = Spread<
  {
    altText: string;
    src: string;
    type: "campaign-image";
    version: 1;
  },
  SerializedLexicalNode
>;

const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand("INSERT_IMAGE_COMMAND");

function convertImageElement(domNode: Node): DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const src = img.getAttribute("src") || "";

  if (!src) return { node: null };

  return {
    node: $createImageNode({
      altText: img.getAttribute("alt") || "",
      src,
    }),
  };
}

class ImageNode extends DecoratorNode<React.ReactNode> {
  __altText: string;
  __src: string;

  static getType(): string {
    return "campaign-image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      altText: serializedNode.altText,
      src: serializedNode.src,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(src: string, altText: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.__altText,
      src: this.__src,
      type: "campaign-image",
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    return { element };
  }

  createDOM(): HTMLElement {
    const element = document.createElement("div");
    element.className = "my-4";
    return element;
  }

  updateDOM(): false {
    return false;
  }

  isInline(): false {
    return false;
  }

  decorate(): React.ReactNode {
    return (
      <Image
        src={this.__src}
        alt={this.__altText}
        width={1200}
        height={800}
        className="my-4 h-auto w-full rounded-xl object-cover"
      />
    );
  }
}

function $createImageNode({ altText, src }: ImagePayload): ImageNode {
  return new ImageNode(src, altText);
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const res = await getUploadUrl(file.name, file.type);
      if (!res.success || !res.uploadUrl || !res.fields) throw new Error("Erro no upload");

      const imageUrl = await uploadToSignedCloudinary(res, file);

      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: file.name,
        src: imageUrl,
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

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
      <ToolbarButton title="Inserir imagem" onClick={() => inputRef.current?.click()}>
        {uploading ? "Enviando..." : "Imagem"}
      </ToolbarButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleImageUpload(file);
        }}
      />
      <ToolbarButton title="Desfazer" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        Desfazer
      </ToolbarButton>
      <ToolbarButton title="Refazer" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        Refazer
      </ToolbarButton>
    </div>
  );
}

function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagePlugin: ImageNode nao registrado no editor");
    }

    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.insertNodes([imageNode]);
        } else {
          $insertNodes([imageNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
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
    nodes: [ListNode, ListItemNode, LinkNode, AutoLinkNode, ImageNode],
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
        <ImagePlugin />
        <OnChangeHtmlPlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}
