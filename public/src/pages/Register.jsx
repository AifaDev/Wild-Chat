import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import keyIcon from "../assets/key-solid.svg";
import mailIcon from "../assets/envelope-solid.svg";
import userIcon from "../assets/user-solid.svg";
import google from "../assets/google-brands.svg";
import github from "../assets/github-brands.svg";
import twitter from "../assets/twitter-brands.svg";
import { registerRoute } from "../utils/APIRoutes";
import { UserContext } from "../contexts/user.context";

function Register() {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const usernameInput = React.useRef(null);
  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = inputs;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (!data.isSuccess) {
        toast.error(data.message, toastOptions);
      }
      if (data.isSuccess) {
        setCurrentUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    }
  };

  const handleChange = (event) => {
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    theme: "dark",
  };

  const handleValidation = () => {
    var hasError = false;
    const { username, email, password, confirmPassword } = inputs;
    if (!username || !password || !email || !confirmPassword) {
      toast.error("You should fill all the blanks.", toastOptions);
      hasError = true;
    } else {
      const emailRegex = new RegExp(
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "gi"
      );
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email.", toastOptions);
        hasError = true;
      }
      if (password.length < 8) {
        toast.error(
          "Password should be longer than 7 characters.",
          toastOptions
        );
        hasError = true;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.", toastOptions);
        hasError = true;
      }
    }
    if (username.length <= 3) {
      toast.error("Username should be longer than 3 characters.", toastOptions);
      hasError = true;
    }

    return !hasError;
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img className="logo" src={logo} alt="logo" />
            <h1>ild</h1>
          </div>
          <div className="inputWrapper">
            <img src={userIcon} alt="userIcon" className="icon"></img>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              ref={usernameInput}
            />
          </div>
          <div className="inputWrapper">
            <img src={mailIcon} alt="mailIcon" className="icon"></img>

            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="inputWrapper">
            <img src={keyIcon} alt="keyIcon" className="icon"></img>

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="inputWrapper">
            <img src={keyIcon} alt="keyIcon" className="icon"></img>

            <input
              type="password"
              placeholder="Confirm Passwrod"
              name="confirmPassword"
              onChange={(event) => handleChange(event)}
            />
          </div>
          <button type="submit">Create User</button>
          <div className="formFooter">
            <h4>Or continue with social media</h4>
            <div className="social-media_wrapper">
              <div className="social-media">
                <img className="social-media_icon" src={google} alt="google" />
              </div>
              <div className="social-media">
                <img
                  className="social-media_icon"
                  src={twitter}
                  alt="twitter"
                />
              </div>

              <div className="social-media">
                <img className="social-media_icon" src={github} alt="github" />
              </div>
            </div>
            <span>
              Already have an account?<Link to="/login">Login</Link>
            </span>
          </div>
        </form>
      </FormContainer>
      <StyledToastContainer limit={4} />
    </>
  );
}
const primaryColor = "#8643ff";
const textColor = "#a172f7";
const hoverColor = "#925bf5";
const pageColor = "#111213ff";
const formColor = "#212224ff";
const errorColor = "#16181a";
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${pageColor};
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    .logo {
      height: 3.5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
    background-color: ${formColor};
    border-radius: 0.5rem;
    padding: 2.8rem 4.5rem;
    filter: drop-shadow(0 0 0.2rem #333);
    .inputWrapper {
      text-align: center;
      width: 100%;
      position: relative;
      .icon {
        width: 0.8rem;
        position: absolute;
        top: 50%;
        left: 6%;
        transform: translateY(-50%);
        filter: invert(50%);
      }
      &:focus-within {
        .icon {
          filter: invert(100%);
        }
      }
    }

    .social-media_wrapper {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      align-items: center;
      justify-content: center;
    }
    .social-media_icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      filter: invert(100%);
    }
    .social-media {
      padding: 0.5rem;
      border: 0.1rem solid #616161;
      border-radius: 50%;
      &:hover {
        cursor: pointer;
      }
    }
    input {
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-text-fill-color: white !important;
        transition: background-color 5000s ease-in-out 0s;
      }
      width: 97%;
      padding: 0.5rem 2.1rem;
      background-color: transparent;
      border: 0.01rem solid #a1a1a1ff;
      border-radius: 0.3rem;
      color: white;
      font-size: 1rem;
      ::-ms-reveal {
        filter: invert(100%);
      }
      &:focus {
        outline-color: ${primaryColor};
      }
    }
    button {
      box-sizing: m;
      background-color: ${primaryColor};
      color: white;
      padding: 0.7rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      transition: background-color 0.1s ease-in-out;
      &:hover {
        background-color: ${hoverColor};
      }
    }
    .formFooter {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    h4 {
      font-weight: normal;
      color: #a1a1a1ff;
      text-align: center;
    }
    span {
      color: white;
      text-align: center;

      a {
        padding: 0.2rem;
        color: ${textColor};
        text-decoration: none;
      }
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
export default Register;
