import { useState } from "react";
import Globe from "./globe";
import Spinner from "./spinner";
import toast from "react-hot-toast";
import Copy from "./copy";

const API_URL = "http://localhost:3000";

export default function App() {
  const [disabled, setDisabled] = useState(false);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [resultOriginal, setResultOriginal] = useState("");

  async function shorten() {
    setDisabled(true);
    setResultOriginal(url);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        toast.error("you can't shorten this!");
        throw new Error("you can't shorten this!");
      }
      const data = await response.json();
      setResult(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="join">
          <div>
            <label className="input validator join-item rounded-l-xl">
              {disabled ? (
                <span className="animate-spin">
                  <Spinner />
                </span>
              ) : (
                <Globe />
              )}
              <input
                disabled={disabled}
                type="url"
                placeholder="https://google.com"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </label>
            <div className="validator-hint hidden">enter a valid url!</div>
          </div>
          <button
            onClick={shorten}
            disabled={disabled}
            className="btn btn-primary join-item rounded-r-xl"
          >
            shorten
          </button>
        </div>

        {result && (
          <>
            <p className="mt-8">url shortened!</p>
            <span className="mt-2 block">
              <a className="link" href={resultOriginal}>
                {new URL(resultOriginal).host + new URL(resultOriginal).pathname}
              </a>{" "}
              -&gt;{" "}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  toast.success("url copied to clipboard!");
                }}
                className="btn link link-accent font-semibold rounded-xl"
              >
                <Copy /> {new URL(result).host + new URL(result).pathname}
              </button>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
