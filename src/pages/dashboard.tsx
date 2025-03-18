import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

const Dashboard = ({ userRole, account }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };
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
          <Button onClick={copyToClipboard} variant="outline" size="icon">
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default Dashboard;
