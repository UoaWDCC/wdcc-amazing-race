import { createContext } from "react";
import { Route, Routes } from "react-router-dom";
import "normalize.css";
import "./main.css";
import { TeamKeyInputPage } from "./TeamKeyInputPage";
import { css } from "@linaria/core";
import { HintPage } from "./HintPage";
import 'react-toastify/dist/ReactToastify.css';
import { HomePage } from "./HomePage";
import { ToastContainer } from "react-toastify";


export function UploadPage() {
  return <></>;
}

const Container = css`
  position: relative;
  background: linear-gradient(#087df1, #3a86ff);
  width: 100vw;
  max-width: 650px;
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: 0 0 20px grey;
  margin: 0 auto;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  color: white;

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-family: "Open sans", sans-serif;
`;

const QuestionContext = createContext("");

export default function App() {
  return (
    <div className={Container}>
      <QuestionContext.Provider value={""}>
        <Routes>
          <Route path="/">
            <Route path="question/:qId" element={<TeamKeyInputPage />} />
            <Route path="hint/:teamKey" element={<HintPage />} />
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </QuestionContext.Provider>
      <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  );
}
