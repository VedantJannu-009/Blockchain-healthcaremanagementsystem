import CopyButton from "@/components/copy-button";
import EventLogs from "@/components/event-logs";
import ManageDoctorPatients from "@/components/manage-doctor-patients/manage-doctor-patients";
import ManageDoctors from "@/components/manage-doctors/manage-doctors";
import ManagePatients from "@/components/manage-patients/manage-patients";
import ManageRecordAccess from "@/components/manage-records/manage-record-access";
import ManageTransferRequests from "@/components/manage-transfer-request/manage-transfer-request";
import MedicalRecords from "@/components/medical-record";
import { ModeToggle } from "@/components/mode-toggle";
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
      {/* Owner Dashboard */}
      {userRole === "owner" && contract && (
        <div className="space-y-8 p-4">
          <EventLogs contract={contract} />
          <ManageDoctors contract={contract} />
          <ManagePatients contract={contract} />
        </div>
      )}

      {/* Doctor Dashboard */}
      {userRole === "doctor" && account && (
        <div className="space-y-8 p-4">
          <ManageDoctorPatients contract={contract} account={account} />
        </div>
      )}

      {/* Patient Dashboard */}
      {userRole === "patient" && account && (
        <div className="space-y-8 p-4">
          <MedicalRecords contract={contract} patientAddress={account} />
          <ManageRecordAccess contract={contract} patientAddress={account} />
          <ManageTransferRequests contract={contract} />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
