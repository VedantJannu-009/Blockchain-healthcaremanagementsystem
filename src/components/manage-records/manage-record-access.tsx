import { useState, useEffect } from "react";
import { DataTable } from "./data-table";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Doctor, ShareRecordType } from "@/lib/types";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { columns as defaultColumns } from "./columns";
import DialogDrawer from "../dialog-drawer";
import ShareRecord from "../share-record";

interface ManageRecordsProps {
  contract: Contract | null;
  patientAddress: string | null; // Patient's Ethereum Address
}

const ManageRecordAccess = ({
  contract,
  patientAddress,
}: ManageRecordsProps) => {
  const [authorizedDoctors, setAuthorizedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const fetchAuthorizedDoctors = async () => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");

      // 1️⃣ Fetch all doctors (addresses + details)
      const [allAddresses, names, specializations, isActiveArray] =
        await contract.getAllDoctors();
      const allDoctors: Doctor[] = allAddresses.map(
        (address: string, index: number) => ({
          doctorAddress: address,
          doctorName: names[index] || "Unknown",
          doctorSpecialization: specializations[index] || "Not Provided",
          isActive: isActiveArray[index],
        })
      );

      // 2️⃣ Fetch authorized doctor addresses
      const authorizedAddresses = await contract.getAuthorizedDoctorsForPatient(
        patientAddress
      );

      // 3️⃣ Filter authorized doctors from all doctors
      const authorizedDoctorsList = allDoctors.filter((doctor) =>
        authorizedAddresses.includes(doctor.doctorAddress)
      );

      setAuthorizedDoctors(authorizedDoctorsList);
    } catch (error) {
      console.error("Failed to fetch authorized doctors:", error);
      toast("Failed to load authorized doctors");
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async (doctor: ShareRecordType) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.shareRecordsWithDoctor(doctor.doctorAddress);
      await tx.wait();
      toast("Access granted successfully!");
      fetchAuthorizedDoctors();
    } catch (error) {
      toast("Failed to grant access");
      console.error("Grant access failed:", error);
    }
  };

  const revokeAccess = async (doctorAddress: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.revokeShareAccessFromDoctor(doctorAddress);
      await tx.wait();
      toast("Access revoked successfully!");
      fetchAuthorizedDoctors();
    } catch (error) {
      toast("Failed to revoke access");
      console.error("Revoke access failed:", error);
    }
  };

  const fetchDoctorInfo = async (doctorAddress: string) => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");
      const [name, specialization, isActive] = await contract.getDoctorInfo(
        doctorAddress
      );
      setSelectedDoctor({
        doctorAddress,
        doctorName: name,
        doctorSpecialization: specialization,
        isActive,
      });
    } catch (error) {
      console.error("Failed to fetch doctor info:", error);
      toast("Failed to load doctor info");
    } finally {
      setLoading(false);
    }
  };

  const viewDoctorDetails = async (doctorAddress: string) => {
    await fetchDoctorInfo(doctorAddress);
    setIsDrawerOpen(true); // Open Drawer when details are loaded
  };

  useEffect(() => {
    fetchAuthorizedDoctors();
  }, [contract]);

  const columns = defaultColumns({ revokeAccess, viewDoctorDetails });
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">Manage Authorized Doctors</h2>
        <div className="flex items-center gap-2">
          <Button size={"icon"} asChild className="p-2">
            <RefreshCcw onClick={fetchAuthorizedDoctors} />
          </Button>
          <DialogDrawer
            headerText={"Share record to doctor"}
            dsecription={"Choose a doctor to share your record"}
            buttonText={"Share Record"}
          >
            <ShareRecord contract={contract} shareRecords={grantAccess} />
          </DialogDrawer>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={authorizedDoctors} />
      )}

      {/* Doctor Details Drawer */}
      {isMobile ? (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Doctor Details</DrawerTitle>
              <DrawerDescription>View doctor information</DrawerDescription>
            </DrawerHeader>

            {selectedDoctor ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {selectedDoctor.doctorName}
                </p>
                <p className="text-gray-600">
                  Specialization: {selectedDoctor.doctorSpecialization}
                </p>
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
              <SheetDescription>View doctor information</SheetDescription>
            </SheetHeader>

            {selectedDoctor ? (
              <div className="p-4">
                <p className="text-lg font-semibold">
                  {selectedDoctor.doctorName}
                </p>
                <p className="text-gray-600">
                  Specialization: {selectedDoctor.doctorSpecialization}
                </p>
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

export default ManageRecordAccess;
