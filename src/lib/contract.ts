// utils/web3.ts

import Web3 from "web3";

// Connect to the local Remix IDE instance
const web3 = new Web3("http://localhost:7545");

const contractAddress = "0x12d1C341d12d3ECdA0b79AdB634Abc01BF705255"; // Your contract address
const contractAbi = [
  {
    inputs: [],
    name: "AcceptPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "payAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "RejectPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seller",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]; // Your contract ABI

const contract = new web3.eth.Contract(contractAbi, contractAddress);

export { web3, contract };
