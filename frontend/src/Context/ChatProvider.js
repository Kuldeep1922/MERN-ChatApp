import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      if (!userInfo) {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to parse userInfo from localStorage:", err);
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
