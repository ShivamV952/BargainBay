"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { supabase } from "@/lib/SupabaseClient";

function generateUniqueId(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const Page = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState<any>(null);

  //  useLayoutEffect(()=>{
  //    const getUser = async () => {
  //      const userResponse = await supabase.auth.getUser();
  //      if (userResponse.data) {
  //        setUser(userResponse.data.user);
  //      }
  //    };
  //    getUser();
  //  },[])

  useEffect(() => {
    const myMeeting = async () => {
      const appID = 225577152;
      const serverSecret = "7726673fb3b9ce44d949ffa8baddf872";

      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        params.id,
        generateUniqueId(5),
        "deep"
      );
      const zc = ZegoUIKitPrebuilt.create(KitToken);
      zc.joinRoom({
        container: document.getElementById("yourElementId") as
          | HTMLElement
          | null
          | undefined,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    };
    
    myMeeting();
  }, [params.id]);

  return (
    <div>
      <div id="yourElementId"></div>
    </div>
  );
};

export default Page;
