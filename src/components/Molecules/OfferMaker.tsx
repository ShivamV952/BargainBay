"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Cross, Person, Phone, Rupee } from "@/components/SVG";
import { supabase } from "@/lib/SupabaseClient";
import { web3, contract } from "@/lib/contract";

interface OfferMakerProps {
  product_name: string;
  id: string;
  item: any;
}

export interface AccountType {
  address?: string;
  balance?: string;
  chainId?: string;
  network?: string;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const OfferMaker: React.FC<OfferMakerProps> = ({ product_name, id, item }) => {
  const [sender_name, setSender_Name] = useState<string>();
  const [sender_number, setSender_Number] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [open, setOpen] = useState(false);

  const [balance, setBalance] = useState<string>("");
  const [address, setAddress] = useState<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [account, setAccountData] = useState<any>(null);

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("offers").insert({
      sender_id: user?.id,
      receiver_id: item?.response.user_id,
      sender_name: sender_name,
      sender_number: sender_number,
      price: price,
      product_name: item?.response.product_name,
      product_id: id,
      product_image: item?.response.image,
    });
    await payAddress();
    window.location.reload();
    console.log(error);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const balance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    fetchBalance();
  }, []);

  const payAddress = async () => {
    const eths=convertToEth(price)
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const tx = await contract.methods
      .payAddress()
      .send({ from: account, value: web3.utils.toWei(JSON.stringify(eths), "ether") });
    console.log("Transaction hash:", tx.transactionHash);
  };

  function convertToEth(amountInr: string | undefined): number | null {
    if (amountInr == undefined) return null;
    const amount: number = parseFloat(amountInr);
    return amount / 244642;
  }

  return (
    <div>
      {" "}
      <Dialog>
        <DialogTrigger className="w-full bg-yellow-200 mt-4 py-2  font-medium text-xl">
          Make Offer{" "}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="leading-relaxed">
              Want to make offer for <br /> {product_name}?
            </DialogTitle>

            <DialogDescription className="mt-10 w-[600px]">
              <div className="text-xs my-2 text-gray-700">
                Tell the price you want to offer the seller <br />
                The price will only be visible to the seller only
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="price"
                  className="mt-4 mb-1 uppercase  text-xs "
                >
                  Name
                </label>
                <div className="flex flex-row border-grey-lighter border">
                  <span className="flex items-center bg-grey-lighter rounded rounded-r-none px-3  ">
                    <Person />
                  </span>
                  <input
                    onChange={(e: any) => {
                      setSender_Name(e.target.value);
                    }}
                    type="text"
                    name="name"
                    className="bg-grey-lighter  py-2  rounded   focus:outline-none rounded-l-none "
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="price"
                  className="mt-4 mb-1 uppercase  text-xs "
                >
                  Contact
                </label>
                <div className="flex flex-row border-grey-lighter border">
                  <span className="flex items-center bg-grey-lighter rounded rounded-r-none px-3  ">
                    <Phone />
                  </span>
                  <input
                    onChange={(e: any) => {
                      setSender_Number(e.target.value);
                    }}
                    type="number"
                    name="price"
                    className="bg-grey-lighter  py-2  rounded   focus:outline-none rounded-l-none "
                  />
                </div>
              </div>
              <p className="pt-2">1 ETH = 2,44,642 INR</p>
              <div className="flex flex-col">
                <label
                  htmlFor="price"
                  className="mt-4 mb-1 uppercase  text-xs "
                >
                  Price
                </label>
                <div className="flex flex-row border-grey-lighter border">
                  <span className="flex items-center bg-grey-lighter rounded rounded-r-none px-3  ">
                    <Rupee />
                  </span>
                  <input
                    onChange={(e: any) => {
                      setPrice(e.target.value);
                    }}
                    type="number"
                    name="price"
                    className="bg-grey-lighter  py-2  rounded   focus:outline-none rounded-l-none "
                  />
                </div>
              </div>

              <p className=" px-2 py-2 pb-2">
                {" "}
                {convertToEth(price) ? (
                  <div className="flex items-center gap-x-2">
                    {convertToEth(price)}
                    <span>ETH</span>
                  </div>
                ) : null}{" "}
              </p>
              <p className="py-2">Account Balance: {balance} ETH</p>
              <button
                onClick={handleSubmit}
                className="w-full bg-yellow-200 mt-4 py-2  font-medium text-lg"
              >
                Submit Offer
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferMaker;
