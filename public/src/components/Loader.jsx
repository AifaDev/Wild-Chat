import styled from "styled-components";

export function Loader() {
  const array = new Array(12);
  for (let i = 1; i < 13; i++) {
    array[i - 1] = <div key={i} className={`sector${i} sectors`}></div>;
  }
  return <Styling>{array}</Styling>;
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
