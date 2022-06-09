import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import avatars from "../assets/avatars/avatars";
import { UserContext } from "../contexts/user.context";
import ellipse from "../assets/ellipsis-vertical-solid.svg";
import search from "../assets/magnifying-glass-solid.svg";
import message from "../assets/message-solid.svg";
import ChatContainer from "./ChatContainer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  allUsersRoute,
  getUserRoute,
  host,
  sendMessageRoute,
} from "../utils/APIRoutes";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState(null);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [initiating, setInitiating] = useState(false);
  const [dottedMenu, setDottedMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [updateContacts, setUpdateContact] = useState(0); //Force update on initiate chat
  const scrollToContact = useRef();
  const socket = useRef();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const getAllUsers = useCallback(async () => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      allUsersRoute,
      { id: currentUser.id },
      { headers: { authorization: token } }
    );
    setContacts(res.data);
    setFilteredContacts(res.data);
  }, [currentUser.id]);

  const intiateChat = (e) => {
    e.preventDefault();
    setInitiating((prev) => !prev);
  };

  const startChat = async (e) => {
    e.preventDefault();
    setInitiating(false);

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        getUserRoute,
        { username: e.target.user.value },
        { headers: { authorization: token } }
      );
      await axios.post(
        sendMessageRoute,
        {
          from: currentUser.id,
          to: res.data.id,
          messageBody: "Hello",
        },
        { headers: { authorization: token } }
      );

      setSelectedContact(0);
      setUpdateContact((prev) => prev + 1);
    } catch (e) {
      toast.error("You have to enter a valid username.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers, selectedContact, updateContacts]);

  useEffect(() => {
    setFilteredContacts(
      contacts.filter((e) => {
        return e.displayName.includes(query);
      })
    );
  }, [query]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.id);
    }
  }, []);

  useEffect(() => {
    scrollToContact.current?.scrollIntoView();
  }, [selectedContact]);

  return (
    <Container>
      <InterfaceContainer>
        <ContactsSection>
          <div id="contact-section-header">
            <div className="avatar-background">
              <img
                className="avatar"
                src={avatars[currentUser.avatarImage]}
                alt="avatar"
              ></img>
            </div>
            <div id="contact-section-widget">
              <div
                id="ellipse-container"
                onClick={() => {
                  setDottedMenu((prev) => !prev);
                }}
              >
                <img id="ellipse" src={ellipse} alt="ellipse" />
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  id={dottedMenu ? "dotted-menu" : ""}
                >
                  Log out
                </button>
              </div>

              <div id="message-container">
                <img
                  id="message"
                  src={message}
                  alt="message"
                  onClick={(e) => intiateChat(e)}
                />
                <form
                  onSubmit={(e) => startChat(e)}
                  id={initiating ? "initiating" : ""}
                >
                  <input
                    type="text"
                    name="user"
                    placeholder="Enter receipent username."
                    autoComplete="off"
                  />
                </form>
              </div>
              <div id="search-container">
                <form
                  className={`input-wrapper ${searching ? "searching" : ""}`}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setQuery(e.target.query.value);
                  }}
                >
                  <input type="text" name="query" />
                  <h3
                    onClick={() => {
                      setSearching(false);
                      setQuery("");
                    }}
                  >
                    X
                  </h3>
                </form>

                <img
                  id="search"
                  src={search}
                  alt="search"
                  onClick={() => {
                    setSearching((prev) => !prev);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="contacts">
            {filteredContacts.map((contact, index) => {
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
      <StyledToastContainer></StyledToastContainer>
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
  @media only screen and (max-width: 720px) {
    height: 100%;
    width: 100%;
  }
`;

const ContactsSection = styled.div`
  min-height: 30px;
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
      min-height: 4rem;
      max-height: 4rem;
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
        height: 3.5rem;
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

  #contact-section-header {
    /* box-shadow: 10px 10px 16px 1px rgb(0 0 0 / 0.3); */
    border-bottom: 1px solid #d1d1d1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 4%;
    background-color: #1c1d1f;
    #contact-section-widget {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      height: 100%;
      img {
        min-height: 15px;
      }
      #search-container {
        position: relative;
        height: 35%;
        #search {
          height: 100%;
        }

        .input-wrapper {
          display: none;
        }
        .searching {
          display: block;
          z-index: 1;
          right: 0;
          width: 21vw;
          height: 125%;
          display: block;
          position: absolute;
          input {
            background-color: ${formColor};
            color: white;
            padding: 0.5rem;
            height: 100%;
            width: 100%;
          }
          h3 {
            color: white;
            position: absolute;
            right: 10px;
            bottom: 15%;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }

      #ellipse-container {
        height: 40%;

        #ellipse {
          height: 100%;
        }
        button {
          position: absolute;
          display: none;
          border: none;
          border-radius: 0.2rem;
          &:hover {
            background-color: #999;
          }
        }
        #dotted-menu {
          padding: 0.4rem;
          display: block;
        }
      }

      #message-container {
        position: relative;
        height: 35%;
        #message {
          height: 100%;
        }
        form {
          display: none;
          position: absolute;
          right: -40px;
        }
        #initiating {
          display: block;
          input {
            color: white;
            overflow: visible;
            padding: 0.5rem;
            background-color: ${formColor};
            width: 10rem;
            height: 2rem;
          }
        }
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
        height: 1.8rem;
      }
    }
  }
  @media only screen and (max-width: 450px) {
    .contact {
      img {
        height: 2rem !important;
      }
    }
  }
  @media only screen and (max-width: 720px) {
    #contact-section-header {
      justify-content: space-around;
    }
    .avatar-background {
      display: none !important;
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
