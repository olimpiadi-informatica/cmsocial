import { t } from "@lingui/core/macro";

export enum Language {
  C = "c",
  Cpp = "cpp",
  CSharp = "cs",
  Dart = "dart",
  Go = "go",
  HTML = "html",
  Java = "java",
  JavaScript = "js",
  Kotlin = "kt",
  PHP = "php",
  Pascal = "pascal",
  Plain = "text",
  Pseudocode = "srs",
  Python = "py",
  Ruby = "rb",
  Rust = "rs",
  Scratch = "sb3",
  TypeScript = "ts",
  VisualBasic = "vb",
}

export function languageByName(name: string | null): Language | undefined {
  switch (name?.match(/^[A-Za-z+]+/)?.[0]) {
    case "C":
      return Language.C;
    case "C++":
      return Language.Cpp;
    case "Java":
      return Language.Java;
    case "Pascal":
      return Language.Pascal;
    case "Python":
      return Language.Python;
  }
}

export function languageExtension(language: Language): string {
  return language === Language.Pascal ? "pas" : language;
}

export function fileLanguage(fileName: string) {
  const extension = fileName.match(/\.(\w+)$/)?.[1];
  switch (extension) {
    case "c":
      return Language.C;
    case "cpp":
    case "cc":
    case "cxx":
    case "c++":
      return Language.Cpp;
    case "cs":
      return Language.CSharp;
    case "dart":
      return Language.Dart;
    case "go":
      return Language.Go;
    case "html":
      return Language.HTML;
    case "java":
      return Language.Java;
    case "js":
      return Language.JavaScript;
    case "kt":
      return Language.Kotlin;
    case "ts":
      return Language.TypeScript;
    case "php":
      return Language.PHP;
    case "pas":
    case "pp":
      return Language.Pascal;
    case "py":
    case "py2":
    case "py3":
      return Language.Python;
    case "sb3":
      return Language.Scratch;
    case "srs":
      return Language.Pseudocode;
    case "txt":
      return Language.Plain;
    case "rb":
      return Language.Ruby;
    case "rs":
      return Language.Rust;
    case "vb":
      return Language.VisualBasic;
  }
}

export function fileLanguageName(fileName: string) {
  const lang = fileLanguage(fileName);
  switch (lang) {
    case Language.C:
      return "C";
    case Language.Cpp:
      return "C++";
    case Language.CSharp:
      return "C#";
    case Language.Dart:
      return "Dart";
    case Language.Go:
      return "Go";
    case Language.HTML:
      return "Javascript (HTML)";
    case Language.Java:
      return "Java";
    case Language.JavaScript:
      return "Javascript";
    case Language.Kotlin:
      return "Kotlin";
    case Language.TypeScript:
      return "Typescript";
    case Language.PHP:
      return "PHP";
    case Language.Pascal:
      return "Pascal";
    case Language.Python:
      return "Python";
    case Language.Scratch:
      return "Scratch";
    case Language.Plain:
      return t`Testo semplice`;
    case Language.Pseudocode:
      return t`Pseudocodice`;
    case Language.Ruby:
      return "Ruby";
    case Language.Rust:
      return "Rust";
    case Language.VisualBasic:
      return "VisualBasic";
    default:
      return "N/A";
  }
}
