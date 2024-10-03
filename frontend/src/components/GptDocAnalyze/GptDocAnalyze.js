import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { io } from "socket.io-client";

export default function GptDocAnalyze({ url }) {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "user", content: "Analyze this document" },
    { role: "system", content: `` },
  ]);
  const chatContainerRef = useRef(null);
  const responseRef = useRef("");

  useEffect(() => {
    setMessages([
      { role: "user", content: "Analyze this document" },
      { role: "system", content: `This press release announces the renewed strategic collaboration between Amazon Web Services (AWS) and Slalom, a consulting company, to enhance their partnership and expand their offerings in various industries. Here’s a detailed analysis of the document focusing on key themes, implications, and strategic elements:

### Key Themes and Highlights

1. **Strategic Collaboration Agreement (SCA):**
   - The announcement details a multiyear extension to the existing SCA, indicating a commitment from both companies to work more closely together.
   - The collaboration aims to develop industry-specific solutions, which suggests a focus on tailoring services to meet the unique needs of different sectors.

2. **Global Market Expansion:**
   - The agreement emphasizes a geographic expansion to countries including Ireland, Switzerland, the Netherlands, and additional regions in Latin America and Asia Pacific.
   - This global strategy indicates a proactive approach to capturing market share in emerging economies and developed markets alike.

3. **Specialized Solutions:**
   - The partnership will develop vertical solutions for industries such as energy, financial services, healthcare, and media, indicating an intent to leverage AWS technology capabilities for nuanced industry challenges.
   - Specific case studies, like the one involving TC Energy, highlight the practical applications of joint solutions, showcasing both companies' commitment to customer-centric innovation.

4. **Launch Centers:**
   - Expansion of AWS | Slalom Launch Centers, aimed at accelerating enterprise transformations, showcases both firms’ initiative to enhance customer experience and speed up their cloud transitions.
   - These centers serve as a practical embodiment of their collaboration, helping businesses modernize their IT services through expert guidance in cloud adoption.

5. **Customer Success Stories:**
   - Including a concrete example (TC Energy) illustrates successful implementation of their collaborative solutions, enhancing credibility and providing potential customers with tangible evidence of value.

6. **Recognition and Competencies:**
   - Mentioning Slalom’s achievements, like being named 2021 National Systems Integrator Partner of the Year, underscores their expertise and successful track record.
   - This establishes confidence in Slalom as a consulting partner, which could foster trust among potential clients.

7. **Focus on Innovation:**
   - The emphasis on innovation, particularly with references to machine learning and analytics (like Amazon SageMaker), indicates that both companies are positioning themselves as leaders in technological advancements.
   - The narrative is one of transformation, not just in technology but in driving changes that have meaningful impacts on customers’ businesses.

### Implications

- **Market Positioning:** The extension of their partnership shows that AWS and Slalom are positioning themselves to be formidable players in cloud solutions, targeting not just large enterprises but also mid-market firms looking for tailored solutions.

- **Competitive Advantage:** By integrating their services and co-investing in new go-to-market strategies, the partnership strengthens both companies' competitive advantage against other consulting firms and cloud infrastructure providers.

- **User-Centric Focus:** Emphasizing customer success stories and tailored solutions positions both AWS and Slalom as customer-oriented, capable of solving real-world problems through technology.

- **Sustainability Commitment:** The case study with TC Energy highlights a growing importance on environmental responsibility within the partnership's narrative, appealing to customers concerned with sustainability.

### Conclusion

Overall, this announcement underlines a concerted effort by AWS and Slalom to deepen their partnership, expand globally, and deliver tailored solutions across key industries. Their collaborative innovations not only aim to streamline cloud adoption for clients but also enhance their strategic positioning in a competitive market landscape. The focus on customer-specific challenges, sustainability, and recognized expertise contributes to a compelling value proposition that could attract more businesses into their fold, furthering growth for both entities.` },
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

  const sendMessage = () => {
    if (message.trim() === "") return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
      { role: "system", content: "" }
    ]);
    socketRef.current.emit("message", message);
    setMessage('');
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[95%] w-full flex flex-col bg-gray-100">
      <div className="flex-1 overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <ReactMarkdown className="break-words">{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
