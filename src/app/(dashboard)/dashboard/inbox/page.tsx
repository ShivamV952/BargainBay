"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/SupabaseClient";

interface Message {
  message_id: string;
  sender_id: string;
  receiver_id: string;
}

function getUniqueIds(messages: Message[], id: string): string[] {
  return messages.reduce((acc: string[], curr: Message) => {
    if (
      (curr.sender_id === id || curr.receiver_id === id) &&
      !acc.includes(curr.sender_id)
    ) {
      acc.push(curr.sender_id);
    }
    if (
      (curr.sender_id === id || curr.receiver_id === id) &&
      !acc.includes(curr.receiver_id)
    ) {
      acc.push(curr.receiver_id);
    }
    return acc;
  }, []);
}

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [uniqueUsers, setUniqueUsers] = useState<any>([]);
  const [profiles, setProfiles] = useState<any>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (data && user) {
        setMessages(data);
        const uniqueIds: string[] = getUniqueIds(data, user.id);
        setUniqueUsers(uniqueIds);
      }
    };
    getMessages();
  }, [user]);

  useEffect(() => {
    const getProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", uniqueUsers);
      setProfiles(data);
    };
    getProfiles();
  }, [uniqueUsers]);

  return (
    <div className=" py-20">
      <div className="flex flex-col">
        {profiles.map((item: any, index: any) => {
          return (
            <div
              onClick={() => {
                router.push(`/chat/${item.id}`);
              }}
              className="flex items-center gap-x-4 px-3 justify-start cursor-pointer py-3 bg-gray-100 my-1"
              key={index}
            >
              <img
                className="rounded-full h-12 w-12"
                src={
                  item.profile_pic
                    ? item.profile_pic
                    : "https://pbs.twimg.com/profile_images/586541177131773953/W3al0XET_400x400.jpg"
                }
                alt=""
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
