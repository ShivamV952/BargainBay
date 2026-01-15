import Link from "next/link";
import OfferMaker from "@/components/Molecules/OfferMaker";
import React from "react";
import { supabase } from "@/lib/SupabaseClient";

async function getProduct(productid: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productid)
    .single();

  if (error) {
    const { data: dataArray, error: arrayError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productid);

    if (arrayError) {
      return null;
    }

    if (dataArray && dataArray.length > 0) {
      return dataArray[0];
    }

    return null;
  }

  return data;
}

const Display = ({ response }: { response: any }) => {
  if (!response) {
    return null;
  }

  const formattedText = response.description ? (
    String(response.description)
      .split("\n")
      .map((line: string, index: number) => (
        <div className="font-thin" key={index}>
          {line}
          <br />
        </div>
      ))
  ) : (
    <div className="font-thin">No description available</div>
  );

  return (
    <div>
      <div className="lg:mx-20  mx-5    py-10 lg:flex block lg:flex-row flex-col gap-y-5 justify-center gap-x-10">
        <div className="lg:w-1/2 w-full">
          <img
            className="w-full"
            src={response.image || "https://via.placeholder.com/400"}
            alt="Product image"
          />
          <div className="grid grid-flow-row lg:grid-cols-4 grid-cols-1 items-center gap-x-5 my-5 bg-white shadow-lg">
            <div className="relative cursor-pointer flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-300 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {response.seller_name || "N/A"}
              </span>
            </div>
            <div className="relative cursor-pointer flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-300 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {response.category || "N/A"}
              </span>
            </div>
            <div className="relative cursor-pointer flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-300 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {response.seller_phoneNumber || "N/A"}
              </span>
            </div>
            <div className="relative cursor-pointer flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-yellow-300 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                {response.city || "N/A"}
              </span>
            </div>
          </div>
          <OfferMaker
            id={String(response.id || "")}
            product_name={String(response.product_name || "")}
            item={{ response }}
          />
        </div>

        <div className="lg:w-1/2 w-full">
          <h1 className="text-3xl font-semibold mb-4">
            {response.product_name || "Product Name"}
          </h1>

          <h4 className="font-semibold text-2xl">
            {" "}
            &#8377; {response.product_price || "0"}
          </h4>

          <div className="flex my-3 font-medium flex-col">
            <span>{String(response.address || "Address not available")}</span>
            <span>
              {String(response.city || "")}
              {response.city && response.state ? "," : ""}
              {String(response.state || "")}
            </span>
          </div>

          {response.user_id && (
            <Link
              href={`/chat/` + response.user_id}
              className="flex cursor-pointer hover:shadow-yellow-200 hover:shadow-lg transition-all duration-200  flex-row p-4 my-4 gap-x-4 items-center shadow"
            >
              <img
                src="https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg"
                alt=""
                className="h-16 w-16 rounded-full"
              />
              <div className="flex flex-col gap-y-1">
                <span>{response.seller_name || "Seller"}</span>
                <span>Chat with user</span>
              </div>
            </Link>
          )}

          <h2 className="text-2xl font-medium mb-1 ">Description</h2>
          <h2 className="font-thin"> {formattedText}</h2>

          <div></div>
        </div>
      </div>
    </div>
  );
};

const page = async ({
  params,
}: {
  params: Promise<{ productid: string }> | { productid: string };
}) => {
  const resolvedParams = await Promise.resolve(params);
  const productId = resolvedParams.productid;
  const response = await getProduct(productId);

  if (!response) {
    return (
      <div className="lg:mx-20 mx-5 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
          <p className="text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return <Display response={response} />;
};

export default page;
