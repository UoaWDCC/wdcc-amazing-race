import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useGetHint = async (teamKey: string) => {
  const resp = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/question?teamKey=${teamKey}`, {
    method: "GET"
  });

  if (resp.ok) {
    const { nextLocationId, hints } = await resp.json();
    return hints[0];
  }

  return "";
}


export function HintPage() {

  const { teamKey } = useParams();
  const [hint, setHint] = useState("");

  const loadHints = async () => {
    const hint = await useGetHint(teamKey!!);
     setHint(hint);
  }

  useEffect(() => {
    loadHints();
  }, []);
  return <div>
    <h1>Your next hint</h1>
    <p>{hint}</p>
  </div>
}