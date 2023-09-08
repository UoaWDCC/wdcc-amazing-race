import { css } from "@linaria/core";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./Header";

const usePostAnswer = async (locationKey: string, teamKey: string, answer: string) => {
  const body = {
    teamKey,
    answer,
  };
  const resp = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/question/${locationKey}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return resp.status;
};

const Title = css`
  margin: 0;
  padding: 0;
`;

const LinkText = css`
  color: #ffd166;
`;

interface AnswerComponentProps {
  question: string;
  locationKey: string;
  teamKey: string;
}

const Container = css`
  width: 500px;
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const hrLine = css`
  margin: 20px 0;
`;

const inputStyle = css`
  width: 100%;
  height: 80px;
  padding: 10px 20px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 0;
  height: auto;

  resize: vertical;
`;

const getStartedBtnStyle = css`
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ffd166;
  border: 0;

  color: black;
  border-radius: 5px;
`;

export function AnswerComponent({ question, locationKey, teamKey }: AnswerComponentProps) {
  const navigate = useNavigate();
  const onSubmitBtnPress = async () => {
    const answerDom = document.getElementById("answer");
    const answer = (answerDom as any).value;
    const resp = await usePostAnswer(locationKey, teamKey, answer);
    
    navigate(`/hint/${teamKey}`);
  };

  return (
    <div className={Container}>
      <h1 className={Title}>Answer for {locationKey}</h1>
      <hr className={hrLine} />
      <p
        dangerouslySetInnerHTML={{
          __html: question,
        }}
      />
      <hr className={hrLine} />
      <textarea className={inputStyle} placeholder="Your answer here" id="answer" />
      <button className={getStartedBtnStyle} type="submit" onClick={onSubmitBtnPress}>
        Submit (one chance)
      </button>
    </div>
  );
}
