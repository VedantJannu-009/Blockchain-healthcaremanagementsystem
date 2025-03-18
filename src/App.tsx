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
import RegisterDoctor from "./components/registerDoctor";
import ManageDoctors from "./components/manage-doctors/manageDoctors";
const App = () => {
  const [currentView, setCurrentView] = useState("connect");
  const [userRole, setUserRole] = useState(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState([]);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Registration states

  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");

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

  const registerAsPatient = async () => {
    try {
      const tx = await contract.registerPatient(
        patientName,
        parseInt(patientAge)
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

  const registerAsDoctor = async (
    doctorAddress: string,
    doctorName: string,
    doctorSpecialization: string
  ) => {
    try {
      const tx = await contract.registerDoctor(
        doctorAddress,
        doctorName,
        doctorSpecialization
      );
      await tx.wait();
      fetchDoctors();
      alert("Doctor registered!");
    } catch (error) {
      console.error("Doctor registration failed:", error);
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
  const activateDoctor = async (doctorAddress) => {
    try {
      const tx = await contract.activateDoctor(doctorAddress);
      await tx.wait();
      alert("Doctor activated successfully!");
      fetchDoctors(); // Refresh the doctors list
    } catch (error) {
      console.error("Failed to activate doctor:", error);
      alert("Failed to activate doctor.");
    }
  };
  const deactivateDoctor = async (doctorAddress) => {
    try {
      const tx = await contract.deactivateDoctor(doctorAddress);
      await tx.wait();
      alert("Doctor deactivated successfully!");
      fetchDoctors(); // Refresh the doctors list
    } catch (error) {
      console.error("Failed to deactivate doctor:", error);
      alert("Failed to deactivate doctor.");
    }
  };
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
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </h2>
        <p className="text-gray-600 mt-2">Connected address: {account}</p>
      </header>

      {/* Owner Dashboard */}
      {userRole === "owner" && (
        <div className="space-y-8">
          <RegisterDoctor
            registerAsDoctor={({
              doctorAddress,
              doctorName,
              doctorSpecialization,
            }): void => {
              registerAsDoctor(doctorAddress, doctorName, doctorSpecialization);
            }}
          />
          <ManageDoctors />
          <div className="p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-6">Manage Doctors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div key={doctor.address} className="border p-4 rounded-lg">
                  <p className="font-semibold">{doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    {doctor.specialization}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        doctor.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doctor.isActive ? "Active" : "Inactive"}
                    </span>
                    {doctor.isActive ? (
                      <Button
                        onClick={() => deactivateDoctor(doctor.address)}
                        className="bg-red-500 hover:bg-red-600  text-sm px-3 py-1 rounded"
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        onClick={() => activateDoctor(doctor.address)}
                        className="bg-green-500 hover:bg-green-600  text-sm px-3 py-1 rounded"
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">All Patients</h3>
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div
                    key={patient.address}
                    className="border-b pb-2 last:border-b-0"
                  >
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">Age: {patient.age}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {patient.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">All Doctors</h3>
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.address}
                    className="border-b pb-2 last:border-b-0"
                  >
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {doctor.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Dashboard */}
      {userRole === "doctor" && (
        <div className="space-y-8">
          <div className="p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
              Patients Who Shared Records
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedPatients.map((patient) => (
                <div
                  key={patient.address}
                  className="border p-4 rounded-lg transition-colors"
                >
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600">Age: {patient.age}</p>
                  <Button
                    onClick={() => {
                      setSelectedViewPatient(patient.address);
                      loadPatientRecords(patient.address);
                    }}
                    className="mt-2 bg-blue-500 hover:bg-blue-600  text-sm px-3 py-1 rounded"
                  >
                    View Records
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {selectedViewPatient && (
            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Medical Records</h3>
              <div className="space-y-4">
                {selectedPatientRecords.map((record) => (
                  <div
                    key={record.recordID}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{record.disease}</p>
                        <p className="text-sm text-gray-600">
                          {record.diagnosis}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.treatment}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(
                          Number(record.timestamp) * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Record ID: {parseInt(record.recordID)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Add Medical Record</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="" disabled>
                  Select Patient
                </option>
                {sharedPatients.map((patient) => (
                  <option key={patient.address} value={patient.address}>
                    {patient.name}
                  </option>
                ))}
              </select>
              <input
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Disease"
                onChange={(e) => setDisease(e.target.value)}
              />
              <input
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Diagnosis"
                onChange={(e) => setDiagnosis(e.target.value)}
              />
              <input
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Treatment"
                onChange={(e) => setTreatment(e.target.value)}
              />
            </div>
            <Button
              onClick={addMedicalRecord}
              className="bg-green-500 hover:bg-green-600  font-bold py-2 px-4 rounded transition duration-300"
            >
              Add Record
            </Button>
          </div>
        </div>
      )}

      {/* Patient Dashboard */}
      {userRole === "patient" && (
        <div className="space-y-8">
          <div className="p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Medical Records</h3>
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <div
                  key={record.recordID}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{record.disease}</p>
                      <p className="text-sm text-gray-600">
                        {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-600">
                        {record.treatment}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(
                        Number(record.timestamp) * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Record ID: {record.recordID}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
              Manage Record Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-lg">Share with Doctor</h4>
                <select
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.address} value={doctor.address}>
                      {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
                <Button
                  onClick={shareRecordsWithDoctor}
                  className="bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded transition duration-300"
                >
                  Share Records
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-lg">Authorized Doctors</h4>
                <div className="space-y-2">
                  {authorizedDoctors.map((doctorAddress) => {
                    const doctor = doctors.find(
                      (d) => d.address === doctorAddress
                    );
                    return (
                      <div
                        key={doctorAddress}
                        className="flex justify-between items-center p-2 rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {doctor ? doctor.name : "Unknown Doctor"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {doctor?.specialization || "Unknown Specialization"}
                          </p>
                        </div>
                        <Button
                          onClick={() => revokeAccess(doctorAddress)}
                          className="bg-red-500 hover:bg-red-600  text-sm px-3 py-1 rounded"
                        >
                          Revoke
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen max-w-6/12 mx-auto">
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
