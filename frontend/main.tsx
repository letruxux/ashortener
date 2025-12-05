import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import RedirectPage from "./redirect-page";
import { Toaster } from "react-hot-toast";

const params = new URLSearchParams(window.location.search);
const url = params.get("url");
const destination = params.get("destination");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    {url && destination ? <RedirectPage url={url} destination={destination} /> : <App />}
  </React.StrictMode>
);
