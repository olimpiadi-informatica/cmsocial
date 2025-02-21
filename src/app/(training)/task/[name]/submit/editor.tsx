import { useEffect, useId, useRef } from "react";

import { shikiToMonaco } from "@shikijs/monaco";
import * as monaco from "monaco-editor-core";
import { createHighlighter } from "shiki";

import type { Language } from "~/lib/language";
import { useTheme } from "~/lib/theme";

const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["c", "cpp", "python", "pascal", "java"],
});

self.MonacoEnvironment = {
  getWorker: (_moduleId: string, label: string) => {
    if (label !== "editorWorkerService") throw new Error(`Unknown module: ${label}`);
    return new Worker(
      new URL("monaco-editor-core/esm/vs/editor/editor.worker.js", import.meta.url),
    );
  },
};

type Props = {
  language: Language;
  languages: Language[];
  onChange: (value: string) => void;
  file?: File;
};

export default function Editor({ language, languages, file, onChange }: Props) {
  useEffect(() => {
    const loadedLangs = new Set(monaco.languages.getLanguages().map((lang) => lang.id));
    for (const lang of languages) {
      const id = lang.toLowerCase();
      if (loadedLangs.has(id)) continue;
      monaco.languages.register({ id });
    }
    shikiToMonaco(highlighter, monaco);

    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "github-dark"
      : "github-light";
    monaco.editor.setTheme(theme);
  }, [languages]);

  const id = useId();
  const defaultLang = useRef(language);

  const model = useRef<monaco.editor.ITextModel | null>(null);
  useEffect(() => {
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "github-dark"
      : "github-light";

    const container = document.getElementById(id)!;

    const defaultValue = localStorage.getItem("editor-source-code") ?? initialCode;

    const editor = monaco.editor.create(container, {
      value: defaultValue,
      language: defaultLang.current.toLowerCase(),
      theme: defaultTheme,
      automaticLayout: true,
    });
    model.current = editor.getModel();

    onChange(defaultValue);
    editor.onDidChangeModelContent(() => {
      onChange(model.current?.getValue() ?? "");
      localStorage.setItem("editor-source-code", model.current?.getValue() ?? "");
    });

    return () => editor?.dispose();
  }, [id, onChange]);

  useEffect(() => {
    if (model.current) {
      monaco.editor.setModelLanguage(model.current, language.toLowerCase());
    }
  }, [language]);

  const theme = useTheme();
  useEffect(() => {
    if (theme) {
      monaco.editor.setTheme(theme === "dark" ? "github-dark" : "github-light");
    }
  }, [theme]);

  useEffect(() => {
    if (!file || file.size > 100_000) return;
    file.text().then((text) => {
      if (model.current) model.current.setValue(text);
    });
  }, [file]);

  return <div id={id} />;
}

const initialCode = `\
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, world!" << endl;
  return 0;
}
`;
