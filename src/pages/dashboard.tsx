import CopyButton from "@/components/copy-button";
import EventLogs from "@/components/event-logs";
import ManageDoctorPatients from "@/components/manage-doctor-patients/manage-doctor-patients";
import ManageDoctors from "@/components/manage-doctors/manage-doctors";
import ManagePatients from "@/components/manage-patients/manage-patients";
import ManageRecordAccess from "@/components/manage-records/manage-record-access";
import ManageTransferRequests from "@/components/manage-transfer-request/manage-transfer-request";
import MedicalRecords from "@/components/medical-record";
import { Card } from "@/components/ui/card";
import { Contract } from "ethers";

interface DashboardProps {
  userRole: string | null;
  contract: Contract | null;
  account: string | null;
}

const Dashboard = ({ userRole, contract, account }: DashboardProps) => {
  return (
    <section>
      <Card className="mb-8 flex-row justify-between items-center px-3">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Welcome, {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Guest"}
        </h3>
        <div className="flex justify-center items-center gap-3">
          <span className="text-lg font-medium truncate max-w-[200px] md:max-w-none">
            {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "N/A"}
          </span>
          <CopyButton text={account || ""} />
        </div>
      </Card>
      {/* Owner Dashboard */}
      {userRole === "owner" && contract && (
        <div className="space-y-8">
          <EventLogs contract={contract} />
          <ManageDoctors contract={contract} />
          <ManagePatients contract={contract} />
        </div>
      )}

      {/* Doctor Dashboard */}
      {userRole === "doctor" && account && (
        <div className="space-y-8">
          <ManageDoctorPatients contract={contract} account={account} />
        </div>
      )}

      {/* Patient Dashboard */}
      {userRole === "patient" && account && (
        <div className="space-y-8">
          <MedicalRecords contract={contract} patientAddress={account} />
          <ManageRecordAccess contract={contract} patientAddress={account} />
          <ManageTransferRequests contract={contract} />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
