/* eslint-disable no-unused-vars */
import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";
import { contractAddress, contractABI } from "../Utils/Constants";
import { v4 as uuidv4 } from "uuid";


export const TransactionsContext = createContext();

const { ethereum } = window;

// use ether.js to get ethereum smart contract (for FE to interact with smart contract)
const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionsContract;
}

const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionsCount, setTransactionsCount] = useState(localStorage.getItem("transactionsCount"));
  const [transactions, setTransactions] = useState([]);

  // handle change form input fields
  const handleChange = (e, name) => {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: e.target.value
      }
    })
  };

  // Check if MetaMask wallet is connected (or installed)
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      }

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  // handle to connect MetaMask wallet
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  // handle send transaction
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const { addressTo, amount, keyword, message } = formData;
      // convert string to big number
      const paresedAmount = ethers.utils.parseEther(amount);

      const transactionsContract = getEthereumContract();

      // gas and value are always Gwei or Hexadecimal
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", // 21000 Gwei 
          value: paresedAmount._hex // string
        }]
      })

      // return transaction hash
      const transactionHash = await transactionsContract.addToBlockchain(addressTo, paresedAmount, message, keyword)

      // wait for transaction send
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // count transactions number
      const transactionsCount = await transactionsContract.getTransactionCount();

      setTransactionsCount(transactionsCount.toNumber());

      window.location.reload();

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  };

  // handle get all transactions
  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      // get transactions smart contract
      const transactionsContract = getEthereumContract();
      const allTransactions = await transactionsContract.getAllTransactions();

      // modify structured for transactions list
      const structuredTransactions = allTransactions.map(transaction => ({
        id: uuidv4(),
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        // Convert big number to number convert to date format
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        // Convert hex to dec then devide 10^18
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))

      setTransactions(structuredTransactions);

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  }

  // check if all transactions is exist
  const checkIfTransctionsExist = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      // get transactions smart contract
      const transactionsContract = getEthereumContract();

      const transactionsCount = await transactionsContract.getTransactionCount();
      localStorage.setItem("transactionsCount", transactionsCount)

      getAllTransactions();

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");
    }
  }
  
  // check if acccount MetaMask changed or locked
  const checkIfAccountChanged = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      ethereum.on('accountsChanged', (accounts) => {
        console.log("Account changed to:", accounts[0]);
        setCurrentAccount(accounts[0]);
      });

    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object.");

    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransctionsExist();
    checkIfAccountChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TransactionsContext.Provider
      value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactionsCount, transactions, isLoading }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export default TransactionsProvider;