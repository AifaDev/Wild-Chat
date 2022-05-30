import axios from "axios";
import { useContext, useState } from "react";
import avatars from "../assets/avatars/avatars.js";
import { LoadingContext } from "../contexts/loading.context";
import { UserContext } from "../contexts/user.context";
import { setAvatarRoute } from "../utils/APIRoutes";
import styled from "styled-components";

export default function PickAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const submitAvatar = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    await axios.post(
      setAvatarRoute,
      { avatarImage: selectedAvatar },
      { headers: { authorization: token } }
    );
    setIsLoading(false);
    setCurrentUser({ ...currentUser, avatarImage: selectedAvatar });
  };
  return (
    <>
      <Container>
        <h1>Pick an avatar as your profile picture</h1>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div
                key={index}
                onClick={() => setSelectedAvatar(index)}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
              >
                <img src={avatars[index]} alt="avatar"></img>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => submitAvatar()}
          className={`submit-avatar ${
            selectedAvatar !== null ? "display-submit-avatar" : ""
          }`}
        >
          Set as profile picture
        </button>
      </Container>
    </>
  );
}

const primaryColor = "#8643ff";
const hoverColor = "#925bf5";
const pageColor = "#111213ff";
const iconsColor = "#2e3033";

const Container = styled.div`
  background-color: ${pageColor};
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  gap: 4rem;
  h1 {
    color: white;
  }
  .avatars {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    .avatar {
      background-clip: padding-box;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 7.5rem;
      width: 7.5rem;
      padding: 1rem;
      border-radius: 50%;
      border: 0.3rem solid transparent;
      transition: border-color 0.2s ease;
      img {
        filter: drop-shadow(0 0 0.2rem #333);
        background-color: ${iconsColor};
        border-radius: 50%;
        background-clip: border-box;
        padding: 0.8rem;
        height: 6.5rem;
      }
    }
    .selected {
      border-color: ${primaryColor};
    }
  }
  .submit-avatar {
    margin-bottom: -4rem;
    margin-top: 2rem;
    background-color: transparent;
    color: transparent;
    padding: 1rem 4rem;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    border-radius: 0.6rem;
  }
  .display-submit-avatar {
    transition: background-color 0.1s ease;
    background-color: ${primaryColor};
    color: white;
    cursor: pointer;
    &:hover {
      background-color: ${hoverColor};
    }
  }
`;
