"use client";

import React, { useState } from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";

const page = () => {
  const [apiKey, setApiKey] = useState(""); // Store your API key here
  const [prompt, setPrompt] = useState("tell me about dogs");
  const [response, setResponse] = useState<string>("");
  const [markdown, setMarkDown] = useState<any>(null);

  const tvProducts = [
    {
      model: "Samsung QN65Q900RBFXZA",
      size: "65 inches",
      features: ["8K Resolution", "Quantum HDR 32X", "Ultra Viewing Angle"],
      price: 3499.99,
      hoursUsed: 150,
    },
    {
      model: "LG OLED65C1PUB",
      size: "65 inches",
      features: ["4K Resolution", "OLED Display", "Dolby Vision IQ"],
      price: 2499.99,
      hoursUsed: 100,
    },
    {
      model: "Sony XBR-65A9G",
      size: "65 inches",
      features: ["4K Resolution", "OLED Display", "Acoustic Surface Audio+"],
      price: 2799.99,
      hoursUsed: 120,
    },
    {
      model: "TCL 55R617",
      size: "55 inches",
      features: ["4K Resolution", "Dolby Vision HDR", "Roku Smart TV"],
      price: 499.99,
      hoursUsed: 80,
    },
    {
      model: "Vizio M-Series Quantum M558-G1",
      size: "55 inches",
      features: ["4K Resolution", "Quantum Color", "SmartCast 3.0"],
      price: 599.99,
      hoursUsed: 90,
    },
  ];

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJN5WlepYQNsOF6Rc3yuz_aejF2358xZw"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); // Specify the model

  const handleGenerate = async () => {
    if (!prompt) return alert("Please enter a prompt.");
    console.log("hello");
    try {
      let data = JSON.stringify(tvProducts);
      data =
        data +
        `
    Compare the TV Products and according to feature price and hours used and tell them ur order 
    and tell me which one will be best to buy according you
      `;
      const generatedText = await model.generateContent(data);
      const response = await generatedText.response;
      const text = response.text();
      setMarkDown(text);
      setResponse(text);
      console.log(text);
    } catch (error) {
      console.error(error);
      alert("Error generating text. Please check your prompt or API key.");
    }
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      {/* {response ? <p>{response}</p> : null} */}
      <div className="h-[">
      {markdown ? <Markdown>{markdown}</Markdown> : null}
      </div>
    </div>
  );
};

export default page;