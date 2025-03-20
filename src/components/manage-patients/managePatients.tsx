import { useState, useEffect } from "react";
import { columns as defaultColumns } from "./columns";
import { DataTable } from "./data-table";
import { Patient } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";

interface ManagePatientsProps {
  contract: Contract | null;
}

const ManagePatients = ({ contract }: ManagePatientsProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPatients = async () => {
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

      setPatients(fetchedPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast("Failed to load patients");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const viewPatientDetails = () => {};

  useEffect(() => {
    fetchPatients();
  }, [contract]);

  const columns = defaultColumns({ viewPatientDetails });

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">Manage Patients</h2>
        <Button size={"icon"} asChild className="p-2">
          <RefreshCcw onClick={fetchPatients} />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-60 w-full" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-[150px]" />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={patients} />
      )}
    </section>
  );
};

export default ManagePatients;
