import { Button } from "@/components/ui/button";

interface ConnectProps {
  connectWallet: () => void;
}

const Connect = ({ connectWallet }: ConnectProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Healthcare Management System</h1>
      <Button
        onClick={connectWallet}
        className="font-bold py-2 px-6 rounded-lg transition duration-300"
      >
        Connect Wallet
      </Button>
    </div>
  );
};

export default Connect;
