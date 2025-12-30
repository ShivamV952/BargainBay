"use client";
import { supabase } from "@/lib/SupabaseClient";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Page = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<any>(null);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [region, setRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [imageProfile, setImageProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [category, setCategory] = useState<any>("Bike");
  const [phoneNumber, setPhoneNumber] = useState<any>(null);
  const [name, setName] = useState("");
  const [used, setUsed] = useState("");
  const router = useRouter();

  const handleProductNameChange = (e: any) => {
    setProductName(e.target.value);
  };

  const handleProductPriceChange = (e: any) => {
    setProductPrice(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageProfile(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const thumbnail = e.target.result;
        setThumbnail(thumbnail);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStateChange = (e: any) => {
    setState(e.target.value);
  };

  const handleCityChange = (e: any) => {
    setCity(e.target.value);
  };

  const handleStreetAddressChange = (e: any) => {
    setStreetAddress(e.target.value);
  };

  const handleRegionChange = (e: any) => {
    setRegion(e.target.value);
  };

  const handlePostalCodeChange = (e: any) => {
    setPostalCode(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handlePhoneNumberChange = (e: any) => {
    setPhoneNumber(e.target.value);
  };
  const handleNameChange = (e: any) => {
    setName(e.target.value);
  };

  function generated(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let statesInIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const categories = ["Bike", "Car", "Head Phone", "Laptop", "Phone", "TV"];

  const SubmitProduct = async (e: any) => {
    e.preventDefault();

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    if (!imageProfile) {
      console.error("No image selected.");
      return;
    }

    console.log("debug1");
    const imageName = imageProfile.name + generated(6);
    console.log(imageName);
    var { data, error: uploadError } = await supabase.storage
      .from("productimages")
      .upload("/" + imageName, imageProfile, {
        cacheControl: "3600",
        upsert: false,
      });
    console.log("image upload response:", { data, error: uploadError });

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message);
      toast.error("Error uploading image: " + uploadError.message);
      return;
    }

    const imageurl =
      "https://jdlomuaimhhuqkgvwbnd.supabase.co/storage/v1/object/public/productimages/" +
      imageName;

    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        user_id: user.id,
        product_name: productName,
        product_price: productPrice,
        description: description,
        image: imageurl,
        address: streetAddress,
        city: city,
        state: state,
        district: region,
        zip_code: postalCode,
        category: category,
        seller_name: name,
        seller_phoneNumber: phoneNumber,
      });
    console.log("Product insertion response:", { productData, productError });

    if (productError) {
      console.error("Error inserting product:", productError.message);
      toast.error("Error inserting product: " + productError.message);
      return;
    }

    toast.success("Product inserted successfully!");
    router.replace("/dashboard");
  };

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

  return (
    <div className=" py-10 pr-20 pl-10">
      <ToastContainer />
      <div className="space-y-12">
        <div className=" pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Product Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm   sm:max-w-md">
                  <input
                    type="text"
                    name="productName"
                    id="productName"
                    autoComplete="productName"
                    value={productName}
                    onChange={handleProductNameChange}
                    className="block flex-1  border-[1px] focus:outline-none  py-2  bg-transparent  pl-2 text-gray-900 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    placeholder="Car / TV"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Product Category
              </label>
              <div className="mt-2 ">
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                  autoComplete="country-name"
                  className="block w-full py-2 bg-white rounded-md   pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                >
                  {categories.map((item: any, index: any) => {
                    return (
                      <option
                        className="cursor-pointer"
                        key={index}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className=" items-center  flex gap-x-2 text-sm font-medium leading-6 text-gray-900"
              >
                Product Price
                <p className=" text-sm leading-6 text-gray-600">In Ruppes.</p>
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm   sm:max-w-md">
                  <input
                    type="number"
                    min={0}
                    name="productPrice"
                    id="productPrice"
                    autoComplete="productPrice"
                    value={productPrice}
                    onChange={handleProductPriceChange}
                    className="block flex-1  focus:outline-none  border-[1px] bg-transparent py-1.5 pl-2 text-gray-900 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    placeholder="10,000"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  value={description}
                  onChange={handleDescriptionChange}
                  className="block w-full  border-[1px] py-1.5 pl-2 text-gray-900 shadow-sm  focus:outline-none  rounded-md placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about Product.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center flex flex-col justify-center items-center">
                  {thumbnail && (
                    <>
                      <img
                        src={thumbnail}
                        alt="Preview"
                        className=" object-cover mb-4"
                      />
                    </>
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-base w-[500px] font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={handleNameChange}
                  className="block w-full rounded-md  py-1.5 pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="phonenumber"
                  id="phonenumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="block w-full rounded-md  py-1.5 pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State
              </label>
              <div className="mt-2 ">
                <select
                  id="country"
                  name="country"
                  onChange={handleStateChange}
                  autoComplete="country-name"
                  className="block w-full py-2 bg-white rounded-md   pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                >
                  {statesInIndia.map((item: any, index: any) => {
                    return (
                      <option
                        className="cursor-pointer"
                        key={index}
                        value={item}
                      >
                        {item}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="streetAddress"
                  id="streetAddress"
                  autoComplete="streetAddress"
                  value={streetAddress}
                  onChange={handleStreetAddressChange}
                  className="block w-full rounded-md  py-1.5 pl-2 text-gray-900 shadow-sm  border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="city"
                  value={city}
                  onChange={handleCityChange}
                  className="block w-full rounded-md  py-1.5 pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                District
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="region"
                  value={region}
                  onChange={handleRegionChange}
                  className="block w-full rounded-md  py-1.5 pl-2 text-gray-900 shadow-sm border-[1px] focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  autoComplete="postalCode"
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                  className="block w-full rounded-md pl-2 py-1.5 text-gray-900 shadow-sm border-[1px] focus:outline-none ring-gray-300 placeholder:text-gray-400   sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-start gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={SubmitProduct}
          className="rounded-md bg-indigo-600 px-3 py-2  text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Page;
