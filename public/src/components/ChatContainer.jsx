import smile from "../assets/smile-regular.svg";
import arrow from "../assets/arrow-right-solid.svg";
import { useContext, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import styled from "styled-components";
import background from "../assets/random-shaped-background.json";
import axios from "axios";
import { sendMessageRoute } from "../utils/APIRoutes";
import { UserContext } from "../contexts/user.context";

export default function ChatContainer(props) {
  const [showPicker, setShowPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { currentUser } = useContext(UserContext);

  const addEmoji = ({ native }) => {
    setInputMessage((prev) => {
      return prev + native;
    });
  };
  const handleMessage = async (message) => {
    const token = localStorage.getItem("token");
    await axios.post(
      sendMessageRoute,
      {
        from: currentUser.id,
        to: props.id,
        messageBody: message,
      },
      { headers: { authorization: token } }
    );
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.length > 0) {
      handleMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <Container>
      <div className="chat-header">
        <img src={props.avatar} alt="avatar"></img>
        <h1>{props.displayName}</h1>
      </div>
      <div className="chat"></div>
      <form className="chat-footer" onSubmit={(e) => sendMessage(e)}>
        <div id="smile">
          <img
            src={smile}
            alt="smile"
            onClick={() => setShowPicker(!showPicker)}
          />
        </div>
        <div className="picker-container">
          {showPicker && <EmojiPicker onEmojiSelect={addEmoji}></EmojiPicker>}
        </div>

        <input
          type="text"
          name="send-message"
          id="send-message"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button id="send">
          <img src={arrow} alt="arrow" />
        </button>
      </form>
    </Container>
  );
}

const primaryColor = "#8643ff";
const textColor = "#a172f7";
const hoverColor = "#925bf5";
const pageColor = "#111213ff";
const formColor = "#212224ff";
const errorColor = "#16181a";
const Container = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 8% 85% 7%;
  background-color: #16181a;
  background-image: url("${background}");
  .chat-header {
    box-sizing: border-box;
    background-color: #1c1d1f;
    border-bottom: 1px solid #131517;
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      margin: 0 6%;
      height: 60%;
    }
    h1 {
      font-size: 1.8rem;

      color: white;
    }
  }
  .chat {
  }
  .chat-footer {
    background-color: rgba(33, 34, 36, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 3%;

    #smile {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: filter 0.15s ease;
      width: 3%;
      img {
        filter: invert(35%);
      }
      img:hover {
        cursor: pointer;
        filter: invert(80%);
      }
    }
    position: relative;
    .picker-container {
      position: absolute;
      left: 7%;
    }
    #send-message {
      font-size: 1rem;
      appearance: none;
      background-color: rgba(0, 0, 0, 0.1);
      width: 80%;
      height: 55%;
      border: 0.01rem solid rgba(161, 161, 161, 0.6);
      border-radius: 0.3rem;
      text-align: left;
      padding: 0 2%;
      color: white;
      &:focus {
        outline: none;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }

    #send {
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 1 / 1;
      height: 75%;
      border-radius: 50%;
      background-color: ${primaryColor};
      transition: background-color 0.15s ease;
      border: none;
      img {
        height: 50%;
        filter: invert(100%);
      }
      &:hover {
        cursor: pointer;
        background-color: ${hoverColor};
      }
    }
  }
`;
