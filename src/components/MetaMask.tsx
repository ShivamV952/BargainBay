import React, { useState, useCallback, useEffect } from "react";
import { web3, contract } from "@/lib/contract";

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

const MetaMask = () => {
  const [balance, setBalance] = useState<string>("");
  const [address, setAddress] = useState<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [account, setAccountData] = useState<any>(null);
  useEffect(() => {
    const fetchBalance = async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const balance = await web3.eth.getBalance(account);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    fetchBalance();
  }, []);

  const _connectToMetaMask = useCallback(async () => {
    const ethereum = window.ethereum;
    if (typeof ethereum !== "undefined") {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        console.log(accounts)
        setAddress(address);

        const chainId = await ethereum.request({ method: "eth_chainId" });
        const networkId = await ethereum.request({ method: "net_version" });
        const networkName = getNetworkName(networkId);

        setAccountData({
          address,
          chainId,
          networkId,
          network: networkName,
        });
        setConnected(true);

        console.log("Connected to MetaMask with address:", address);
        console.log("Chain ID:", chainId);
        console.log("Network ID:", networkId);
        console.log("Network Name:", networkName);
      } catch (error: any) {
        setConnected(false);
        alert(`Error connecting to MetaMask: ${error.message ?? error}`);
      }
    } else {
      alert("MetaMask not installed");
    }
  }, []);

  const getNetworkName = (networkId: string) => {
    switch (networkId) {
      case "1":
        return "Mainnet";
      case "3":
        return "Ropsten";
      case "4":
        return "Rinkeby";
      case "5":
        return "Goerli";
      case "42":
        return "Kovan";
      default:
        return "Ganache";
    }
  };

  const payAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    const tx = await contract.methods
      .payAddress()
      .send({ from: account, value: web3.utils.toWei("0.1", "ether") });
    console.log("Transaction hash:", tx.transactionHash);
  };

  return (
    <div
      className={`h-full flex flex-col before:from-white after:from-sky-200 py-32`}
    >
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="grid gap-4">
          <img
            src="https://images.ctfassets.net/9sy2a0egs6zh/4zJfzJbG3kTDSk5Wo4RJI1/1b363263141cf629b28155e2625b56c9/mm-logo.svg"
            alt="MetaMask"
            className="text-center mx-auto"
            width={320}
            height={140}
          />
          {!connected ? (
            <button
              onClick={_connectToMetaMask}
              className="bg-black text-white p-4 rounded-lg"
            >
              Connect to MetaMask
            </button>
          ) : null}

          {connected ? (
            <div>
              <div className="text-center">Connected to METAMASK</div>
              <div className="w-[450px] rounded-lg my-5 flex flex-col gap-2 justify-center px-4 py-5 shadow-md shadow-orange-300">
                <div className="flex items-center justify-start gap-x-2">
                  <label htmlFor="">Address:</label>
                  <input
                    value={address}
                    disabled
                    className="w-full"
                    type="text"
                  />
                </div>
                <div className="flex items-start justify-start gap-x-2">
                  <label htmlFor="w-fit">Chain ID:</label>
                  <input
                    value={account.chainId}
                    disabled
                    className=""
                    type="text"
                  />
                </div>
                <div className="flex items-start justify-start gap-x-2">
                  <label htmlFor="w-fit">Network ID:</label>
                  <input
                    value={account.networkId}
                    disabled
                    className=""
                    type="text"
                  />
                </div>
                <div className="flex items-start justify-start gap-x-2">
                  <label htmlFor="w-fit">Network Name:</label>
                  <input
                    value={account.network}
                    className=""
                    disabled
                    type="text"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MetaMask;
