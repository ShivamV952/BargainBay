"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

interface Message {
  isSafe: any;
  text: string;
  role: "user" | "bot";
  timestamp: Date;
}

interface Message2 {
  text: string;
  role: "user" | "bot";
  timestamp: Date;
  isSafe: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [chat, setChat] = useState<any>(null); // Replace 'any' with appropriate type
  const [theme, setTheme] = useState<string>("light");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [promptHidden, setPromptHidden] = useState<boolean>(false);

  const API_KEY = "AlzaSyDere38bEmLSYpEDCykmCKeQeYBbD4Gda4";
  const MODEL_NAME = "gemini-2.0-flash-lite";

  const questionSet = [
    [
      "Explain about this website",
      "This website is about reselling things <a href='http://localhost:3000/products'>go here</a>",
    ],
    [
      "Product Inquiries",
      "To find out categories <a href='http://localhost:3000/products'>Click Here</a>",
    ],
    ["Can you help me with a specific issue??", "Sure, Please type your issue"],
  ];

  const genAI = new GoogleGenerativeAI(API_KEY);
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    // maxOutputTokens: 2048,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  useEffect(() => {
    const initChat = async () => {
      try {
        const newChat = await genAI
          .getGenerativeModel({ model: MODEL_NAME })
          .startChat({
            generationConfig,
            safetySettings,
            // @ts-ignore
            history: messages.map((msg) => ({
              text: msg.text,
              role: msg.role,
            })),
          });
        setChat(newChat);
      } catch (error) {
        setError("Failed to initialize chat. Please try again");
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async () => {
    try {
      const userMessage: Message = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
        isSafe: undefined,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");
      if (chat) {
        const result = await chat.sendMessage(userInput);
        const botMessage: Message = {
          text: result.response.text(),
          role: "bot",
          timestamp: new Date(),
          isSafe: undefined,
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
        console.log("message:", messages);
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const getThemeColors = () => {
    switch (theme) {
      case "light":
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
      case "dark":
        return {
          primary: "bg-gray-900",
          secondary: "bg-gray-800",
          accent: "bg-yellow-500",
          text: "text-gray-800",
        };
      default:
        return {
          primary: "bg-white",
          secondary: "bg-gray-100",
          accent: "bg-blue-500",
          text: "text-gray-800",
        };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hidePrompt = () => {
    setPromptHidden(true);
  };

  const setPrompt = async (prompt: string, answer: string) => {
    try {
      hidePrompt();
      const userMessage: Message = {
        text: prompt,
        role: "user",
        timestamp: new Date(),
        isSafe: undefined,
      };

      console.log(userMessage);

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");
      setIsLoading(true);

      await new Promise((r) => setTimeout(r, 2000));

      const botMessage: Message2 = {
        text: answer,
        role: "bot",
        timestamp: new Date(),
        isSafe: true,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  const { primary, secondary, accent, text } = getThemeColors();
  return (
    <div className={`flex flex-col h-screen p-4 ${primary}`}>
      <div className="flex justify-between items-center mb-4">
        <a href="/">
          <Image
            src="/Images/logo.jpeg"
            alt="Bargain Bay"
            width={200}
            height={200}
          />
        </a>
        <div className="flex items-center space-x-2 justify-center">
          <label
            htmlFor="theme"
            className={`text-sm ${text} font-bold text-orange-400`}
          >
            Theme:
          </label>
          <select
            name=""
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            className={`p-1 rounded-md border ${text} font-bold text-orange-400`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto ${secondary} rounded-md p-4`}>
        <div
          className={`absolute transition-opacity leading-none bg-gray-300 duration-400 ${
            promptHidden ? "opacity-0 pointer-events-none" : "opacity-100"
          } rounded-lg`}
        >
          <div className="m-2 bg-opacity-85 p-1 font-bold rounded-md text-[#FB7723] w-fit">
            Welcome to Bargain Bay! How can I help you?
          </div>
          {questionSet.map((question, index) => (
            <div
              key={index}
              className="m-2 cursor-pointer bg-opacity-85 p-2 underline rounded-md hover:text-gray-500 w-fit"
              onClick={() => setPrompt(question[0], question[1])}
            >
              {question[0]}
            </div>
          ))}
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            {msg.isSafe ? (
              <span
                id="botMessage"
                className={`p-2 rounded-lg ${
                  msg.role === "user"
                    ? `${accent} text-white`
                    : `${primary} ${text}`
                }`}
              >
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </span>
            ) : (
              <span
                id="botMessage"
                className={`px-2 py-1 rounded-lg   ${
                  msg.role === "user"
                    ? `${accent} text-white`
                    : `${primary} ${text}`
                }`}
              >
                {msg.text}
              </span>
            )}
            <p
              className={`text-xs ${text} mt-1 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {msg.role === "bot" ? "Bot" : "You"}+{" "}
              {msg.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ))}

        {isLoading && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="flex items-center mt-4">
        <input
          id="prompt"
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`flex-1 p-2 rounded-l-md border focus:outline-none focus:border-${accent}`}
        />
        <button
          id="send"
          onClick={handleSendMessage}
          className={`p-2 ${accent} text-white rounded-r-md hover:bg-opacity-80 focus:outline-none `}
        >
          Send
        </button>
      </div>
    </div>
  );
}
