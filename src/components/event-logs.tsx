import { Contract } from "ethers";
import { useEffect, useState } from "react";
interface ContractProps {
  contract: Contract;
}

const EventLogs = ({ contract }: ContractProps) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Function to add logs
    const addLog = (message: string) => {
      setLogs((prevLogs) => [...prevLogs, message]);
    };

    // Listening to all contract events
    contract.on("PatientRegistered", (patientAddress: string, name: string) => {
      addLog(`👤 Patient Registered: ${name} (${patientAddress})`);
    });

    contract.on("DoctorRegistered", (doctorAddress: string, name: string) => {
      addLog(`🩺 Doctor Registered: ${name} (${doctorAddress})`);
    });

    contract.on(
      "RecordAdded",
      (
        patient: string,
        doctor: string,
        recordId: { toString: () => string }
      ) => {
        addLog(
          `📑 Record Added - Patient: ${patient}, Doctor: ${doctor}, Record ID: ${recordId.toString()}`
        );
      }
    );

    contract.on(
      "TransferRequested",
      (
        requestId: { toString: () => string },
        recordId: { toString: () => string },
        fromDoctor: string,
        toDoctor: string,
        patientAddress: string
      ) => {
        addLog(
          `🔄 Transfer Requested - ReqID: ${requestId.toString()}, Record ID: ${recordId.toString()}, From: ${fromDoctor}, To: ${toDoctor}, Patient: ${patientAddress}`
        );
      }
    );

    contract.on(
      "TransferApproved",
      (
        requestId: { toString: () => string },
        recordId: { toString: () => string },
        fromDoctor: string,
        toDoctor: string,
        patientAddress: string
      ) => {
        addLog(
          `✅ Transfer Approved - ReqID: ${requestId.toString()}, Record ID: ${recordId.toString()}, From: ${fromDoctor}, To: ${toDoctor}, Patient: ${patientAddress}`
        );
      }
    );

    contract.on(
      "TransferRejected",
      (
        requestId: { toString: () => string },
        recordId: { toString: () => string },
        fromDoctor: string,
        toDoctor: string,
        patientAddress: string,
        reason: string
      ) => {
        addLog(
          `❌ Transfer Rejected - ReqID: ${requestId.toString()}, Record ID: ${recordId.toString()}, From: ${fromDoctor}, To: ${toDoctor}, Patient: ${patientAddress}, Reason: ${reason}`
        );
      }
    );

    contract.on("RecordShared", (patient: string, doctor: string) => {
      addLog(`🔓 Record Shared - Patient: ${patient}, Doctor: ${doctor}`);
    });

    contract.on("AccessRevoked", (patient: string, doctor: string) => {
      addLog(`🔒 Access Revoked - Patient: ${patient}, Doctor: ${doctor}`);
    });

    contract.on("DoctorActivated", (doctorAddress: string) => {
      addLog(`✅ Doctor Activated: ${doctorAddress}`);
    });

    contract.on("DoctorDeactivated", (doctorAddress: string) => {
      addLog(`❌ Doctor Deactivated: ${doctorAddress}`);
    });

    return () => {
      contract.removeAllListeners(); // Cleanup on unmount
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-lg font-bold">Event Logs</h2>
      <div className="overflow-y-auto max-h-64">
        {logs.length > 0 ? (
          logs.map((log, index) => <p key={index}>{log}</p>)
        ) : (
          <p>No logs yet...</p>
        )}
      </div>
    </div>
  );
};

export default EventLogs;
