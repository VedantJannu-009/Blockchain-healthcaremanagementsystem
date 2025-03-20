import CopyButton from "@/components/copyButton";
import { Card } from "@/components/ui/card";

interface DashboardProps {
  userRole: string;
  account: string;
}

const Dashboard = ({ userRole, account }: DashboardProps) => {
  return (
    <section>
      <Card className="mb-8 flex-row justify-between items-center px-3">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Welcome, {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </h3>
        <div className="flex justify-center items-center gap-3">
          <span className="text-lg font-medium truncate max-w-[200px] md:max-w-none">
            {account.substring(0, 6)}...{account.substring(account.length - 4)}
          </span>
          <CopyButton text={account} />
        </div>
      </Card>
    </section>
  );
};

export default Dashboard;
