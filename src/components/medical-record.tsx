import { useState, useEffect } from "react";
import { Contract } from "ethers";
import { Record } from "@/lib/types";
import { Pill, RefreshCcw, StickyNote } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface MedicalRecordsProps {
  contract: Contract | null;
  patientAddress: string;
}

const MedicalRecords = ({ contract, patientAddress }: MedicalRecordsProps) => {
  const [medicalRecords, setMedicalRecords] = useState<Record[]>([]);
  const getMedicalRecords = async (patientAddress: string) => {
    try {
      console.log("refershing");
      if (!contract) throw new Error("Contract not initialized");
      const records = await contract.getRecordsForPatient(patientAddress);
      const enrichedRecords = await Promise.all(
        records.map(async (record: any) => {
          const [name, specialization, isActive] = await contract.getDoctorInfo(
            record.diagnosedBy
          );
          return {
            recordID: record.recordID,
            disease: record.disease,
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            timestamp: record.timestamp,
            diagnosedBy: {
              address: record.diagnosedBy,
              name: name,
              specialization: specialization,
              isActive: isActive,
            },
          };
        })
      );
      console.log(enrichedRecords);
      setMedicalRecords(enrichedRecords);
    } catch (error) {
      console.error("Failed to fetch medical records:", error);
    }
  };
  useEffect(() => {
    if (contract && patientAddress) {
      getMedicalRecords(patientAddress);
    }
  }, [contract, patientAddress]);

  return (
    <section>
      <h3 className="text-xl font-bold flex items-center justify-between gap-2">
        <span>Medical Records</span>
        <Button size={"icon"} asChild className="p-2">
          <RefreshCcw
            className="size-4"
            onClick={() => getMedicalRecords(patientAddress)}
          />
        </Button>
      </h3>
      <ScrollArea className="lg:max-h-[350px] max-h-[400px] pe-4 flex flex-col gap-4">
        {medicalRecords.length > 0 ? (
          medicalRecords.map((record) => {
            const date = new Date(Number(record.timestamp) * 1000);
            const month = date
              .toLocaleString("default", { month: "short" })
              .toUpperCase();
            const day = date.getDate().toString().padStart(2, "0");
            console.log(record, "record");
            return (
              <Card
                key={record.recordID}
                className="grid grid-cols-8 gap-4 p-2 mt-4"
              >
                <section>
                  <p>{month}</p>
                  <p>{day}</p>
                </section>
                <section className="col-span-7">
                  <section className="flex items-center justify-between gap-1">
                    <section>
                      <p className="text-xs text-gray-600 font-semibold">
                        Condition
                      </p>
                      <p className="font-semibold text-sm text-ellipsis">
                        {record.disease}
                      </p>
                    </section>
                    <section>
                      <p className="text-xs text-gray-600 font-semibold">
                        Doctor
                      </p>
                      <p className="text-sm font-semibold text-ellipsis">
                        {record.diagnosedBy?.name}(
                        {record.diagnosedBy?.specialization})
                      </p>
                    </section>
                  </section>
                  <section className="flex flex-col gap-2 mt-4">
                    <section className="bg-secondary p-2 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                        <Pill className="size-3" />
                        <span className="text-xs">Treatment</span>
                      </p>
                      <p className="text-sm font-medium text-ellipsis">
                        {record.treatment}
                      </p>
                    </section>
                    <section className="bg-secondary p-2 rounded-lg">
                      <p className="text-sm text-gray-600 font-semibold flex items-center gap-1">
                        <StickyNote className="size-3" />
                        <span className="text-xs">Diagnosis</span>
                      </p>
                      <p className="text-sm font-medium text-ellipsis">
                        {record.diagnosis}
                      </p>
                    </section>
                  </section>
                </section>
              </Card>
            );
          })
        ) : (
          <p className="text-gray-500">No medical records found.</p>
        )}
      </ScrollArea>
    </section>
  );
};

export default MedicalRecords;
