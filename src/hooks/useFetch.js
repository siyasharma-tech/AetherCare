// Asynchronous state in one small hook.
//
// It keeps track of the three things every data request needs:
//   status: "loading" | "success" | "error"
//   data:   what came back (only when status is "success")
//   error:  a readable message (only when status is "error")
// and gives back a retry() function for the "Try again" button.
import { useCallback, useEffect, useState } from "react";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// minDelay keeps the loading indicator on screen briefly. Local files load
// so fast that the spinner would otherwise flash by unseen during a demo.
function useFetch(url, { minDelay = 0 } = {}) {
  const [state, setState] = useState({ status: "loading", data: null, error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setState({ status: "loading", data: null, error: "" });
      try {
        const [response] = await Promise.all([
          fetch(url, { signal: controller.signal }),
          wait(minDelay)
        ]);

        if (!response.ok) {
          throw new Error(`The server answered with status ${response.status}.`);
        }

        const data = await response.json();
        setState({ status: "success", data, error: "" });
      } catch (err) {
        if (err.name === "AbortError") return; // the page was left; ignore
        const message =
          err instanceof SyntaxError
            ? "The response was not valid data."
            : err.message || "Something went wrong.";
        setState({ status: "error", data: null, error: message });
      }
    }

    load();
    // Cleanup: cancel the request if the component unmounts or the url changes.
    return () => controller.abort();
  }, [url, minDelay, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}

export default useFetch;
