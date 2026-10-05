import type { JSX as ReactJSX } from "react";

// rehype-react augments unified's CompileResultMap with `JsxElement: JSX.Element`,
// but React 19 no longer declares the global JSX namespace. Without this shim the
// unresolved type collapses CompileResults to `any`, breaking the type inference
// of the whole `.use()` chain.
declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
  }
}
