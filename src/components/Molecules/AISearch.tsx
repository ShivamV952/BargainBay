"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "markdown-to-jsx";
import Robot from "./Thinking_Robot.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


const Card = ({ item, selected }: any) => {
  return (
    <div
      className={
        selected
          ? "mx-auto mt-11 cursor-pointer  transform overflow-hidden rounded-lg bg-blue-50 dark:bg-slate-800 shadow-md  hover:shadow-lg"
          : "mx-auto mt-11  cursor-pointer transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md  hover:shadow-lg"
      }
    >
      <img
        className="h-48 w-full object-cover object-center"
        src={item.image}
        alt="Product Image"
      />
      <div className="p-4">
        <h2 className="mb-2 text-lg line-clamp-1 font-medium dark:text-white text-gray-900">
          {item.product_name}
        </h2>
        <p className="mb-2 line-clamp-1 text-base dark:text-gray-300 text-gray-700">
          {item.description}
        </p>
        <div className="flex items-center">
          <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
            &#8377; {item.product_price}
          </p>
        </div>
      </div>
    </div>
  );
};

const AISearch = ({ children, products }: any) => {
  const [markdown, setMarkDown] = useState<any>(null);

  const [selectedProducts, setSelectedProducts] = useState<any>([]);

  const [steps, setSteps] = useState(1);

  const ToggleProduct = (item: any) => {
    const index = selectedProducts.findIndex((p: any) => p.id === item.id);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, item]);
    } else {
      const newProducts = [...selectedProducts];
      newProducts.splice(index, 1);
      setSelectedProducts(newProducts);
    }
    console.log(selectedProducts);
  };

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAJN5WlepYQNsOF6Rc3yuz_aejF2358xZw"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const handleGenerate = async () => {
    setSteps(steps + 1);

    try {
      let data = JSON.stringify(selectedProducts);
      data =
        data +
        `Compare the Products and according to feature price and hours/Km used and tell them ur order 
         and tell me which one will be best to buy according you
      `;
      const generatedText = await model.generateContent(data);
      const response = await generatedText.response;
      const text = response.text();
      setMarkDown(text);
      console.log(text);
    } catch (error) {
      console.error(error);
      alert("Error generating text. Please check your prompt or API key.");
    }
  };

  if (products == null || products.length == 0) {
    return <div></div>;
  }

  const categories = ["Bike", "Car", "Head Phone", "Laptop", "Phone", "TV"];
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">
            {steps == 1
              ? "Click and select the Products you want to compare"
              : "Showing result"}
          </DialogTitle>
          <DialogDescription className=" bg-white">
            {steps == 1 ? (
              <ScrollArea className="h-[500px] w-[800px] pr-5">
                <Tabs defaultValue="TV" className="mx-auto ">
                  <TabsList className=" w-[800px]">
                    {categories.map((item, index) => {
                      return (
                        <TabsTrigger key={index} value={item}>
                          {item}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {categories.map((it, index) => {
                    return (
                      <TabsContent value={it} key={index}>
                        <div className="grid grid-flow-row grid-cols-3  pb-5 overflow-y-auto gap-x-5 ">
                          {products?.map((item: any, index: any) => {
                            if (item.category == it) {
                              return (
                                <div
                                  key={index}
                                  onClick={() => {
                                    ToggleProduct(item);
                                  }}
                                >
                                  <Card
                                    item={item}
                                    selected={
                                      selectedProducts.findIndex(
                                        (p: any) => p.id === item.id
                                      ) != -1
                                    }
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </ScrollArea>
            ) : null}

            {steps == 2 ? (
              <ScrollArea className="h-[500px]  min-w-[800px] pr-5">
                {!markdown ? (
                  <div>
                    <Lottie
                      width={300}
                      height={300}
                      className="w-[400px] mx-auto"
                      animationData={Robot}
                      loop={true}
                    />
                    <div className="text-center my-4">
                      Our A.I. is pondering product prowess to help you pick
                      like a pro!
                    </div>
                  </div>
                ) : null}

                {markdown ? <Markdown>{markdown}</Markdown> : null}
              </ScrollArea>
            ) : null}

            <div className="flex pt-5 w-full justify-between px-5">
              <button
                onClick={() => {
                  setSteps(steps - 1);
                }}
              >
                Back
              </button>
              <button onClick={handleGenerate}>Next</button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AISearch;