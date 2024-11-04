import { Box, Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellanous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{ width: "100%", color: "white" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        height="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
