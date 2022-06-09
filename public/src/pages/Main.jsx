import axios from "axios";
import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Loader } from "../components/Loader";
import { LoadingContext } from "../contexts/loading.context";
import { UserContext } from "../contexts/user.context";
import { getUserRoute } from "../utils/APIRoutes.js";
import Chat from "../components/Chat";
import PickAvatar from "../components/PickAvatar";
import ChooseName from "../components/ChooseName";

//make the invincible button not clickable incase it renders incorrectly
export default function Main() {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  const loadUser = useCallback(async () => {
    try {
      console.log("run");
      const token = localStorage.getItem("token");
      const user = await axios
        .post(
          getUserRoute,
          {},
          {
            headers: { authorization: token },
          }
        )
        .catch((e) => {
          navigate("/login");
        });
      setCurrentUser(user.data);
      setIsLoading(false);
    } catch (e) {
      navigate("/login");
    }
  }, [navigate, setCurrentUser, setIsLoading]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <Container>
        <Loader></Loader>
      </Container>
    );
  } else if (currentUser && currentUser.avatarImage === "") {
    return <PickAvatar></PickAvatar>;
  } else if (currentUser && currentUser.displayName === "") {
    return <ChooseName></ChooseName>;
  } else {
    return <Chat></Chat>;
  }
}

const pageColor = "#111213ff";

const Container = styled.div`
  background-color: ${pageColor};
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
