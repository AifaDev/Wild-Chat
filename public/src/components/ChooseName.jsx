import axios from "axios";
import { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatars from "../assets/avatars/avatars";
import { LoadingContext } from "../contexts/loading.context";
import { UserContext } from "../contexts/user.context";
import { setDisplayNameRoute } from "../utils/APIRoutes";
import checkMark from "../assets/check-solid.svg";
import styled from "styled-components";

export default function ChooseName() {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const [name, setName] = useState();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    theme: "dark",
  };
  const setDisplayName = async (displayName) => {
    const token = localStorage.getItem("token");
    if (!displayName || displayName.length < 1) {
      toast.error("Display name should not be empty.", toastOptions);
    } else {
      setIsLoading(true);
      await axios.post(
        setDisplayNameRoute,
        { displayName },
        { headers: { authorization: token } }
      );
      setIsLoading(false);
      setCurrentUser({
        ...currentUser,
        displayName,
      });
    }
  };
  return (
    <>
      <Container>
        <div className="avatar-background">
          <img src={avatars[currentUser.avatarImage]} alt="avatar"></img>
        </div>
        <div id="set-name-wrapper">
          <input
            className="set-display-name"
            placeholder="Enter a display name"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <button
            id="set-name-button"
            onClick={() => {
              setDisplayName(name);
            }}
          >
            <img src={checkMark} alt="checkmark" />
          </button>
        </div>
      </Container>
      <StyledToastContainer limit={4} />)
    </>
  );
}
const primaryColor = "#8643ff";
const hoverColor = "#925bf5";
const pageColor = "#111213ff";
const iconsColor = "#2e3033";
const errorColor = "#16181a";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background-color: ${pageColor};
  width: 100vw;
  height: 100vh;
  text-align: center;

  .avatar-background {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 0.5rem ${pageColor};
    height: 22rem;
    width: 22rem;
    background-color: #393b40;
    border-radius: 50%;
    padding: 2.5rem;

    img {
      height: 17rem;
    }
  }
  #set-name-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;

    .set-display-name {
      appearance: none;
      background-color: ${iconsColor} !important;
      opacity: 70%;
      width: 22rem;
      height: 2.8rem;
      background-color: transparent;
      border: 0.01rem solid #a1a1a1ff;
      border-radius: 0.3rem;
      text-align: center;
      color: #d1d1d1;
      font-size: 1.4rem;
      padding: 0 2%;

      &:focus {
        opacity: 100%;
      }
    }
  }
  #set-name-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 20%;
    border: none;
    transition: background-color 0.1s ease;
    background-color: ${primaryColor};
    color: #d1d1d1;
    cursor: pointer;
    &:hover {
      background-color: ${hoverColor};
    }
    img {
      height: 65%;
      filter: invert(100%);
    }
  }
`;

const StyledToastContainer = styled(ToastContainer).attrs({
  className: "toast-container",
  toastClassName: "toast",
  bodyClassName: "body",
  progressClassName: "progress",
})`
  --toastify-icon-color-error: ${primaryColor};
  .Toastify__toast {
    background-color: ${errorColor};
  }
  .progress {
    background-color: ${primaryColor};
  }
`;
