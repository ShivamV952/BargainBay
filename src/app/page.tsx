"use client";
import Hero from "@/components/Hero";
import { Feature } from "@/components/Feature";
import Testimonials from "@/components/Testimonials";
import Layout from "@/components/Layout/index";

import FloatingActionButton from "@/components/ActionButton/index";

import dynamic from "next/dynamic";
const MetaMask = dynamic(() => import("@/components/MetaMask"), { ssr: false });

export default function Home() {
  return (
    <main className="  ">
      <Layout>
        <Hero />
        <MetaMask/>
        <Feature />
        <Testimonials />
        <FloatingActionButton/>
      </Layout>
    </main>
  );
}
