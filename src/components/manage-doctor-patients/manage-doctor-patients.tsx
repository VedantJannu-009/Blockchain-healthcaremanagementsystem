import { useState, useEffect } from "react";
import { columns as defaultColumns } from "./columns"; // Ensure columns support shared patients
import { DataTable } from "./data-table";
import { Patient, Record, ShareRecordType } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import { Pill, RefreshCcw, StickyNote } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import DialogDrawer from "../dialog-drawer";
import AddMedicalRecord from "../add-medical-record";
import DrawerSheet from "../drawer-sheet";
import TransferRecord from "../transfer-record";

interface ManagePatientsProps {
  contract: Contract | null;
  account: string; // Doctor's address
}

const ManageDoctorPatients = ({ contract, account }: ManagePatientsProps) => {
  const [sharedPatients, setSharedPatients] = useState<Patient[]>([]);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Drawer State

  // Fetch patients who have shared records with this doctor
  const fetchSharedPatients = async () => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");

      const [addresses, names, ages] = await contract.getAllPatients();
      const fetchedPatients = addresses.map(
        (address: string, index: number) => ({
          patientAddress: address,
          patientName: names[index],
          patientAge: ages[index],
        })
      );

      // Filter patients who have shared access
      const filteredPatients = [];
      for (const patient of fetchedPatients) {
        const hasAccess = await contract.hasAccess(
          patient.patientAddress,
          account
        );
        if (hasAccess) {
          filteredPatients.push(patient);
        }
      }

      setSharedPatients(filteredPatients);
    } catch (error) {
      console.error("Failed to fetch shared patients:", error);
      toast("Failed to load shared patients.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientInfo = async (patientAddress: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const [name, age] = await contract.getPatientInfo(patientAddress);
      setPatientDetails({
        patientAddress,
        patientName: name,
        patientAge: age,
      });
    } catch (error) {
      console.error("Failed to fetch patient info:", error);
      toast("Failed to load patient details.");
    }
  };
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

  const viewPatientDetails = async (patientAddress: string) => {
    await fetchPatientInfo(patientAddress);
    await getMedicalRecords(patientAddress);
    setIsDrawerOpen(true);
  };

  const addMedicalRecord = async (patientAddress: string, data: Record) => {
    try {
      const { disease, diagnosis, treatment } = data;
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.addRecord(
        patientAddress,
        disease,
        diagnosis,
        treatment,
        account // authorizedDoctor (current doctor)
      );
      await tx.wait();
      getMedicalRecords(patientAddress); // Refresh the records for this patient
      alert("Record added!");
    } catch (error) {
      console.error("Failed to add record:", error);
      alert("Record addition failed");
    }
  };
  const requestRecordTransfer = async (
    patientAddress: string,
    data: ShareRecordType
  ) => {
    try {
      const { doctorAddress } = data;
      console.log(doctorAddress, patientAddress);
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.requestTransfer(patientAddress, doctorAddress);
      await tx.wait();
      alert("Transfer request sent!");
    } catch (error) {
      console.error("Transfer request failed:", error);
      alert("Transfer request failed");
    }
  };

  useEffect(() => {
    fetchSharedPatients();
  }, [contract]);

  const columns = defaultColumns({
    viewPatientDetails,
  });

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">Manage Shared Patients</h2>
        <Button size={"icon"} asChild className="p-2">
          <RefreshCcw onClick={fetchSharedPatients} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={sharedPatients} />
      )}
      <DrawerSheet
        title={"Patient Details"}
        description="View patient info & medical records"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <div className="p-2">
          {patientDetails ? (
            <section>
              <div className="bg-secondary rounded-lg p-2">
                <p className="text-lg font-semibold capitalize">
                  {patientDetails.patientName}
                </p>
                <p className="text-gray-600">
                  Age: {patientDetails.patientAge}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 my-4">
                <DialogDrawer
                  buttonText={"Add record"}
                  headerText={"Add Medical Record"}
                  dsecription={"Add a new medical record for the patient"}
                >
                  <AddMedicalRecord
                    contract={contract}
                    doctorAddress={account}
                    addMedicalRecord={(data: Record) =>
                      addMedicalRecord(patientDetails.patientAddress, data)
                    }
                  />
                </DialogDrawer>
                <DialogDrawer
                  buttonText={"Transfer record"}
                  headerText={"Request Transfer Record"}
                  dsecription={"Request Transfer of medical records"}
                >
                  <TransferRecord
                    contract={contract}
                    transferRecord={(data: ShareRecordType) =>
                      requestRecordTransfer(patientDetails.patientAddress, data)
                    }
                  />
                </DialogDrawer>
              </div>
              <h3 className="text-xl font-bold flex items-center justify-between gap-2">
                <span>Medical Records</span>
                <Button size={"icon"} asChild className="p-2">
                  <RefreshCcw
                    className="size-4"
                    onClick={() =>
                      getMedicalRecords(patientDetails?.patientAddress)
                    }
                  />
                </Button>
              </h3>
              <ScrollArea className="lg:h-[450px] h-[400px] pe-4 flex flex-col gap-4">
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
                                {record.diagnosedBy?.name}
                                ({record.diagnosedBy?.specialization})
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
          ) : (
            <p className="text-center p-4">Loading...</p>
          )}
        </div>
      </DrawerSheet>
    </section>
  );
};

export default ManageDoctorPatients;
