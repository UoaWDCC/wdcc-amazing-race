import { useEffect, useState } from "react";
import { css } from "@linaria/core";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "./Header";

const useGetHint = async (teamKey: string) => {
  const resp = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/question?teamKey=${teamKey}`, {
    method: "GET",
  });

  if (resp.ok) {
    const { nextLocationId, hints, photoHintUrl } = await resp.json();
    return {
      hint: hints[0],
      photoHintUrl: photoHintUrl,
    };
  } else {
    throw new Error("HTTP request failed", { cause: 403 });
  }

  return null;
};

const Container = css`
  max-width: 100%;
  box-sizing: border-box;
  padding: 20px;
  width: 500px;
`;

const hintImageStyle = css`
  width: 100%;
  box-shadow: 0 0 10px black;
`;

const hrStyle = css`
  margin: 20px 0;
`;

export function HintPage() {
  const { teamKey } = useParams();
  const [hint, setHint] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const navigate = useNavigate();

  const loadHints = async () => {
    try {
      const hint = await useGetHint(teamKey!!);
      setHint(hint?.hint);
      setPhotoUrl(hint?.photoHintUrl);
    } catch (e) {
      if ((e as Error).cause === 403) {
        toast.error("Team key was invalid! Navigating back home in 5 seconds...");
        setTimeout(() => {
          navigate("/");
        }, 5_000);
      }
    }
  };

  useEffect(() => {
    loadHints();
  }, []);
  return (
    <div className={Container}>
      {!!hint ? (
        <>
          <h1>Your next hint</h1>
          <hr className={hrStyle} />

          <p>{hint}</p>
          <hr className={hrStyle} />

          <img className={hintImageStyle} src={photoUrl ?? ""} />
        </>
      ) : (
        <SpinningCircles />
      )}
    </div>
  );
}
