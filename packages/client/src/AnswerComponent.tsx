import { css } from "@linaria/core";
import { useState } from "react";
import { Link } from "react-router-dom";

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
`

interface AnswerComponentProps {
  question: string;
  locationKey: string;
  teamKey: string;
}

const Container = css`
  width: 100%;
  max-width: 500px;
`

export function AnswerComponent({ question, locationKey, teamKey }: AnswerComponentProps) {

  const [isAnswered, setIsAnswered] = useState(false);
  const onSubmitBtnPress = async () => {
    const answerDom = document.getElementById("answer");
    const answer = (answerDom as any).value;
    const resp = await usePostAnswer(locationKey, teamKey, answer);
    setIsAnswered(true);
  };

  if (isAnswered) {
    return <div>
      <Link className={LinkText} to={`/hint/${teamKey}`}>Click me to see next hint</Link>
    </div>
  }

  return (
    <div className={Container}>
      <h1 className={Title}>Answer this question: {locationKey}</h1>
      <p dangerouslySetInnerHTML={{
        __html: question
      }} />
      <input placeholder="Your answer here" id="answer" />
      <button type="submit" onClick={onSubmitBtnPress}>Submit</button>
    </div>
  );
}
