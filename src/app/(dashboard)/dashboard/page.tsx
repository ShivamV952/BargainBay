"use client";
import { supabase } from "@/lib/SupabaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const Card = ({ item }: any) => {
  return (
    <a
      href={"products/" + item.id}
      className="mt-11 w-full max-w-[350px]  transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300  hover:shadow-lg"
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
    </a>
  );
};


const Page: React.FC = () => {
  // Dummy data for profile

  const router = useRouter();

  const userProfile = {
    username: "JohnDoe",
    displayName: "John Doe",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    followers: 1000,
    following: 500,
    tweets: 1500,
    profileImageUrl: "https://via.placeholder.com/200", // URL of profile photo
    coverImageUrl:
      "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcm00NjdiYXRjaDUtc2NlbmUtaC0wMDJjLXgta3p3ZHF5bmsuanBn.jpg", // URL of cover photo
  };

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const response = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);
        if (response && response.data) {
          setUser(response.data[0]);
        }
      } else {
        router.push("/");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      if (user) {
        console.log(user.id);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id);
        if (data) {
          setProducts(data);
        }
      }
    };
    getProducts();
  }, [user]);

  return (
    <div>
      <div className="shadow-lg mt-2 ">
        {/* Cover Photo */}
        <div
          className="bg-cover bg-center h-60 relative"
          style={{ backgroundImage: `url(${userProfile.coverImageUrl})` }}
        >
          {/* Profile Photo */}
          <div className="absolute bottom-0 left-0">
            <img
              className="rounded-full ml-5 h-48 w-48 border-4 border-white  mb-2"
              src={
                user && user.profile_pic
                  ? user.profile_pic
                  : userProfile.profileImageUrl
              }
              alt="Profile"
            />
          </div>
        </div>
        {/* Profile Details */}
        <div className="p-4">
          <h2 className="font-bold text-xl">
            {user ? user.name : userProfile.displayName}
          </h2>
          <p className="text-gray-600">
            @{user ? user.name : userProfile.displayName}
          </p>
          <p className="text-gray-800 mt-2">
            {user && user.about ? user.about : userProfile.bio}
          </p>
          <div className="flex mt-4">
            {/* Add additional profile details here */}
          </div>
        </div>
      </div>
      <div>
        <br /> Your Products <br />
        <div className="flex gap-x-10 pb-5 overflow-x-auto">
          {products.map((item: any, index: any) => {
            return <Card item={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
