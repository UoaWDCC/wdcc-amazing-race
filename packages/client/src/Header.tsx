import { css } from "@linaria/core";
import amazingRaceBanner from "./assets/amazing_race_banner.png";


const bannerStyle = css`
position: absolute;
top: 0;
left: 0;
width: 100%;
`;

export function Header() {
  return (
    <img className={bannerStyle} src={amazingRaceBanner} />
  )
}