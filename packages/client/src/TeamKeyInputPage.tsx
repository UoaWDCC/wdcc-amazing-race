import { css } from "@linaria/core";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { AnswerComponent } from "./AnswerComponent";
import { toast } from "react-toastify";
import { Header } from "./Header";

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
      question: data.text,
    };
  }

  return {
    response: resp.status,
  };
};

const Title = css`
  margin: 0;
  padding: 0;
`;

const InputKey = css`
  padding: 10px 20px;
  text-align: center;

  box-sizing: border-box;

  border-radius: 5px;
  border: 0;

  margin: 20px 10px;

  letter-spacing: 1rem;
  text-indent: 0.5rem;

  &::placeholder {
    text-indent: 0;
    letter-spacing: normal;
  }
`;

const SubmitBtn = css`
  background-color: #ffd166;
  border-radius: 5px;
  color: black;
  border: 0;
  padding: 10px 20px;
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
        case 401: {
          toast.error("Your team key was incorrect");
          break;
        }
        case 403: {
          toast.warn("You skipped a location! Please follow the previous hint");
          break;
        }
        case 404: {
          toast.error("Bad QR code/location ID - no location found");
          break;
        }
        case 409: {
          toast.warn("You have already answered the question at this location!");
          break;
        }
      }
    }
  };

  if (!!question) {
    return <AnswerComponent locationKey={qId!!} teamKey={teamKey} question={question} />;
  } else {
    return (
      <>
        <Header />
        <div>
          <h2 className={Title}>You have reached location {qId}</h2>
          <p>Enter your team key below to answer the question!</p>

          <div>
            <input
              className={InputKey}
              type="text"
              placeholder="Team Key"
              maxLength={4}
              onChange={(e) => setTeamKey(e.target.value)}
            />
            <button className={SubmitBtn} type="submit" onClick={onSubmitBtnPress}>
              Go
            </button>
          </div>
        </div>
      </>
    );
  }
}
