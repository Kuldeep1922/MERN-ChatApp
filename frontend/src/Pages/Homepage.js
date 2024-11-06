import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const Homepage = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backgroundColor="#ff8f"
      >
        {/* same as div in bootstrap */}
        <Text fontSize="4xl" fontFamily="Work sans">
          Chat-App
        </Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth={"1px"}
        color="black"
        background="linear-gradient( #FFDEE9, #B5FFFC, #91EAE4)"
      >
        <Tabs size="md" variant="enclosed">
          <TabList mb="1em">
            <Tab width="50%">Sign Up</Tab>
            <Tab width="50%">Login</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Signup />
            </TabPanel>
            <TabPanel>
              <Login />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <div
        className="text-muted"
        style={{
          color: "white",
          position: "absolute",
          bottom: "10px",
          background: "grey",
          borderRadius: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        &copy; 2024 Kuldeep Sahoo. All rights reserved.
      </div>
    </Container>
  );
};

export default Homepage;
