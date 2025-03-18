import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ArrowLeftRight, Wallet } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { MetaMaskIcon } from "@/assets";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";

interface HeaderProps {
  account: string | null;
  accounts: string[];
  onConnectWallet: () => void;
  onSwitchAccount: (account: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  account,
  accounts,
  onConnectWallet,
  onSwitchAccount,
}) => {
  return (
    <Card className="flex justify-between items-center p-4 flex-row">
      <h1 className="text-xl font-bold dark:text-white">Web3 App</h1>
      <div className="flex items-center gap-4">
        {account ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Avatar className="size-5">
                  <AvatarImage src={MetaMaskIcon} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>
                  {account.substring(0, 6)}...
                  {account.substring(account.length - 4)}
                </span>
                <ArrowLeftRight />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {accounts.map((acc, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => onSwitchAccount(acc)}
                >
                  Account {index + 1}: {acc.substring(0, 6)}...
                  {acc.substring(acc.length - 4)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={onConnectWallet}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Wallet size={16} /> Connect Wallet
          </Button>
        )}
        <ModeToggle />
      </div>
    </Card>
  );
};

export default Header;
