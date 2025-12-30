"use client";
import Hero from "@/components/Hero";
import { Feature } from "@/components/Feature";
import Testimonials from "@/components/Testimonials";
import Layout from "@/components/Layout/index";

import FloatingActionButton from "@/components/ActionButton/index";

import dynamic from "next/dynamic";

export default function Home() {
  return (
    <main className="  ">
      <Layout>
        <Hero />
        <Feature />
        <Testimonials />
        <FloatingActionButton />
      </Layout>
    </main>
  );
}
