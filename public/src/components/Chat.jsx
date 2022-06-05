import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import avatars from "../assets/avatars/avatars";
import { UserContext } from "../contexts/user.context";
import ellipse from "../assets/ellipsis-vertical-solid.svg";
import search from "../assets/magnifying-glass-solid.svg";
import message from "../assets/message-solid.svg";
import ChatContainer from "./ChatContainer";
import axios from "axios";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const scrollToContact = useRef();
  const socket = useRef();

  const { currentUser } = useContext(UserContext);
  const getAllUsers = useCallback(async () => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      allUsersRoute,
      { id: currentUser.id },
      { headers: { authorization: token } }
    );
    setContacts(res.data);
  }, [currentUser.id]);

  useEffect(() => {
    getAllUsers();
    if (currentUser) {
      // socket.current = io(host);
      // socket.current.emit("add-user", currentUser.id);
    }
  }, [currentUser, getAllUsers]);

  useEffect(() => {
    scrollToContact.current.scrollIntoView();
  }, [selectedContact]);
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
            {contacts.map((contact, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedContact(index)}
                  ref={selectedContact === index ? scrollToContact : null}
                  className={`contact ${
                    selectedContact === index ? "selected" : ""
                  }`}
                >
                  <img src={avatars[contact.avatarImage]} alt="avatar" />
                  <h1>{contact.displayName}</h1>
                </div>
              );
            })}
          </div>
        </ContactsSection>

        {contacts.map((contact, index) => {
          return selectedContact === index ? (
            <ChatContainer
              key={index}
              avatar={avatars[contact.avatarImage]}
              displayName={contact.displayName}
              id={contact._id}
              socket={socket}
              select={setSelectedContact}
            ></ChatContainer>
          ) : (
            ""
          );
        })}
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
  z-index: 1;

  .contacts {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${primaryColor};
      }
    }
    align-items: center;
    //need rework!
    .contact {
      border-top: 0.05rem solid ${pageColor};
      border-bottom: 0.05rem solid ${pageColor};
      padding: 10%;
      width: 99%;
      min-height: 5.5rem;
      max-height: 5.5rem;
      background-color: ${errorColor};
      border-radius: 0.3rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10%;

      &:first-child {
        border-bottom: 0.05rem solid ${pageColor};
      }
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background-color: ${formColor};
        cursor: pointer;
      }
      //FIX RESPONSIVNESS, BROKEN CONTAINER SIZE.
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
      h1 {
        font-size: 1.5rem;
        color: #d1d1d1;
      }
    }
    .selected {
      transition: background-color 0.15s ease-in-out;
      background-color: ${primaryColor};
      &:hover {
        background-color: ${primaryColor};
      }
    }
  }

  .contact-section-header {
    /* box-shadow: 10px 10px 16px 1px rgb(0 0 0 / 0.3); */
    border-bottom: 1px solid #d1d1d1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 4%;
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
