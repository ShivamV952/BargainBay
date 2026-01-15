"use client";

import { Eraser, Send, Video } from "lucide-react";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { EmojiPicker } from "@lobehub/ui";
import Link from "next/link";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { ThemeProvider } from "@lobehub/ui";
import { supabase } from "@/lib/SupabaseClient";

const Page = ({ params }: { params: { id: string } }) => {
  const [receiver, setReceiver] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [senderID, setSenderID] = useState<any>("");

  useLayoutEffect(() => {
    const getReceiver = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", params.id);
      if (data) {
        setReceiver(data[0]);
      }
    };
    getReceiver();
  }, [params.id]);

  useLayoutEffect(() => {
    const getUser = async () => {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.data) {
        setSenderID(userResponse.data?.user?.id);
      }
    };
    getUser();
  }, []);

  useLayoutEffect(() => {
    async function getMessages() {
      if (!senderID) {
        return;
      }
      const { data, error } = await supabase.from("messages").select("*");
      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }
      console.log(data);
      setMessages(data);
    }

    getMessages();
  }, [senderID]);

  useEffect(() => {
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload: RealtimePostgresInsertPayload<{ [key: string]: any }>) => {
          setMessages((prevMessages: any) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [content, setContent] = useState<string>("");

  const handleSubmit = async () => {
    if (!content.trim() || !receiver || !senderID) return;
    const { error, data } = await supabase.from("messages").insert({
      content: content,
      sender_id: senderID,
      receiver_id: receiver.id,
    });
    if (error) {
      console.error("Error sending message:", error);
      return;
    }
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleErase = () => {
    setContent("");
  };

  function generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const sendVideo = async () => {
    if (!receiver || !senderID) return;
    const roomid = generateRandomString(5);
    const { error, data } = await supabase.from("messages").insert({
      content: `https://www.bargainbay.site/room/${roomid}`,
      sender_id: senderID,
      receiver_id: receiver.id,
      isVideo: true,
    });
    if (error) {
      console.error("Error sending video call:", error);
    }
  };

  return (
    <ThemeProvider themeMode="light">
      <div className="flex justify-start w-full h-screen">
        <div className="w-2/12 px-6 py-5 flex flex-col justify-between items-center shadow-lg bg-gradient-to-b from-gray-50 to-white border-r">
          <div className="flex flex-col items-center">
            <img
              src={
                receiver?.profile_pic ||
                "https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft"
              }
              alt={receiver?.name || "User"}
              className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200 shadow-md"
            />
            <div className="text-center mt-4 text-xl font-semibold text-gray-800">
              {receiver?.name}
            </div>
          </div>

          <div className="cursor-pointer">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <div className="w-10/12">
          <div className="h-[7%] w-full flex items-center justify-start px-4 bg-gradient-to-r from-indigo-50 to-white border-b shadow-md">
            <img
              src={
                receiver?.profile_pic ||
                "https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft"
              }
              alt={receiver?.name || "User"}
              className="rounded-full h-12 w-12 object-cover border-2 border-indigo-200 shadow-sm"
            />
            <span className="text-xl font-semibold mx-3 text-gray-800">
              {receiver?.name}
            </span>
          </div>
          <div className="overflow-hidden py-4 h-[73%]">
            <div className="h-full overflow-y-auto">
              <div className="grid grid-cols-12 gap-y-2">
                {messages.map((item: any, index: any) => {
                  if (
                    item.receiver_id == params.id &&
                    item.sender_id == senderID
                  ) {
                    return (
                      <div
                        key={index}
                        className="col-start-6 col-end-13 p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-start flex-row-reverse">
                          <img
                            src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-man-wearing-glasses-is-wearing-colorful-background-image_2905240.jpg"
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="relative mr-3 text-sm bg-gradient-to-br from-indigo-100 to-indigo-200 py-2 px-4 shadow-lg rounded-xl max-w-md">
                            {item.isVideo ? (
                              <div className="flex flex-col items-center justify-center gap-y-2">
                                <span className="font-medium text-gray-700">
                                  Join Video Call
                                </span>
                                <Link
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-center w-[200px] text-base text-white px-8 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                                  href={item.content}
                                >
                                  Join
                                </Link>
                              </div>
                            ) : (
                              <div className="text-gray-800 break-words">
                                {item.content}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (
                    item.receiver_id == senderID &&
                    item.sender_id == params.id
                  ) {
                    return (
                      <div
                        key={index}
                        className="col-start-1 col-end-8 p-3 rounded-lg"
                      >
                        <div className="flex flex-row items-center">
                          <img
                            src="https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft"
                            alt=""
                            className="rounded-full h-10 w-10"
                          />
                          <div className="relative ml-3 text-sm bg-gradient-to-br from-white to-gray-50 py-2 px-4 shadow-lg rounded-xl max-w-md border border-gray-200">
                            <div className="text-gray-800 break-words">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <div className="h-[20%] relative border-t bg-white flex flex-col shadow-lg">
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-gradient-to-r from-gray-50 to-white">
              <button
                onClick={handleErase}
                className="p-2.5 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-indigo-600"
                title="Clear"
              >
                <Eraser className="w-5 h-5" />
              </button>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || !receiver}
                className="p-2.5 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={sendVideo}
                disabled={!receiver}
                className="p-2.5 hover:bg-indigo-100 rounded-lg transition-all duration-200 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Video Call"
              >
                <Video className="w-5 h-5" />
              </button>
              <div className="ml-2">
                <EmojiPicker
                  background="white"
                  onChange={(emoji) => {
                    setContent(content + emoji);
                  }}
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    content.length > 450
                      ? "text-red-500 bg-red-50"
                      : content.length > 400
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-500 bg-gray-100"
                  }`}
                >
                  {content.length}/500
                </span>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                placeholder="Write Your Message Here..."
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setContent(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="w-full h-full p-4 resize-none border-0 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-transparent text-gray-800 placeholder-gray-400"
                rows={3}
                maxLength={500}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Page;
