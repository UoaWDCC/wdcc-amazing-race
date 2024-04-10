import { useEffect, useState, useRef } from "react";
import { css } from "@linaria/core";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Header } from "./Header";

interface HintData {
  hinta: string;
  hintb: string;
  photoHintUrl: string;
}

const useGetHint = async (teamKey: string): Promise<HintData | null> => {
  const resp = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/question?teamKey=${teamKey}`, {
    method: "GET",
  });

  if (resp.ok) {
    const { nextLocationId, hints, photoHintUrl } = await resp.json();
    return {
      hinta: hints[0],
      hintb: hints[1],
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
  const [hint, setHint] = useState<HintData | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showHintButton, setShowHintButton] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const hintDataRef = useRef<HintData | null>(null);

  const navigate = useNavigate();

  const loadHints = async () => {
    try {
      if (!teamKey) return; // Check if teamKey is undefined
      const hintData = await useGetHint(teamKey);
      hintDataRef.current = hintData;
      setHint(hintData);
      if (hintData?.photoHintUrl) { // Check if photoHintUrl is defined
        setPhotoUrl(hintData.photoHintUrl);
      }
      setShowHintButton(true);
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
  }, [teamKey]); // Add teamKey to the dependency array to reload hints when teamKey changes

  useEffect(() => {
    if (countdown > 0 && showHintButton) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, showHintButton]);

  const handleClick = () => {
    setShowHint(true);
  };

  return (
    <div className={Container}>
      <h1>Your next hint</h1>
      <hr className={hrStyle} />

      <p>{hint?.hinta}</p>
      <hr className={hrStyle} />  

      <img className={hintImageStyle} src={photoUrl ?? ""} />
      <br />
      {showHintButton && !showHint && (
        <>
          <p>Hint 2 can be viewed in: {countdown} seconds</p>
          <button disabled={countdown > 0} onClick={handleClick}>Show Hint 2</button>
        </>
      )}
      {showHint && (
        <div>
          <p>{hintDataRef.current?.hintb}</p>
        </div>
      )}
    </div>
  );
}
