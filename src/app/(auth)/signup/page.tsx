"use client";

import "react-toastify/dist/ReactToastify.css";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import Link from "next/link";
import dynamic from "next/dynamic";
import signupLottie from "./signupLottie.json";
import { supabase } from "@/lib/SupabaseClient";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const page = () => {
  const [username, setusername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handlesubmit = async (e: any) => {
    try {
      e.preventDefault();
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: username,
          },
        },
      });
      if (error) {
        toast.error(error.message || "Error during sign-up!");
        console.error("Sign-up error:", error);
      } else {
        toast.success("Please check your mail!");
        if (data?.user?.id) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            name: username,
          });
          if (profileError) {
            console.error("Profile creation error:", profileError);
            toast.error("Account created but profile setup failed: " + profileError.message);
          }
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred during sign-up";
      toast.error(errorMessage);
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <section className=" ">
      <ToastContainer />
      <div className=" flex rounded-2xl my-14 mx-auto shadow-lg max-w-7xl lg:p-5 items-center">
        <div className="lg:w-1/2 w-full p-3">
          <h2 className="text-4xl  text-center ">SignUp</h2>
          <p className=" text-center text-sm mt-1">create your account</p>
          <form
            onSubmit={handlesubmit}
            className="flex flex-col gap-4 mt-6 p-2"
          >
            <div className="grid gap-4">
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    required={true}
                    onChange={(e) => {
                      setusername(e.target.value);
                    }}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                    Username
                  </label>
                </div>
              </div>
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    type="email"
                    required={true}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                    Email
                  </label>
                </div>
              </div>
              <div className="w-full">
                <div className="relative w-full min-w-[200px] h-10">
                  <input
                    required={true}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                  />
                  <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
                    Password
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <input type="checkbox" className="border border-gray-400" />
              <span className="px-2">I accept the terms and conditions</span>
            </div>
            <div className="mt-3 mb-0">
              <button className=" rounded-xl w-full bg-yellow-200 py-3 text-center   text-xl hover:bg-#ffb800 hover:scale-100 duration-300">
                SignUp
              </button>
            </div>
          </form>

          <div className="mt-5 grid grid-cols-3 items-center text-gray-500">
            <hr className="border-gray-500" />
            <p className="text-center">OR</p>
            <hr className="border-gray-500" />
          </div>
          <button className="bg-white border  py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-100 duration-300">
            <svg viewBox="0 0 48 48" className="w-5 h-5 mr-3">
              <title>Google Logo</title>
              <clipPath id="g">
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
              </clipPath>
              <g className="colors" clipPath="url(#g)">
                <path fill="#FBBC05" d="M0 37V11l17 13z" />
                <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
              </g>
            </svg>
            Login with Google
          </button>
          {/* <p className='mt-2 text-sm border-b border-gray-400 py-2'>Forgot your password</p> */}
          <div className="mt-2 text-xs flex justify-between items-center">
            <p>Already have an account?</p>
            <button
              type="submit"
              className="py-2 px-5 bg-white border rounded-xl hover:scale-100 duration-300"
            >
              <Link href={"/login"}>Login</Link>
            </button>
          </div>
        </div>

        <div className=" lg:block hidden w-1/2">
          <Lottie animationData={signupLottie} loop={true} />
        </div>
      </div>
    </section>
  );
};
// orange: #ff710d
// kesari #FF7722
// white #ffffff
// yellow #ffb800
export default page;