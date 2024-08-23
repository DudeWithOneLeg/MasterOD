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
      { role: "system", content: `The text you provided is a comprehensive list of questions and answers designed for individuals preparing for the United States Naturalization Test, specifically the Civics portion. This test assesses applicants' knowledge of U.S. history, government structure, and foundational legal principles. Here’s an analysis of the content and its significance:

### Educational Adaptation for Seniors
A significant aspect of the instructions is the adaptation for test-takers who are 65 years old or older and have been legal permanent residents for at least 20 years. These individuals only need to study questions marked with an asterisk (*), making the test more accessible by reducing the amount of memorization required.

### Content Overview
- **American Government:**
  - Covers basic principles of American democracy, system of government, and rights and responsibilities.
  - Discusses constitutional amendments, roles and powers of different government branches, and specific officials' duties.

- **American History:**
  - Spans from the colonial period through modern times, addressing key events, figures, and socio-political developments.
  - Emphasizes significant wars, movements, and contributions of various individuals.

- **Integrated Civics:**
  - Includes geography, symbols, and national holidays that are foundational to American civic life.

### Testing Methodology
- The USCIS administers this test orally, selecting up to 10 questions from the provided pool of 100. The applicant must correctly answer at least 6 to pass.
- Certain questions, particularly those on current officials or geopolitical facts, require the most up-to-date answers, reflecting the continual changes within the government.

### Importance of Contemporary Knowledge
- For questions about current government officials and real-time governance facts, applicants are advised to refer to the USCIS website for the latest information. This necessity highlights the importance of being informed about ongoing political dynamics as part of civic responsibility and readiness for citizenship.

### Preparation Encouragement
- The directions urge applicants to use the specific answers provided in their responses, even though multiple correct answers might exist. This directive likely aims at standardizing answers to avoid confusion and ensure a fair assessment of all test-takers.

### Accessibility
- The inclusion of a URL link to the USCIS website for updated answers to dynamic questions demonstrates an integration of digital resources in the preparation process, making it more accessible and adaptive to changes.

### Conclusion
The Civics (History and Government) Questions for the Naturalization Test serve both evaluative and educational functions, aiming not only to assess but also to educate prospective citizens on fundamental aspects of the United States' civic life. The document reflects an understanding of diverse applicant backgrounds, providing accommodations for older residents and emphasizing current, practical knowledge of the U.S. governance framework. This preparation guide underlines the ongoing relationship between citizens and their government, reinforcing the responsibilities and rights that come with U.S. citizenship.` },
    ]);
    responseRef.current = "";
    socketRef.current = io("http://localhost:8000");

    socketRef.current.on("connect", () => {
      console.log("connected");
      socketRef.current.emit("join", 1);
      console.log("room 1 joined by client");

      if (!responseRef.current) {
        // socketRef.current.emit("url", { url });
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
