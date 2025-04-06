import { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import { contractAddress, contractABI } from "./lib/constants";
import { ThemeProvider } from "./components/theme-provider";
import { toast, Toaster } from "sonner";
import Header from "./components/header";
import Registration from "./pages/registration";
import Connect from "./pages/connect";
import Dashboard from "./pages/dashboard";
import { Patient } from "./lib/types";
const App = () => {
  const [currentView, setCurrentView] = useState("connect");
  const [userRole, setUserRole] = useState<
    "owner" | "patient" | "doctor" | null
  >(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        if (!contract || !account) return;
        const owner = await contract.getOwner();
        const isOwner = owner.toLowerCase() === account.toLowerCase();

        if (isOwner) {
          setUserRole("owner");
          setCurrentView("dashboard");
          return;
        }

        // Check if patient
        try {
          const [name] = await contract.getPatientInfo(account);
          if (name !== "") {
            setUserRole("patient");
            setCurrentView("dashboard");
            return;
          }
        } catch {}

        // Check if doctor
        try {
          const [name] = await contract.getDoctorInfo(account);
          if (name !== "") {
            setUserRole("doctor");
            setCurrentView("dashboard");
            return;
          }
        } catch {}

        setCurrentView("register");
      } catch (error) {
        console.error("Registration check failed:", error);
        toast("Error checking registration status");
      }
    };

    if (contract && account) checkRegistration();
  }, [contract, account]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setAccounts(accounts);
        setContract(new Contract(contractAddress, contractABI, signer));
      } catch (error) {
        console.error("Wallet connection failed:", error);
        toast("Failed to connect wallet");
      }
    } else {
      toast("Please install MetaMask");
    }
  };
  const registerAsPatient = async (patient: Patient) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      console.log(patient);
      const tx = await contract.registerPatient(
        patient.patientName,
        patient.patientAge
      );
      await tx.wait();
      setUserRole("patient");
      setCurrentView("dashboard");
    } catch (error) {
      console.error("Patient registration failed:", error);
      toast("Registration failed");
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen mx-auto">
        <Header
          account={account}
          accounts={accounts}
          onConnectWallet={connectWallet}
          onSwitchAccount={(newAccount) => {
            setAccount(newAccount);
            const provider = new BrowserProvider(window.ethereum);
            provider.getSigner().then((signer) => {
              setContract(new Contract(contractAddress, contractABI, signer));
            });
          }}
          userRole={userRole}
        />
        {currentView === "connect" && <Connect connectWallet={connectWallet} />}
        {currentView === "register" && (
          <Registration registerAsPatient={registerAsPatient} />
        )}
        {currentView === "dashboard" && (
          <Dashboard
            userRole={userRole}
            account={account}
            contract={contract}
          />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;
