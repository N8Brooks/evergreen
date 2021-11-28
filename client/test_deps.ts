export * from "https://deno.land/std@0.116.0/testing/asserts.ts";
import { Document } from "https://deno.land/x/deno_dom@v0.1.19-alpha/deno-dom-wasm.ts";

// Add `Document` from deno_dom to global scope as `document`.
Object.defineProperty(globalThis, "document", { value: new Document() });
