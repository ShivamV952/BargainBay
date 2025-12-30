"use client";
import { supabase } from "@/lib/SupabaseClient";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
const AISearch = dynamic(() => import("@/components/Molecules/AISearch"), { ssr: false });

type Product = {
  id: string;
  product_name: string;
  description: string;
  created_at: string;
  product_price: string;
  image: string;
  category: string;
};

const Card = ({ item }: any) => {
  return (
    <a
      href={"products/" + item.id}
      className="mx-auto mt-11 w-full  transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg"
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

const Robot = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      data-name="025_SCIENCE"
      id="_025_SCIENCE"
      width={20}
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style></style>
        </defs>
        <path
          className="cls-1"
          d="M9,15a1,1,0,0,1-1-1V12a1,1,0,0,1,2,0v2A1,1,0,0,1,9,15Z"
        ></path>
        <path
          className="cls-1"
          d="M15,15a1,1,0,0,1-1-1V12a1,1,0,0,1,2,0v2A1,1,0,0,1,15,15Z"
        ></path>
        <path
          className="cls-1"
          d="M6,8a1,1,0,0,1-.71-.29l-3-3A1,1,0,0,1,3.71,3.29l3,3a1,1,0,0,1,0,1.42A1,1,0,0,1,6,8Z"
        ></path>
        <path
          className="cls-1"
          d="M18,8a1,1,0,0,1-.71-.29,1,1,0,0,1,0-1.42l3-3a1,1,0,1,1,1.42,1.42l-3,3A1,1,0,0,1,18,8Z"
        ></path>
        <path
          className="cls-1"
          d="M21,20H3a1,1,0,0,1-1-1V14.5a10,10,0,0,1,20,0V19A1,1,0,0,1,21,20ZM4,18H20V14.5a8,8,0,0,0-16,0Z"
        ></path>
      </g>
    </svg>
  );
};

// useEffect(() => {

  const page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const[category, setCategory]= useState<Product[]>([]);
    const[sort, setSort]= useState<Product[]>([]);
    // const products= await supabase.from("products").select("*");

    const handleClick = async (option: string) => {
      let query: any;
    
      if(category.length>0){
        query = supabase
        .from('products')
        .select('*')
        .in('id', category.map((product) => product.id));
      }
      
      else {
        query = supabase.from("products").select("*");
      }

      switch (option) {
        case "MostRecent":
          query = query.order("created_at", { ascending: false });
          break;
        case "LeastRecent":
          query = query.order("created_at", { ascending: true });
          break;
        case "LowtoHigh":
          query = query.order("product_price", { ascending: true });
          break;
        case "HightoLow":
          query = query.order("product_price", { ascending: false });
          break;
        default:
          break;
      }

      const { data, error } = await query;
      console.log({ data });

      setProducts(data || []);
      setSort(data || []);
    
    };

    const handleCategory = async (option: string) => {
      let query: any;
  
      // Update query based on selected sorting option
      if (sort.length > 0) {
        query = supabase
          .from('products')
          .select('*')
          .in('id', sort.map((product) => product.id));
      } else {
        query = supabase.from('products').select('*');
      }
  
      const { data: allProducts, error } = await query;
  
      if (error) {
        console.error('Error fetching products:', error.message);
        return;
      }
  
      let filteredProducts = [];
  
      // Apply category filter
      switch (option) {
        case 'Automobile':
          filteredProducts = allProducts.filter(
            (product: Product) =>
              product.category === 'Bike' || product.category === 'Car'
          );
          break;
        case 'Electronics':
          filteredProducts = allProducts.filter(
            (product: Product) =>
              product.category === 'TV' ||
              product.category === 'Phone' ||
              product.category === 'airpods'
          );
          break;
        default:
          console.log('Invalid category option:', option);
          return;
      }
  
      // Set the filtered products and category in state
      setCategory(filteredProducts);
      setProducts(filteredProducts);
    };

  const getAllProducts = async () => {
    const prod= await supabase.from("products").select("*");
   
    setProducts(prod.data || []);
    console.log(prod);
  }

  useEffect(() => {
    getAllProducts();
  
  }, [])

  return (
    <div className="lg:mx-20 mx-5 py-10">
      <div>
        <div className="flex justify-between items-center">
          <div className="text-4xl font-bold tracking-tight text-gray-900">
            Products
          </div>
          <div>
            <AISearch products={products}>
              <span className="flex gap-x-2 items-center w-fit px-4 py-1 border rounded-md">
                <span className="text-sm"> Compare with </span>
                <Robot />
              </span>
            </AISearch>
          </div>
        </div>
      </div>
      <Separator className="my-5 w-[95%] mx-auto" />

      <div className="lg:flex  block justify-start gap-x-10">
        <div className="lg:w-1/3 w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="">Sort</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5">
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo' onClick={() => handleClick("MostRecent")} />
                  Most Recent
                </div>
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo' onClick={() => handleClick("LeastRecent")} />
                  Least Recent
                </div>
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo' onClick={() => handleClick("LowtoHigh")} />
                  Low to High
                </div>
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo'  onClick={() => handleClick("HightoLow")} />
                  High to Low
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" className="mt-5" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="">Category</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5">
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo2' onClick={() => handleCategory("Electronics")} />
                  Electronics
                </div>
                <div className="flex items-center gap-x-4">
                  <input type="radio" name= 'foo2' onClick={() => handleCategory("Automobile")}/>
                  Automobile
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid grid-flow-row w-full gap-x-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {products?.map((item: any, index: any) => {
            return <Card item={item} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
