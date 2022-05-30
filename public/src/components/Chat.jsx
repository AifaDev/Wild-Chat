import { useContext, useState } from "react";
import styled from "styled-components";
import avatars from "../assets/avatars/avatars";
import { UserContext } from "../contexts/user.context";
import ellipse from "../assets/ellipsis-vertical-solid.svg";
import search from "../assets/magnifying-glass-solid.svg";
import message from "../assets/message-solid.svg";
import background from "../assets/random-shaped-background.json";
import smile from "../assets/smile-regular.svg";
import arrow from "../assets/arrow-right-solid.svg";
import { EmojiPicker } from "./EmojiPicker";
export default function Chat() {
  const [inputMessage, setInputMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  var addEmoji = ({ native }) => {
    setInputMessage((prev) => {
      return prev + native;
    });
  };
  const { currentUser } = useContext(UserContext);
  return (
    <Container>
      <InterfaceContainer>
        <ContactsSection>
          <div className="contact-section-header">
            <div className="avatar-background">
              <img
                className="avatar"
                src={avatars[currentUser.avatarImage]}
                alt="avatar"
              ></img>
            </div>
            <div className="contact-section-widget">
              <img className="search" src={search} alt="search" />
              <img className="message" src={message} alt="message" />
              <img className="ellipse" src={ellipse} alt="ellipse" />
            </div>
          </div>
          <div className="contacts">
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
            <div className="contact"></div>
          </div>
        </ContactsSection>
        <ChatContainer>
          <div className="chat-header"></div>
          <div className="chat"></div>
          <div className="chat-footer">
            <div id="smile">
              <img
                src={smile}
                alt="smile"
                onClick={() => setShowPicker(!showPicker)}
              />
            </div>
            <div className="picker-container">
              {showPicker && (
                <EmojiPicker onEmojiSelect={addEmoji}></EmojiPicker>
              )}
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
          </div>
        </ChatContainer>
      </InterfaceContainer>
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${pageColor};
`;

const InterfaceContainer = styled.div`
  height: 95%;
  width: 96%;
  border-radius: 0.75rem;
  background-color: ${formColor};
  display: grid;
  grid-template-columns: 100%;
  grid-template-columns: 30% 70%;
  overflow: hidden;
`;

const ContactsSection = styled.div`
  background-color: #131517;
  display: grid;
  gap: 0.1%;
  grid-template-rows: 8%;
  grid-template-columns: 100%;
  overflow: hidden;
  .contacts {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${primaryColor};
      }
    }
    .contact {
      border-top: 0.05rem solid ${pageColor};
      border-bottom: 0.05rem solid ${pageColor};
      width: 100%;
      min-height: 10%;
      background-color: ${errorColor};
      &:first-child {
        border-bottom: 0.05rem solid ${pageColor};
      }
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        border-radius: 0.3rem;

        background-color: ${formColor};
        cursor: pointer;
      }
    }
  }

  .contact-section-header {
    border-bottom: 1px solid white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 4%;
    background-color: ${formColor};
    background-color: #1c1d1f;

    .contact-section-widget {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      height: 100%;
      .search {
        height: 35%;
      }
      .ellipse {
        height: 40%;
      }
      .message {
        height: 35%;
      }
      img {
        filter: invert(35%);
        transition: filter 0.15s ease;
        &:hover {
          filter: invert(80%);
          cursor: pointer;
        }
      }
    }
    .avatar-background {
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0 0 0.1rem ${pageColor};
      background-color: #393b40;
      border-radius: 50%;
      padding: 0.4rem;

      .avatar {
        height: 2.4rem;
      }
    }
  }
`;
const ChatContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 8% 85% 7%;
  background-color: #16181a;
  background-image: url("${background}");
  .chat-header {
    background-color: #1c1d1f;
    border-bottom: 1px solid #131517;
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
      margin-bottom: 5%;
    }
    #send-message {
      font-size: 1rem;
      text-align: left;
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
