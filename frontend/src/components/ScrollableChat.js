// import React, { useState } from "react";
// import ScrollableFeed, { S } from "react-scrollable-feed";
// import {
//   isLastMessage,
//   isSameSender,
//   isSameSenderMargin,
//   isSameUser,
// } from "../config/ChatLogics";
// import { ChatState } from "../Context/ChatProvider";
// import { Avatar, Tooltip } from "@chakra-ui/react";
// import ProfileModal from "./miscellanous/ProfileModal";
// const ScrollableChat = ({ messages }) => {
//   const { user } = ChatState();
//   const [hover, setHover] = useState(false);
//   return (
//     <>
//       <ScrollableFeed>
//         {messages &&
//           messages.map((m, i) => (
//             <div style={{ display: "flex" }} key={m._id}>
//               {(isSameSender(messages, m, i, user._id) ||
//                 isLastMessage(messages, i, user._id)) && (
//                 <Tooltip
//                   label={m.sender.name}
//                   placement="bottom-start"
//                   hasArrow
//                 >
//                   <ProfileModal user={m.sender}>
//                     <Avatar
//                       mt="7px"
//                       mr={1}
//                       size="sm"
//                       cursor="pointer"
//                       name={m.sender.name}
//                       src={m.sender.pic}
//                     />
//                   </ProfileModal>
//                 </Tooltip>
//               )}
//               <span
//                 style={{
//                   backgroundColor: `${
//                     m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
//                   }`,
//                   marginLeft: isSameSenderMargin(messages, m, i, user._id),
//                   marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
//                   borderRadius: "20px",
//                   padding: "5px 15px",
//                   maxWidth: "75%",
//                 }}
//                 //   _hover={setHover(true)}
//                 // onClick={setHover(true)}
//               >
//                 {m.content}
//               </span>
//               {!hover && (
//                 <span
//                   style={{
//                     marginLeft: "10px",
//                     fontSize: "0.8em",
//                     paddingTop: "15px",
//                     color: "#555",
//                   }}
//                 >
//                   {new Date(m.createdAt).toLocaleString()}
//                 </span>
//               )}
//             </div>
//           ))}
//       </ScrollableFeed>
//     </>
//   );
// };

// export default ScrollableChat;

import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Tooltip, useDisclosure } from "@chakra-ui/react";
import ProfileModal from "./miscellanous/ProfileModal";
import {
  Box,
  Image,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,
} from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [hoveredMessageId, setHoveredMessageId] = useState(null); // Track hovered message

  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI Drawer hooks
  const [selectedImage, setSelectedImage] = useState(null); // To store the clicked image URL
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen(); // Open the drawer when image is clicked
  };

  return (
    <>
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <ProfileModal user={m.sender}>
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </ProfileModal>
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
                onMouseEnter={() => setHoveredMessageId(m._id)} // Set hovered message ID
                onMouseLeave={() => setHoveredMessageId(null)} // Clear hovered message ID
              >
                {m.content.startsWith("http://res.cloudinary.com/") ? (
                  <img
                    src={m.content}
                    alt="Uploaded content"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "10px",
                      // marginTop: "5px",
                    }}
                    onClick={() => handleImageClick(m.content)}
                  />
                ) : (
                  m.content
                )}
              </span>
              {selectedImage && (
                <Drawer isOpen={isOpen} onClose={onClose} size="lg">
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Image Preview</DrawerHeader>
                    <DrawerBody>
                      <Image src={selectedImage} alt="Full image" />
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              )
              }
              {/* Show timestamp only when the message is hovered */}
              {hoveredMessageId === m._id && (
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.8em",
                    paddingTop: "15px",
                    color: "#555",
                  }}
                >
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
