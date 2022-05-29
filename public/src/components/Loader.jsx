import styled from "styled-components";

export function Loader() {
  return (
    <Styling>
      <div className="sector1 sectors"></div>
      <div className="sector2 sectors"></div>
      <div className="sector3 sectors"></div>
      <div className="sector4 sectors"></div>
      <div className="sector5 sectors"></div>
      <div className="sector6 sectors"></div>
      <div className="sector7 sectors"></div>
      <div className="sector8 sectors"></div>
      <div className="sector9 sectors"></div>
      <div className="sector10 sectors"></div>
      <div className="sector11 sectors"></div>
      <div className="sector12 sectors"></div>
    </Styling>
  );
}

const createAnimation = () => {
  var style = "";

  for (let i = 2; i < 13; i++) {
    let degree = (i - 1) * 30;
    let delay = (13 - i) * 0.1;
    style +=
      ` .sector${i}{transform: rotate(${degree}deg);}` +
      `.sector${i}:before {animation-delay: -${delay}s;}`;
  }
  return style;
};

const Styling = styled.div`
  margin: 10rem auto;
  width: 12rem;
  height: 12rem;
  position: relative;

  .sectors {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .sectors:before {
    content: "";
    display: block;
    margin: 0 auto;
    width: 10%;
    height: 10%;
    background-color: #925bf5;
    border-radius: 100%;
    animation: sectorBounceDelay 1.2s infinite ease-in-out both;
  }

  @keyframes sectorBounceDelay {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
  ${createAnimation()};
`;
