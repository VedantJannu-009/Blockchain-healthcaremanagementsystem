import { useState, useEffect } from "react";
import { Contract } from "ethers";
import { Record } from "@/lib/types";
import { BadgeCheck, Hourglass } from "lucide-react";
import { cn } from "@/lib/utils"; // className helper
import { Card } from "./ui/card";

interface MedicalRecordsProps {
  contract: Contract | null;
  patientAddress: string | null;
}

const MedicalRecords = ({ contract, patientAddress }: MedicalRecordsProps) => {
  const [medicalRecords, setMedicalRecords] = useState<Record[]>([]);

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        if (!contract) throw new Error("Contract not initialized");
        const records = await contract.getRecordsForPatient(patientAddress);
        setMedicalRecords(records);
      } catch (error) {
        console.error("Failed to fetch medical records:", error);
      }
    };

    if (contract && patientAddress) {
      fetchMedicalRecords();
    }
  }, [contract, patientAddress]);

  return (
    <div className="p-6 rounded-lg shadow-md bg-white">
      <h3 className="text-2xl font-bold mb-6">Medical Records</h3>

      <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-10">
        {medicalRecords.length > 0 ? (
          medicalRecords.map((record, idx) => {
            const date = new Date(Number(record.timestamp) * 1000);
            const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
            const day = date.getDate().toString().padStart(2, "0");

            const isDone = idx % 2 === 0; // TEMP: Alternate status (you can update this with real data)

            return (
              <div key={record.recordID} className="relative">
                {/* Date bubble */}
                <div className="absolute -left-6 top-0 w-10 h-10 bg-white rounded-full border-2 border-blue-500 flex flex-col items-center justify-center text-sm font-bold text-blue-600">
                  <span>{month}</span>
                  <span>{day}</span>
                </div>

                {/* Record card */}
                <Card className="p-4 bg-gray-50 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Condition</div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        isDone ? "text-green-600" : "text-yellow-500"
                      )}
                    >
                      {isDone ? (
                        <>
                          <BadgeCheck size={16} /> Done
                        </>
                      ) : (
                        <>
                          <Hourglass size={16} /> Pending
                        </>
                      )}
                    </div>
                  </div>

                  <div className="font-semibold text-lg mt-1">
                    {record.disease}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Treatment</p>
                      <p className="text-sm font-medium">{record.treatment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Doctor</p>
                      <p className="text-sm font-medium">{record.diagnosedBy}</p>
                    </div>
                  </div>

                  {record.diagnosis && (
                    <div className="mt-4 bg-white p-3 rounded-md border text-sm text-gray-700">
                      {record.diagnosis}
                    </div>
                  )}
                </Card>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No medical records found.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
