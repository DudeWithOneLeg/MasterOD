import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { io } from "socket.io-client";
export default function GptDocAnalyze({ url }) {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    setMessages((prevMessages) => {
      const updatedMessages = [
        ...prevMessages,
        { role: "user", content: message },
        {role:"system", content: ""}
      ];
      return updatedMessages;
    });
    socketRef.current.emit("message", message);
    setMessage('')
  };

  const [messages, setMessages] = useState([
    { role: "user", content: "Analyze this document" },
    { role: "system", content: "" },
  ]);
  const convoRef = useRef(null);
  const responseRef = useRef(""); // useRef to retain response value across renders

  useEffect(() => {
    setMessages([
      { role: "user", content: "Analyze this document" },
      { role: "system", content: `` },
    ]);
    responseRef.current = "";
    socketRef.current = io("http://localhost:8000");

    socketRef.current.on("connect", () => {
      console.log("connected");
      socketRef.current.emit("join", 1);
      console.log("room 1 joined by client");

      if (!responseRef.current) {
        socketRef.current.emit("url", { url });
      }
    });

    socketRef.current.on("response", (data) => {
      responseRef.current += data;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].content =
          responseRef.current;
        return updatedMessages;
      });
    });

    socketRef.current.on("message", (newMessage) => {
      responseRef.current += newMessage;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].content =
          responseRef.current;
        return updatedMessages;
      });
    });

    socketRef.current.on("end", (message) => {
      responseRef.current = "";
    });

    // Cleanup
    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected on component unmount");
    };
  }, [url]);

  const handleChange = (e) => {
    console.log(e);
    setMessage(e);
  };

  return (
    <div className="h-[100%]">
      <MainContainer
        style={{ position: "relative", height: "100%" }}
        className="flex flex-col"
      >
        <ChatContainer ref={convoRef}>
          <MessageList>
            {messages.map((message, index) => {
              if (message.role !== "system") {
                return (
                  <Message
                    key={index}
                    model={{ message: message.content, sender: message.role, direction: "outgoing" }}
                  />
                );
              } else {
                return (
                  <Message
                    key={index}
                    model={{ message: message.content, sender: message.role, direction:"incoming" }}
                  />
                );
              }
            })}
          </MessageList>
          <MessageInput
            onSend={sendMessage}
            value={message}
            placeholder="Type message here"
            onChange={handleChange}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
