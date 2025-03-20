import { useState, useEffect } from "react";
import { columns as defaultColumns } from "./columns";
import { DataTable } from "./data-table";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import RegisterDoctor from "../registerDoctor";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Doctor, Patient } from "@/lib/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManageDoctorsProps {
  contract: Contract | null;
}

const ManageDoctors = ({ contract }: ManageDoctorsProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctorDetails, setDoctorDetails] = useState<Doctor | null>(null);
  const [sharedPatients, setSharedPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Drawer State

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const [addresses, names, specializations, isActiveArray] =
        await contract.getAllDoctors();

      const fetchedDoctors = addresses.map(
        (address: string, index: number) => ({
          doctorAddress: address,
          doctorName: names[index],
          doctorSpecialization: specializations[index],
          isActive: isActiveArray[index],
        })
      );
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast("Failed to load doctors");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

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

  const viewDoctorDetails = async (doctorAddress: string) => {
    await fetchDoctorInfo(doctorAddress);
    await fetchSharedPatients(doctorAddress);
    setIsDrawerOpen(true); // Open Drawer when details are loaded
  };

  const fetchDoctorInfo = async (doctorAddress: string) => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const [name, specialization, isActive] = await contract.getDoctorInfo(
        doctorAddress
      );
      setDoctorDetails({
        doctorAddress,
        doctorName: name,
        doctorSpecialization: specialization,
        isActive,
      });
    } catch (error) {
      console.error("Failed to fetch doctor info:", error);
      toast("Failed to load doctor info");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const fetchSharedPatients = async (doctorAddress: string) => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const shared: Patient[] = [];
      for (const patient of patients) {
        const hasAccess = await contract.hasAccess(
          patient.patientAddress,
          doctorAddress
        );
        if (hasAccess) {
          shared.push(patient);
        }
      }
      setSharedPatients(shared);
    } catch (error) {
      console.error("Failed to fetch shared patients:", error);
      toast("Failed to load shared patients");
    } finally {
      setLoading(false);
    }
  };

  // Function to register a doctor
  const registerAsDoctor = async (
    doctorAddress: string,
    doctorName: string,
    doctorSpecialization: string
  ) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.registerDoctor(
        doctorAddress,
        doctorName,
        doctorSpecialization
      );
      await tx.wait();
      fetchDoctors(); // Refresh the list
      toast("Doctor registered!");
    } catch (error) {
      toast("Registration failed");
      console.error("Doctor registration failed:", error);
    }
  };

  const doctorAction = (isActive: boolean, address: string) => {
    if (isActive) {
      deactivateDoctor(address);
    } else {
      activateDoctor(address);
    }
    fetchDoctors();
  };
  // Function to activate a doctor
  const activateDoctor = async (address: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.activateDoctor(address);
      await tx.wait();
      fetchDoctors(); // Refresh the list
    } catch (error) {
      toast("Failed to activate doctor");
      console.error("Failed to activate doctor:", error);
    }
  };

  // Function to deactivate a doctor
  const deactivateDoctor = async (address: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.deactivateDoctor(address);
      await tx.wait();
      fetchDoctors(); // Refresh the list
    } catch (error) {
      toast("Failed to deactivate doctor");
      console.error("Failed to deactivate doctor:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, [contract]);

  const columns = defaultColumns({ doctorAction, viewDoctorDetails });
  const isMobile = useIsMobile();
  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">Manage Doctors</h2>
        <div className="flex gap-1 items-center">
          <Button size={"icon"} asChild className="p-2">
            <RefreshCcw onClick={fetchDoctors} />
          </Button>
          <RegisterDoctor
            registerAsDoctor={({
              doctorAddress,
              doctorName,
              doctorSpecialization,
            }): void => {
              registerAsDoctor(doctorAddress, doctorName, doctorSpecialization);
            }}
          />
        </div>
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
        <DataTable columns={columns} data={doctors} />
      )}

      {/* Doctor Details Drawer */}
      {isMobile ? (
        <Drawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Doctor Details</DrawerTitle>
              <DrawerDescription>
                View doctor info & shared patients
              </DrawerDescription>
            </DrawerHeader>

            {doctorDetails ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {doctorDetails.doctorName}
                </p>
                <p className="text-gray-600">
                  Specialization: {doctorDetails.doctorSpecialization}
                </p>
                <p
                  className={`text-sm ${
                    doctorDetails.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {doctorDetails.isActive ? "Active" : "Inactive"}
                </p>

                <h3 className="mt-4 font-medium">Shared Patients</h3>
                <ul className="list-disc list-inside mt-2">
                  {sharedPatients.length > 0 ? (
                    sharedPatients.map((patient) => (
                      <li key={patient.patientAddress}>
                        {patient.patientName} (Age: {patient.patientAge})
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No shared patients</p>
                  )}
                </ul>
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
              <SheetTitle>Doctor Details</SheetTitle>
              <SheetDescription>
                View doctor info & shared patients
              </SheetDescription>
            </SheetHeader>
            {doctorDetails ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {doctorDetails.doctorName}
                </p>
                <p className="text-gray-600">
                  Specialization: {doctorDetails.doctorSpecialization}
                </p>
                <p
                  className={`text-sm ${
                    doctorDetails.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {doctorDetails.isActive ? "Active" : "Inactive"}
                </p>

                <h3 className="mt-4 font-medium">Shared Patients</h3>
                <ul className="list-disc list-inside mt-2">
                  {sharedPatients.length > 0 ? (
                    sharedPatients.map((patient) => (
                      <li key={patient.patientAddress}>
                        {patient.patientName} (Age: {patient.patientAge})
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No shared patients</p>
                  )}
                </ul>
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

export default ManageDoctors;
