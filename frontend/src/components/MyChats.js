import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Drawer,
  DrawerOverlay,
  Input,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spinner,
  Box,
  Button,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import UserListItem from "./UserAvatar/UserListItem";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../config/ChatLogics";
import GroupChatModal from "./miscellanous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [search, setSearch] = useState(" ");
  const [searchResult, setSearchResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
  } = ChatState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: "Failed to Load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    handleSearch()
  }, [])
  

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Try LogIn Again...",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      style={{ color: "black" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "10px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Tooltip label="search users to chat" hasArrow placement="bottom-end">
        <Button
          style={{ color: "black" }}
          variant="outline"
          onClick={onOpen}
          width="100%"
          d="flex"
          flexDir={"row"}
          justifyContent={"space-between"}
        >
          <Text>Search User to chat</Text>
          <i className="fa-solid fa-magnifying-glass"></i>
        </Button>
      </Tooltip>
      <Box
        d="flex"
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        borderRadius="lg"
        overflowY={"auto"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    <Box d={"flex"}>
                      <Avatar
                        name={getSenderFull(user, chat.users).name}
                        src={getSenderFull(user, chat.users).pic}
                        marginRight={"10px"}
                      />
                      <Box>
                        <Box>{getSender(loggedUser, chat.users)}</Box>
                        <Box fontSize={12} color={"green"}>
                          {chat.latestMessage
                            ? new Date(chat.latestMessage.createdAt)
                                .toLocaleString()
                                .split(": ")
                                .reverse() +
                              " : " +
                              chat.latestMessage.content
                                .split(" ")
                                .slice(0, 5)
                                .join(" ")
                            : ""}
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box color="blue" fontSize={"18px"}>
                        <i>{chat.chatName + " (Group)"}</i>
                      </Box>
                      <Box fontSize={12} color={"red"}>
                        {chat.latestMessage
                          ? (chat.latestMessage.sender._id === user._id
                              ? "You"
                              : chat.latestMessage.sender.name) +
                            " : " +
                            chat.latestMessage.content
                          : ""}
                      </Box>z
                    </Box>
                  )}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box d="flex" pb={2}>
                <Input
                  placeholder="Search by Name or Email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default MyChats;
