"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/SupabaseClient";
import { useRouter } from "next/navigation";
import { contract, web3 } from "@/lib/contract";
import generateInvoicePdf from "@/lib/invoice";

const getOffers = async (receiver_id: any) => {
  const { data, error } = await supabase
    .from("offers")
    .select()
    .eq("receiver_id", receiver_id);
  return data;
};

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  totalAmount: string;
  productName: string;
  price: string;
  transactionId: any;
  // Add more invoice data as needed
}

const Page = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const response = await getOffers(user.id);
        setData(response);
      } else {
        router.push("/");
      }
    };
    getUser();
  }, []);

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

  const handleGeneratePdf = async (item: any, tx: any) => {
    const invoiceData: InvoiceData = {
      invoiceNumber: `INVOICE-${generated(7)}`,
      date: "2024-04-30",
      totalAmount: "$100.00",
      productName: item.product_name,
      // image: item.product_image,
      price: item.price,
      transactionId: tx,
      // Add more invoice data as needed
    };

    const pdfBytes = await generateInvoicePdf(invoiceData);

    const name = `invoice-${generated(5)}`;
    var { data, error } = await supabase.storage
      .from("product_images")
      .upload("/" + name, pdfBytes, {
        contentType: "application/pdf",
      });

    if (error) {
      console.error("Error uploading PDF:", error.message);
      return;
    }

    console.log("PDF uploaded successfully:", data);

    const pdfUrl =
      "https://nllszuxcqbnhgngchcau.supabase.co/storage/v1/object/public/product_images/" +
      name;

    const response = await supabase
      .from("offers")
      .update({ accepted: true, invoice: pdfUrl })
      .eq("id", item.id);

    console.log(pdfUrl);
    console.log(response);
    setPdfUrl(pdfUrl);
  };

  function convertToEth(amountInr: string | undefined): number | null {
    if (amountInr == undefined) return null;
    const amount: number = parseFloat(amountInr);
    return amount / 244642;
  }

  const acceptOffer = async (item: any) => {
    const eths = convertToEth(item.price);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[1];
    const tx = await contract.methods
      .AcceptPay()
      .send({
        from: account,
        value: web3.utils.toWei(JSON.stringify(eths), "ether"),
      });
    console.log("Transaction hash:", tx.transactionHash);
    await handleGeneratePdf(item, tx);
    window.location.reload();
  };

  const RejectOffer = async (item: any) => {
    const eths = convertToEth(item.price);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[1];
    const tx = await contract.methods
      .RejectPay()
      .send({ from: account, value: web3.utils.toWei("0.1", "ether") });
    console.log("Transaction hash:", tx.transactionHash);
    const { error } = await supabase
      .from("offers")
      .delete()
      .eq(JSON.stringify(eths), item.id);
    window.location.reload();
  };

  return (
    <div className="py-10  ">
      <div className=" pb-4">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Offers Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          This information displayed here are made by the buyer and only visible
          to you.
        </p>
        <hr className="mt-3 w-[100%]" />
        {pdfUrl && (
          <a href={pdfUrl} download="invoice.pdf">
            Download Invoice
          </a>
        )}
      </div>
      <div className="w-full ">
        <Table className="w-full ">
          <TableCaption>A list of your recent Offers.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Sender Name</TableHead>
              <TableHead>Sender Number</TableHead>
              <TableHead>Offered Price</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: any, index: any) => {
              if (item.accepted == false) {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-x-2">
                      <img
                        className="h-10 w-10"
                        src={item.product_image}
                        alt=""
                      />
                      {item.product_name}
                    </TableCell>
                    <TableCell>{item.sender_name}</TableCell>
                    <TableCell>{item.sender_number}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => acceptOffer(item)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Accept
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => RejectOffer(item)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
        {data && data.length == 0 ? (
          <div className="my-2 text-center w-full"> No Offers yet</div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
