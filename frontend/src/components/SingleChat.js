import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  IconButton,
  Text,
  Avatar,
  Spinner,
  FormControl,
  Input,
  useToast,
  Button,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellanous/ProfileModal";
import UpdateGroupChatModal from "./miscellanous/UpdateGroupChatModal";
import axios from "axios";
import "./SingleChat.css";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";
const ENDPOINT = "https://chatapp-okjy.onrender.com"; // befoore deployement http://localhost:5000
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState();
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      playMusic("/send.mp3");
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // console.log({notification},"------");
  useEffect(() => {
    socket.on("message recieved", (newMwssageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMwssageRecieved.chat._id
      ) {
        // give notification
        if (!notification.includes(newMwssageRecieved)) {
          setNotification([newMwssageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          playMusic("/notf.mp3");
        }
      } else {
        setMessages([...messages, newMwssageRecieved]);
      }
    });
  });

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
    // Typing Indicator Logic
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();

    var timerLength = 2000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  function playMusic(song) {
    let audio = new Audio(song);
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
  }

  // Function to handle image upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ChatApp");
    data.append("cloud_name", "dada1bgxg");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dada1bgxg/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await response.json();
      const imageUrl = result.url;

      // Send the image URL as a message
      sendMessageWithImage(imageUrl);
    } catch (error) {
      toast({
        title: "Image Upload Failed",
        description: "Could not upload image. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Function to send the image URL as a message
  const sendMessageWithImage = async (imageUrl) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/message",
        {
          content: imageUrl,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages([...messages, data]);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "17px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            d={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Avatar
                  name={getSender(user, selectedChat.users)}
                  src={getSenderFull(user, selectedChat.users).pic}
                />
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase() + " (Group)"}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            // bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"auto"}
            className="chataa"
          >
            {/* Messages are Here to be rendered */}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <Stack direction="row" spacing={4} align="center">
                  <Button
                    isLoading
                    loadingText="Typing"
                    colorScheme="teal"
                    variant="outline"
                    spinnerPlacement="start"
                    size="sm"
                  ></Button>
                </Stack>
              ) : (
                ""
              )}
              <Stack direction="row" spacing={2}>
                <Tooltip
                  label="click to send a image"
                  hasArrow
                  placement="bottom-end"
                >
                  <Button
                    bg={"#2c2c2c"}
                    colorScheme="white"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <AttachmentIcon />
                  </Button>
                </Tooltip>
                <Input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e)}
                />
                <Input
                  // variant="filled"
                  bg={"#E0E0E0"}
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button colorScheme="teal" onClick={sendMessage}>
                  <ArrowForwardIcon />
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on the user to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
