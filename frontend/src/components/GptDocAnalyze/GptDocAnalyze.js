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
    { role: "system", content: `` },
  ]);
  const convoRef = useRef(null);
  const responseRef = useRef(""); // useRef to retain response value across renders

  useEffect(() => {
    setMessages([
      { role: "user", content: "Analyze this document" },
      { role: "system", content: `The document appears to be a detailed outline of a short course entitled "Introduction to Deep Learning with TensorFlow," taught by Jian Tao at Texas A&M University, focusing on two main components: Deep Learning itself and an introduction to TensorFlow.

### Course Structure
- **Part I: Deep Learning (70 mins)**
- **Break (10 mins)**
- **Part II: Introduction to TensorFlow (70 mins)**

### Key Topics Covered

#### 1. **Deep Learning Fundamentals**
- **Definitions:**
  - **Artificial Intelligence (AI):** Man-made intelligence exhibited by machines.
  - **Machine Learning (ML):** An approach to achieve AI.
  - **Deep Learning (DL):** A technique to implement ML.

- **Types of Machine Learning:**
  - **Supervised Learning:** Trained with labeled data for regression and classification.
  - **Unsupervised Learning:** Trained with unlabeled data; clustering and association.
  - **Reinforcement Learning:** Involves environment interaction with no predefined training data.

- **Deep Learning vs. Traditional ML:**
  - Traditional ML struggles with high-dimensional data and feature extraction.
  - DL handles high-dimensional data and automatically performs feature extraction.

- **Deep Learning Structure:**
  - Comprises multiple layers of non-linear processing units, learning hierarchical representations from data.

#### 2. **Artificial Neural Networks (ANN)**
- Overview of the architecture including inputs, hidden layers, and outputs.
- Introduction to concepts such as feedforward, loss functions, backpropagation, and the role of activation functions.

#### 3. **Convolutional Neural Networks (CNNs)**
- A specific type of DL architecture that is well-suited for image data.
- Explanation of convolution, activation functions (e.g., ReLU), max pooling, dropout layers, and data augmentation techniques.

#### 4. **Practical Implementation with TensorFlow**
- **TensorFlow Overview:**
  - Introduction to TensorFlow as an open-source framework for building ML applications.
  - Brief history of TensorFlow development.

- **Hands-on Code Examples:**
  - Basic operations (e.g., defining constants and variables).
  - Building, compiling, and training models using 'tf.keras'.
  - Preparing datasets, defining models, configuring training processes, and making predictions.

- **Key TensorFlow Concepts:**
  - **Tensors:** n-dimensional arrays that represent all data in TensorFlow.
  - Importance of preprocessing data (cleaning, balancing, scaling, and splitting).

- **Keras Integration:**
  - Use of Keras as a high-level API to simplify model building.
  - Creating sequential models and compiling them with specified optimizers, loss functions, and metrics.

### Practical Applications
- Course includes a hands-on component with tasks related to classifying handwritten digits using TensorFlow, leveraging datasets such as MNIST.

### Target Audience and Educational Goals
- This course targets individuals interested in learning about the fundamentals of deep learning and practical implementation using TensorFlow.
- It aims to equip learners with the foundational concepts in AI, ML, and DL, alongside practical skills to build and evaluate models.

### Conclusion
Overall, the document serves as both a syllabus and a foundational reference for participants in the course. It covers theoretical foundations, practical coding tasks, and introduces essential tools and data preprocessing techniques necessary for building effective deep learning models. The inclusion of visuals and examples throughout suggests that the course is designed to cater to both novice and intermediate learners in the field of deep learning.` },
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
