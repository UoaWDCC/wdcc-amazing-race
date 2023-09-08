import { createRef } from "react";
import { css } from "@linaria/core";
import { toast } from "react-toastify";
import { redirect, useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function HomePage() {


  const locationInputCtnStyle = css`
    margin-top: 50px;
  `

  const inputStyle = css`
  padding: 10px 20px;
  border-radius: 5px;
  border: 0;
  margin-right: 10px;
  letter-spacing: 1rem;
  text-indent: 0.5rem;
  text-align: center;
  width: 150px;

  &::placeholder {
    text-indent: 0;
    letter-spacing: normal;
  }
  `

  const getStartedBtnStyle = css`
    padding: 10px 20px;
    background-color: #ffd166;
      border: 0;

    color: black;
    border-radius: 5px;
  `;

  const teamKeyRef = createRef<HTMLInputElement>();

  const navigate = useNavigate();

  const onGetTeamHintPress = () => {
    const teamKey = (teamKeyRef.current as HTMLInputElement).value;
    if (teamKey.length !== 4) {
      toast.error("Team 4 must be 4 digits!")
      
    } else {
      return navigate(`/hint/${teamKey}`);
    }
  }

  return (
    <div>
      <Header />
      <h1>Amazing Race App</h1>
      <p>Travel around the map and reach the finish line in the fastest possible time!</p>
      <div className={locationInputCtnStyle}>
        <input className={inputStyle} placeholder="Team Key" maxLength={4} ref={teamKeyRef} />
        <button className={getStartedBtnStyle} onClick={onGetTeamHintPress}>Get Team Hint</button>
      </div>
    </div>
  );
}