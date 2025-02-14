import { useState } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"

const SimpleStorage = () => {
  const [increaseValue, setIncreaseValue] = useState("");
  const [decreaseValue, setDecreaseValue] = useState("");
  const [claimValue, setClaimValue] = useState("");
  const [loading, setLoading] = useState(false);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const privateKey = process.env.REACT_APP_PRIVATE_KEY;
  const apikey = process.env.REACT_APP_API_KEY;
  const abi = [
    {
      inputs: [
        {
          internalType: "int256",
          name: "value",
          type: "int256",
        },
      ],
      name: "decrease",
      outputs: [
        {
          internalType: "int256",
          name: "",
          type: "int256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getNumber",
      outputs: [
        {
          internalType: "int256",
          name: "",
          type: "int256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "int256",
          name: "value",
          type: "int256",
        },
      ],
      name: "increase",
      outputs: [
        {
          internalType: "int256",
          name: "",
          type: "int256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const provider = new ethers.AlchemyProvider("sepolia", apikey);
  // use JsonRpcProvider if contract is deployed to local network
  // const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const handleIncrease = async () => {
    setLoading(true);
    try {
      const tx = await contract.increase(increaseValue);
      await tx.wait();

      toast.success("Increase successful");
      setIncreaseValue("");
    } catch (err) {
      console.error("Error increasing value:", err);
      toast.error("Error increasing value");
    }
    setLoading(false);
  };

  const handleDecrease = async () => {
    setLoading(true);
    try {
      const tx = await contract.decrease(decreaseValue);
      await tx.wait();

      toast.success("Decrease successful");
      setDecreaseValue("");
    } catch (err) {
      console.error("Error decreasing value:", err);
      toast.error("Error decreasing value");
    }
    setLoading(false);
  };

  const fetchValue = async () => {
    try {
      const result = await contract.getNumber();
      setClaimValue(result);
    } catch (err) {
      console.error("Error fetching value:", err);
      toast.error("Error fetching value");
    }
  };

  return (
    <div className="centered-container">
      <h2>Simple Storage</h2>

      <input
        type="number"
        value={increaseValue}
        onChange={(e) => setIncreaseValue(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleIncrease} disabled={loading}>
        Increase
      </button>
      <br />

      <input
        type="number"
        value={decreaseValue}
        onChange={(e) => setDecreaseValue(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleDecrease} disabled={loading}>
        Decrease
      </button>

      <p>Value: {claimValue}</p>

      {loading && <p>Loading...</p>}

      <button onClick={fetchValue} disabled={loading}>
        Fetch Value
      </button>

      <ToastContainer />
    </div>
  );
};

export default SimpleStorage;
