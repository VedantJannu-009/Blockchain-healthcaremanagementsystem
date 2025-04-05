import { useState, useEffect } from "react";
import { columns as defaultColumns } from "./columns";
import { DataTable } from "./data-table";
import { Doctor, Patient } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

interface ManagePatientsProps {
  contract: Contract | null;
}

const ManagePatients = ({ contract }: ManagePatientsProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [authorizedDoctors, setAuthorizedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Drawer State

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

  const fetchPatientInfo = async (patientAddress: string) => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const [name, age] = await contract.getPatientInfo(patientAddress);
      setPatientDetails({
        patientAddress,
        patientName: name,
        patientAge: age,
      });
    } catch (error) {
      console.error("Failed to fetch patient information:", error);
      toast("Failed to load patient info");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorizedDoctorsForPatient = async (patientAddress: string) => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const addresses = await contract.getAuthorizedDoctorsForPatient(
        patientAddress
      );
      setAuthorizedDoctors(addresses);
    } catch (error) {
      console.error("Failed to load doctors:", error);
      toast("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const viewPatientDetails = async (patientAddress: string) => {
    await fetchPatientInfo(patientAddress);
    await fetchAuthorizedDoctorsForPatient(patientAddress);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    fetchPatients();
  }, [contract]);

  const columns = defaultColumns({ viewPatientDetails });
  const isMobile = useIsMobile();
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
      {isMobile ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Patient Details</DrawerTitle>
              <DrawerDescription>
                View patient info & authorized doctors
              </DrawerDescription>
            </DrawerHeader>

            {patientDetails ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {patientDetails.patientName}
                </p>
                <p className="text-gray-600">
                  Age: {patientDetails.patientAge}
                </p>
                <h3 className="mt-4 font-medium">Authorized Doctors</h3>
                <div className="list-disc list-inside mt-2">
                  {authorizedDoctors.length > 0 ? (
                    authorizedDoctors.map((doctor) => (
                      <p key={doctor.doctorAddress}>
                        {doctor.doctorName} (Specialization:{" "}
                        {doctor.doctorSpecialization})
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No authorized doctors
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center p-4">Loading...</p>
            )}

            <DrawerFooter>
              <DrawerClose asChild>
                <Button className="w-full">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Patient Details</SheetTitle>
              <SheetDescription>
                View patient info & authorized doctors
              </SheetDescription>
            </SheetHeader>
            {patientDetails ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {patientDetails.patientName}
                </p>
                <p className="text-gray-600">
                  Age: {patientDetails.patientAge}
                </p>

                <h3 className="mt-4 font-medium">Authorized doctors</h3>
                <div className="list-disc list-inside mt-2">
                  {authorizedDoctors.length > 0 ? (
                    authorizedDoctors.map((doctor) => (
                      <p key={doctor.doctorAddress}>
                        {doctor.doctorName} (Specialization:{" "}
                        {doctor.doctorSpecialization})
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No authorized doctors
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center p-4">Loading...</p>
            )}
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
};

export default ManagePatients;
