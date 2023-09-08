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

  if (resp.ok) {
    const data = await resp.json();

    return data?.isLastTeam ?? false;
  }
  
  return false;
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

const linkStyle = css`
  background-color: #ffd166;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;

  text-decoration: none;
`

export function AnswerComponent({ question, locationKey, teamKey }: AnswerComponentProps) {

  const [answered, setAnswered] = useState(false);
  const [isLastTeam, setIsLastTeam] = useState(false);

  const navigate = useNavigate();
  const onSubmitBtnPress = async () => {
    const answerDom = document.getElementById("answer");
    const answer = (answerDom as any).value;
    const isLastTeam = await usePostAnswer(locationKey, teamKey, answer);

    setAnswered(true);
    setIsLastTeam(isLastTeam);

    if (!isLastTeam) {
      navigate(`/hint/${teamKey}`);
    }    
  };

  if (answered && isLastTeam) {
    return (<div className={Container}>
      <h1 className={Title}>IMPORTANT: Special Alert</h1>
      <br />
      You are the last team to complete this QR code! Please take it down with you before
      you go to the next location. Thanks for making this race more sustainable :-)
      <br />
      <br />
      <Link className={linkStyle} to={`/hint/${teamKey}`}>Click me to get next hint</Link>
    </div>)
  }

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
