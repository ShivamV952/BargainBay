"use client";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { EmojiPicker } from "@lobehub/ui";
import { ThemeProvider, GradientButton } from "@lobehub/ui";
import {
  ActionIcon,
  ChatInputActionBar,
  ChatInputArea,
  ChatSendButton,
  TokenTag,
} from "@lobehub/ui";
import { Delete, Eraser, Languages, Send, Video } from "lucide-react";
import { Flexbox } from "react-layout-kit";
import { supabase } from "@/lib/SupabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

interface Message {
  id: string;
  message: string;
}

const Page = ({ params }: { params: { id: string } }) => {
  const [receiver, setReceiver] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [senderID, setSenderID] = useState<any>("");
  const router = useRouter();

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
  }, []);

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
    if (!content.trim()) return;
    const { error, data } = await supabase.from("messages").insert({
      content: content,
      sender_id: senderID,
      receiver_id: receiver.id,
    });
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
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
    const roomid = generateRandomString(5);

    const { error, data } = await supabase.from("messages").insert({
      content: `https://www.bargainbay.site/room/${roomid}`,
      sender_id: senderID,
      receiver_id: receiver.id,
      isVideo: true,
    });
  };

  return (
    <ThemeProvider themeMode="light">
      <div className="flex justify-start w-full h-screen">
        <div className="w-2/12 px-6 py-5 flex flex-col justify-between items-center shadow-sm bg-gray-100 border-r ">
          <div>
            <img
              src="https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft"
              alt=""
            />
            <div className="text-center mt-4 text-xl">{receiver?.name}</div>
          </div>

          <div className="cursor-pointer">
            <Link href="/dashboard">back to Dashboard</Link>
          </div>
        </div>
        <div className="w-10/12">
          <div className="h-[7%] w-full flex items-center justify-start px-3 bg-neutral-100 border-b shadow-sm">
            <img
              src="https://lh4.googleusercontent.com/proxy/XZjBQs671YZjpKSHu4nOdgKygc5oteGGQ4nznFtymv2Vr1t6lHDdhqPe-Pk-8IJe7pW4AhhKOTWRVt_b6G4qHF92n7Z1QCMVCNXCP2yayQrC-6Fichft"
              alt=""
              className="rounded-full h-12 w-12"
            />
            <span className="text-xl font-medium mx-3">{receiver?.name}</span>
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
                          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            {item.isVideo ? (
                              <div className=" flex flex-col items-center justify-center gap-y-2">
                                Join Video Call
                                <Link
                                  className="bg-green-400 text-center  w-[200px] text-base text-white px-16 py-2 rounded-lg"
                                  href={item.content}
                                >
                                  Join
                                </Link>
                              </div>
                            ) : (
                              <div>{item.content}</div>
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
                          <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                            <div>{item.content}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          <Flexbox className="h-[20%] relative border">
            <div style={{ flex: 1 }}></div>
            <ChatInputArea
              placeholder="Write Your Message Here..."
              value={content}
              onChange={(e: any) => {
                setContent(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              topAddons={
                <ChatInputActionBar
                  leftAddons={
                    <>
                      <ActionIcon icon={Eraser} onClick={handleErase} />
                      <ActionIcon icon={Send} onClick={handleSubmit} />
                      <ActionIcon icon={Video} onClick={sendVideo} />
                      <EmojiPicker
                        backgroundColor="white"
                        onChange={(emoji) => {
                          setContent(content + emoji);
                        }}
                      />
                      <TokenTag maxValue={500} value={content.length} />
                    </>
                  }
                />
              }
            />
          </Flexbox>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Page;
