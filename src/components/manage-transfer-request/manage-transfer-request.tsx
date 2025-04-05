import { useState, useEffect } from "react";
import { columns as defaultColumns } from "./columns"; // Ensure columns are updated for transfer requests
import { DataTable } from "./data-table";
import { Skeleton } from "../ui/skeleton";
import { Contract } from "ethers";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManageTransferRequestsProps {
  contract: Contract | null;
}

const ManageTransferRequests = ({ contract }: ManageTransferRequestsProps) => {
  const [transferRequests, setTransferRequests] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadTransferRequests = async () => {
    try {
      setLoading(true);
      if (!contract) throw new Error("Contract not initialized");

      // Fetch transfer requests from the smart contract
      const requestsWithId = await contract.getTransferRequestsForPatient();
      console.log("Transfer Requests with IDs:", requestsWithId);

      // Transform the data into a frontend-friendly format
      const formattedRequests = requestsWithId.map(
        ({ requestId, request }) => ({
          requestId: requestId.toString(), // Convert BigNumber to string
          recordId: request.recordID.toString(),
          fromDoctor: request.fromDoctor,
          toDoctor: request.toDoctor,
          patientAddress: request.patientAddress,
          approved: request.approved,
          expiryTimestamp: request.expiryTimestamp.toString(),
          rejectionReason: request.rejectionReason,
        })
      );

      setTransferRequests(formattedRequests);
    } catch (error) {
      console.error("Failed to load transfer requests:", error);
      toast("Failed to load transfer requests");
    } finally {
      setLoading(false);
    }
  };

  const approveTransferRequest = async (requestId: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const tx = await contract.approveTransferByPatient(requestId);
      await tx.wait();
      toast("Transfer request approved!");
      loadTransferRequests(); // Refresh the table
    } catch (error) {
      console.error("Failed to approve transfer request:", error);
      toast("Failed to approve transfer request.");
    }
  };

  const rejectTransferRequest = async (requestId: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const tx = await contract.rejectTransferByPatient(
        requestId,
        "Not needed"
      );
      await tx.wait();
      toast("Transfer request rejected!");
      loadTransferRequests(); // Refresh the table
    } catch (error) {
      console.error("Failed to reject transfer request:", error);
      toast("Failed to reject transfer request.");
    }
  };

  useEffect(() => {
    loadTransferRequests();
  }, [contract]);

  const columns = defaultColumns({
    approveTransferRequest,
    rejectTransferRequest,
  });
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6">Manage Transfer Requests</h2>
        <div className="flex items-center gap-2">
          <Button size={"icon"} asChild className="p-2">
            <RefreshCcw onClick={loadTransferRequests} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      ) : (
        <DataTable columns={columns} data={transferRequests} />
      )}
    </section>
  );
};

export default ManageTransferRequests;
