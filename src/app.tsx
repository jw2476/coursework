// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense } from "solid-js";
import "./app.css";
import { Toaster } from "~/components/ui/toast"

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Suspense>{props.children}</Suspense>
          <Toaster />
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
