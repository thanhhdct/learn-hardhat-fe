import { useState } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const contractAddress = process.env.REACT_APP_CONTRACT_SEND_ETHER_ADDRESS;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "destroy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emitEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwnerAddress",
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
    name: "showBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const SendEtherWithTransaction = () => {
  const [sendWeiValue, setSendWeiValue] = useState("");
  const [privateKeyValue, setPrivateKeyValue] = useState("");
  const [claimValue, setClaimValue] = useState("");
  const [ownerAddressValue, setOwnerAddressValue] = useState("");
  const [eventEmittedNumberValue, setEventEmittedNumberValue] = useState("");
  const [currentAddressValue, setCurrentAddressValue] = useState("");
  const [unitValue, setUnitValue] = useState("Ether");
  const [loading, setLoading] = useState(false);

  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const [wallet, setWallet] = useState(new ethers.Wallet(privateKey, provider));
  const [contract, setContract] = useState(
    new ethers.Contract(contractAddress, abi, wallet)
  );

  const handleProcess = async () => {
    setLoading(true);
    try {
      const tx = await wallet.sendTransaction({
        to: contractAddress,
        value:
          unitValue === "Ether"
            ? ethers.parseEther(sendWeiValue.toString())
            : sendWeiValue,
      });
      await tx.wait();

      toast.success("Transaction successful");
      setSendWeiValue("");
    } catch (err) {
      console.error("Error processing transaction:", err);
      toast.error(`Error processing transaction: ${err?.shortMessage}`);
    }
    setLoading(false);
  };

  const handleDestroy = async () => {
    try {
      await contract.destroy();
      toast.success("Destroy contract successfully");
    } catch (error) {
      toast.error(`Error destroying contract: ${error?.reason}`);
      console.log("🚀 ~ handleDestroy ~ error:", error);
    }
  };

  const handleChangeAccount = async () => {
    try {
      const newWallet = new ethers.Wallet(privateKeyValue, provider);
      setWallet(newWallet);
      setContract(new ethers.Contract(contractAddress, abi, newWallet));
      toast.success("Account changed successfully");
      setPrivateKeyValue("");
    } catch (error) {
      console.log("🚀 ~ handleChangeAccount ~ error:", error);
      toast.error(`Error changing account: ${error?.shortMessage}`);
    }
  };

  const getBalance = async () => {
    try {
      const result = await contract.showBalance();
      setClaimValue(result.toString());
    } catch (err) {
      console.error("Error fetching balance:", err);
      toast.error("Error fetching balance");
    }
  };

  const getOwnerAddress = async () => {
    try {
      const result = await contract.getOwnerAddress();
      setOwnerAddressValue(result);
    } catch (err) {
      console.error("Error fetching value:", err);
      toast.error("Error fetching value");
    }
  };

  contract.on("Deposit", (value, from) => {
    setEventEmittedNumberValue(value);
  });

  return (
    <div className="centered-container">
      <h2>Send Ether with transaction</h2>
      <div>
        <input
          type="text"
          value={privateKeyValue}
          onChange={(e) => setPrivateKeyValue(e.target.value)}
          disabled={loading}
          style={{ margin: "10px" }}
        />
        <button onClick={handleChangeAccount}>Change account</button>
      </div>

      <form>
        <input
          type="number"
          value={sendWeiValue}
          onChange={(e) => setSendWeiValue(e.target.value)}
          disabled={loading}
          style={{ margin: "10px" }}
        />
        <select
          onChange={(e) => setUnitValue(e.target.value)}
          value={unitValue}
          style={{ margin: "10px" }}
        >
          <option value="Ether">Ether</option>
          <option value="Wei">Wei</option>
        </select>
        <button
          onClick={handleProcess}
          disabled={loading}
          style={{ margin: "10px" }}
        >
          Send
        </button>
      </form>

      <p>Contract is holding: {claimValue} wei</p>

      {loading && <p>Loading...</p>}

      <button
        onClick={getBalance}
        disabled={loading}
        style={{ margin: "10px" }}
      >
        Fetch Value
      </button>
      <br />

      <button onClick={handleDestroy} disabled={loading}>
        Destroy contract
      </button>
      <br />

      <button
        onClick={() => setCurrentAddressValue(wallet.address)}
        disabled={loading}
        style={{ margin: "10px" }}
      >
        Get current address
      </button>
      <p>Current Address: {currentAddressValue}</p>

      <div>
        <button
          onClick={getOwnerAddress}
          disabled={loading}
          style={{ margin: "10px" }}
        >
          Get owner address
        </button>
        <p>Owner Address: {ownerAddressValue}</p>
      </div>

      <div>
        <button
          onClick={async () => {
            await contract.emitEvent();
          }}
          disabled={loading}
          style={{ margin: "10px" }}
        >
          Emit event
        </button>
        <p>Event emitted: {eventEmittedNumberValue}</p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SendEtherWithTransaction;
