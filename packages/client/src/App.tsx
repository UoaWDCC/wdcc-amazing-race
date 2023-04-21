import { createContext } from "react";
import { Route, Routes } from "react-router-dom";
import "normalize.css";
import { TeamKeyInputPage } from "./TeamKeyInputPage";
import { css } from "@linaria/core";
import { HintPage } from "./HintPage";


export function HomePage() {
  return <div>Home page</div>;
}


export function UploadPage() {
  return <></>;
}

const Container = css`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Open+Sans:ital,wght@0,400;0,700;1,400&display=swap");

  background: linear-gradient(#087df1, #3A86FF);
  width: 100vw;
  height: 100vh;
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
          <Route index path="*" element={<HomePage />} />
        </Route>
      </Routes>
      </QuestionContext.Provider>
    </div>
  );
}
