import "./styles/css-reset.scss";
import "antd/dist/antd.css";
import "./styles/index.scss";
import React from "react";
import ReactDOM from "react-dom";
import CONSTANTS from "./consts";
import { PageUsers } from "./pages/users";
import styles from "./styles/index.scss";

if (CONSTANTS.isProd && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed:", registrationError);
      });
  });
}

function App() {
  return (
    <main className={styles.wrapperStyles}>
      <PageUsers />
    </main>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
