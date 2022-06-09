import smile from "../assets/smile-regular.svg";
import arrow from "../assets/arrow-right-solid.svg";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";
import styled from "styled-components";
import background from "../assets/random-shaped-background.json";
import axios from "axios";
import { allMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import { UserContext } from "../contexts/user.context";

export default function ChatContainer(props) {
  const [showPicker, setShowPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recievedMessage, setRecievedMessage] = useState(null);
  const { currentUser } = useContext(UserContext);
  const scrollRef = useRef();

  const getMessages = useCallback(async () => {
    if (props.id) {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        allMessagesRoute,
        {
          from: currentUser.id,
          to: props.id,
        },
        { headers: { authorization: token } }
      );
      setMessages(res.data);
      scrollRef.current.scrollIntoView();
    }
  }, [currentUser.id, props.id]);

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    recievedMessage && setMessages((prev) => [...prev, recievedMessage]);
  }, [recievedMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (props.socket.current) {
      props.socket.current.on("message-recieve", (message) => {
        setRecievedMessage({ fromMe: false, message: message });
      });
    }
  }, [props.socket]);

  const addEmoji = ({ native }) => {
    setInputMessage((prev) => {
      return prev + native;
    });
  };
  const handleMessage = async (message) => {
    const token = localStorage.getItem("token");

    props.socket.current.emit("send-message", {
      from: currentUser.id,
      to: props.id,
      message: message,
    });

    await axios.post(
      sendMessageRoute,
      {
        from: currentUser.id,
        to: props.id,
        messageBody: message,
      },
      { headers: { authorization: token } }
    );

    setMessages((prev) => [...prev, { fromMe: true, message: message }]);
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.length > 0) {
      handleMessage(inputMessage);
      setInputMessage("");
      props.select(0);
    }
  };

  return (
    <Container>
      <div className="chat-header">
        <img src={props.avatar} alt="avatar"></img>
        <h1>{props.displayName}</h1>
      </div>
      <div className="chat">
        {messages.map((e, index) => {
          return (
            <div
              className={`message-container ${e.fromMe ? "from-me" : ""}`}
              key={index}
            >
              <p className="message">{e.message}</p>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

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
          autoComplete="off"
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
  overflow: hidden;
  background-color: #16181a;
  background-image: url("${background}");
  max-height: 100%;
  min-height: 100%;

  .chat-header {
    min-height: 30px;
    box-sizing: border-box;
    background-color: rgba(28, 29, 31, 0.8);
    border-bottom: 1px solid #131517;
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      min-height: 25px;

      margin: 0 6%;
      height: 60%;
    }
    h1 {
      font-size: 1.8rem;
      color: #d1d1d1;
    }
  }
  .chat {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 2rem 9%;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 100%;
    min-height: 100%;
    max-width: 100%;
    min-width: 100%;
    .message-container {
      display: flex;
      align-items: center;
      .message {
        background-color: ${formColor};
        max-width: 40%;
        overflow-wrap: break-word;
        font-size: 1.1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        color: #d1d1d1;
      }
    }
    .from-me {
      justify-content: flex-end;
      .message {
        background-color: ${primaryColor};
      }
    }
    &::-webkit-scrollbar {
      width: 0.3rem;
      &-thumb {
        background-color: ${primaryColor};
      }
    }
  }
  .chat-footer {
    min-height: 40px;
    background-color: rgba(33, 34, 36, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 3%;

    #smile {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: filter 0.15s ease;
      width: 2rem;
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
      color: #d1d1d1;
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
