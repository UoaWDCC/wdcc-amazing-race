import { css } from "@linaria/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AnswerComponent } from "./AnswerComponent";

interface UseGetQuestionResp {
  response: number;
  question?: string;
}

const useGetQuestion = async (qId: string, teamKey: string): Promise<UseGetQuestionResp> => {
  const resp = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/question/${qId}?teamKey=${teamKey}`, {
    method: "GET",
  });

  if (resp.ok) {
    const data = await resp.json();
    return {
      response: 200,
      question: data.text
    }
  }

  return {
    response: resp.status
  }
};

const Title = css`
  margin: 0;
  padding: 0;
`;

const InputKey = css`
  display: block;
  padding: 15px;
  text-align: center;
  width: 250px;

  box-sizing: border-box;

  border-radius: 10px;
  border: 0;

  margin: 20px auto;

  letter-spacing: 1rem;

  &::placeholder {
    font-size: 0.8rem;
    letter-spacing: normal;
  }
`;

const SubmitBtn = css`
  background-color: #ffd166;
  border-radius: 10px;
  color: black;
  border: 0;
  padding: 10px 30px;
  display: block;
  margin: 10px auto;

  &:hover {
    filter: brightness(0.8);
  }
`;

export function TeamKeyInputPage() {
  const [teamKey, setTeamKey] = useState("");
  const { qId } = useParams();

  const [question, setQuestion] = useState("");

  const onSubmitBtnPress = async () => {
    const { response, question } = await useGetQuestion(qId!!, teamKey);

    if (response === 200) {
      setQuestion(question!!);
    } else {
      switch (response) {
        case 401: alert("Your team ID was incorrect"); break;
        case 403: alert("You skipped a location! Please follow the previous hint"); break;
        case 404: alert("No location found"); break;
        case 409: alert("You have already answered the question at this location!"); break;
      }
    }
  };

  if (!!question) {
    return <AnswerComponent locationKey={qId!!} teamKey={teamKey} question={question} />
  } else {
    return (
      <div>
        <h1 className={Title}>You have reached location: {qId}</h1>
        <input className={InputKey}
          type="text"
          placeholder="Enter team key (4 characters) here"
          maxLength={4}
          onChange={(e) => setTeamKey(e.target.value)}
        />
        <button className={SubmitBtn} type="submit" onClick={onSubmitBtnPress}>
          Go
        </button>
      </div>
    );
  }
}
