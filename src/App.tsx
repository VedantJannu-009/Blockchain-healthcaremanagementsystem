import { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import { contractAddress, contractABI } from "./lib/constants";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Toaster } from "sonner";
import Header from "./components/header";
import Registration from "./pages/registration";
import Connect from "./pages/connect";
import Dashboard from "./pages/dashboard";
import ManageDoctors from "./components/manage-doctors/manage-doctors";
import EventLogs from "./components/event-logs";
import ManagePatients from "./components/manage-patients/manage-patients";
import { Patient } from "./lib/types";
import MedicalRecords from "./components/medical-record";
import ManageRecordAccess from "./components/manage-records/manage-record-access";
import ManageTransferRequests from "./components/manage-transfer-request/manage-transfer-request";
import ManageDoctorPatients from "./components/manage-doctor-patients/manage-doctor-patients";
const App = () => {
  const [currentView, setCurrentView] = useState("connect");
  const [userRole, setUserRole] = useState<
    "owner" | "patient" | "doctor" | null
  >(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState([]);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Patient states
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);

  // Doctor states
  const [disease, setDisease] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [sharedPatients, setSharedPatients] = useState([]);
  const [selectedPatientRecords, setSelectedPatientRecords] = useState([]);
  const [selectedViewPatient, setSelectedViewPatient] = useState("");

  // Transfer request states
  const [transferRecordId, setTransferRecordId] = useState("");
  const [transferToDoctor, setTransferToDoctor] = useState("");
  const [transferRequests, setTransferRequests] = useState([]);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const owner = await contract.getOwner();
        const isOwner = owner.toLowerCase() === account.toLowerCase();

        if (isOwner) {
          setUserRole("owner");
          setCurrentView("dashboard");
          return;
        }

        // Check if patient
        try {
          const [name, age] = await contract.getPatientInfo(account);
          if (name !== "") {
            setUserRole("patient");
            setCurrentView("dashboard");
            loadPatientData();
            return;
          }
        } catch (error) {
          console.log("Not a patient:", error);
        }

        // Check if doctor
        try {
          const [name, specialization] = await contract.getDoctorInfo(account);
          if (name !== "") {
            setUserRole("doctor");
            setCurrentView("dashboard");
            fetchSharedPatients();
            return;
          }
        } catch (error) {
          console.log("Not a doctor:", error);
        }

        setCurrentView("register");
      } catch (error) {
        console.error("Registration check failed:", error);
        alert("Error checking registration status");
      }
    };

    if (contract && account) {
      fetchDoctors();
      fetchPatients();
      checkRegistration();
    }
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
        alert("Failed to connect wallet");
      }
    } else {
      alert("Please install MetaMask");
    }
  };
  // Add a function to fetch patients who have shared their records
  const fetchSharedPatients = async () => {
    try {
      const shared = [];
      for (const patient of patients) {
        // Use the hasAccess function to check if the patient has shared their records
        const hasAccess = await contract.hasAccess(patient.address, account); // account is the doctor's address
        if (hasAccess) {
          shared.push(patient);
        }
      }
      setSharedPatients(shared);
    } catch (error) {
      console.error("Failed to fetch shared patients:", error);
      alert("Failed to load patients who have shared their records.");
    }
  };
  useEffect(() => {
    if (userRole === "doctor" && patients.length > 0) {
      fetchSharedPatients();
    }
  }, [patients, userRole, contract, account]);

  // Add function to load patient records
  const loadPatientRecords = async (patientAddress) => {
    try {
      const records = await contract.getRecordsForPatient(patientAddress);
      setSelectedPatientRecords(records);
    } catch (error) {
      console.error("Failed to load patient records:", error);
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
      loadPatientData();
    } catch (error) {
      console.error("Patient registration failed:", error);
      alert("Registration failed");
    }
  };

  const addMedicalRecord = async () => {
    try {
      const tx = await contract.addRecord(
        selectedPatient,
        disease,
        diagnosis,
        treatment,
        account // authorizedDoctor
      );
      await tx.wait();
      alert("Record added!");
      await getMedicalRecords(selectedPatient);
    } catch (error) {
      console.error("Failed to add record:", error);
      alert("Record addition failed");
    }
  };

  const requestTransfer = async () => {
    try {
      const tx = await contract.requestTransfer(
        parseInt(transferRecordId),
        transferToDoctor
      );
      await tx.wait();
      alert("Transfer requested!");
      loadTransferRequests();
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer request failed");
    }
  };

  const loadPatientData = async () => {
    try {
      await getPatientInfo();
      await getMedicalRecords(account);
      await loadAuthorizedDoctors();
      await loadTransferRequests();
    } catch (error) {
      console.error("Failed to fetch patient information:", error);
    }
  };
  const getPatientInfo = async () => {
    try {
      const [name, age] = await contract.getPatientInfo(account);
      setPatientName(name);
      setPatientAge(parseInt(age));
    } catch (error) {
      console.error("Failed to fetch patient information:", error);
    }
  };
  const getMedicalRecords = async (patientAddress) => {
    try {
      const records = await contract.getRecordsForPatient(patientAddress);
      setMedicalRecords(records);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    }
  };
  const loadAuthorizedDoctors = async () => {
    try {
      const addresses = await contract.getAuthorizedDoctorsForPatient(account);
      setAuthorizedDoctors(addresses);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  const loadTransferRequests = async () => {
    try {
      // Fetch transfer requests with IDs from the smart contract
      const requestsWithId = await contract.getTransferRequestsForPatient();
      console.log("Transfer Requests with IDs:", requestsWithId);

      // Transform the data for easier use in the frontend
      const formattedRequests = requestsWithId.map(
        ({ requestId, request }) => ({
          requestId: requestId, // Convert BigNumber to string
          recordId: request.recordID.toString(),
          fromDoctor: request.fromDoctor,
          toDoctor: request.toDoctor,
          patientAddress: request.patientAddress,
          approved: request.approved,
          expiryTimestamp: request.expiryTimestamp.toString(),
          rejectionReason: request.rejectionReason,
        })
      );

      // Update state with the formatted requests
      setTransferRequests(formattedRequests);
      console.log(formattedRequests);
    } catch (error) {
      console.error("Failed to load transfer requests:", error);
    }
  };
  const shareRecordsWithDoctor = async () => {
    try {
      const tx = await contract.shareRecordsWithDoctor(selectedDoctor);
      await tx.wait();
      loadAuthorizedDoctors();
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Failed to share records");
    }
  };

  const revokeAccess = async (doctorAddress) => {
    try {
      const tx = await contract.revokeShareAccessFromDoctor(doctorAddress);
      await tx.wait();
      loadAuthorizedDoctors();
    } catch (error) {
      console.error("Revoke failed:", error);
      alert("Failed to revoke access");
    }
  };

  const fetchDoctors = async () => {
    try {
      const [addresses, names, specializations, isActiveArray] =
        await contract.getAllDoctors();
      console.log(addresses, names, specializations, isActiveArray);
      const doctorsWithStatus = addresses.map((address, index) => ({
        address,
        name: names[index],
        specialization: specializations[index],
        isActive: isActiveArray[index],
      }));
      setDoctors(doctorsWithStatus);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const [addresses, names, ages] = await contract.getAllPatients();
      setPatients(
        addresses.map((address, index) => ({
          address,
          name: names[index],
          age: ages[index].toString(),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  // const checkDoctorActiveStatus = async (doctorAddress) => {
  //   try {
  //     const isActive = await contract.isDoctorActive(doctorAddress);
  //     return isActive;
  //   } catch (error) {
  //     console.error("Failed to fetch doctor's active status:", error);
  //     return false; // Default to false in case of an error
  //   }
  // };
  const approveTransferByPatient = async (requestId) => {
    try {
      const tx = await contract.approveTransferByPatient(requestId);
      await tx.wait();
      alert("Transfer request approved!");
      loadTransferRequests(); // Refresh the transfer requests list
    } catch (error) {
      console.error("Failed to approve transfer request:", error);
      alert("Failed to approve transfer request.");
    }
  };
  const rejectTransferByPatient = async (requestId) => {
    try {
      const tx = await contract.rejectTransferByPatient(
        requestId,
        "Not needed"
      );
      await tx.wait();
      alert("Transfer request rejected!");
      loadTransferRequests(); // Refresh the transfer requests list
    } catch (error) {
      console.error("Failed to reject transfer request:", error);
      alert("Failed to reject transfer request.");
    }
  };

  const renderDashboard = () => (
    <div className="container mx-auto p-6">
      <Dashboard userRole={userRole} account={account} />
      {/* Owner Dashboard */}
      {userRole === "owner" && contract && (
        <div className="space-y-8">
          <EventLogs contract={contract} />
          <ManageDoctors contract={contract} />
          <ManagePatients contract={contract} />
        </div>
      )}

      {/* Doctor Dashboard */}
      {userRole === "doctor" && account && (
        <div className="space-y-8">
          <ManageDoctorPatients contract={contract} account={account} />
        </div>
      )}

      {/* Patient Dashboard */}
      {userRole === "patient" && (
        <div className="space-y-8">
          <MedicalRecords contract={contract} patientAddress={account} />
          <ManageRecordAccess contract={contract} patientAddress={account} />
          <ManageTransferRequests contract={contract} />
        </div>
      )}
    </div>
  );

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
        />
        {currentView === "connect" && <Connect connectWallet={connectWallet} />}
        {currentView === "register" && (
          <Registration registerAsPatient={registerAsPatient} />
        )}
        {currentView === "dashboard" && renderDashboard()}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default App;
