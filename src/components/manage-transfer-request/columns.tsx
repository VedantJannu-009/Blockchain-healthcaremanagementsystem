import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { TransferRequest } from "@/lib/types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface ColumnProps {
  approveTransferRequest: (requestId: string) => void;
  rejectTransferRequest: (requestId: string) => void;
}

export const columns = ({
  approveTransferRequest,
  rejectTransferRequest,
}: ColumnProps): ColumnDef<TransferRequest>[] => [
  {
    accessorKey: "fromDoctorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From Doctor" />
    ),
    cell: ({ row }) => {
      const { fromDoctorName, fromDoctorSpecialization } = row.original;
      return (
        <div>
          <div className="font-medium">{fromDoctorName}</div>
          <div className="text-sm text-muted-foreground">
            {fromDoctorSpecialization}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "toDoctorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To Doctor" />
    ),
    cell: ({ row }) => {
      const { toDoctorName, toDoctorSpecialization } = row.original;
      return (
        <div>
          <div className="font-medium">{toDoctorName}</div>
          <div className="text-sm text-muted-foreground">
            {toDoctorSpecialization}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "expiryTimestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Left" />
    ),
    cell: ({ row }) => {
      const expiry = new Date(row.original.expiryTimestamp).getTime();
      const [timeLeft, setTimeLeft] = useState<number>(expiry - Date.now());

      useEffect(() => {
        let isMounted = true;

        const interval = setInterval(() => {
          const remaining = expiry - Date.now();
          if (isMounted) setTimeLeft(remaining);
        }, 1000);

        return () => {
          isMounted = false;
          clearInterval(interval);
        };
      }, [expiry]);

      if (timeLeft <= 0) {
        return <span className="text-red-500 font-semibold">Expired</span>;
      }

      const seconds = Math.floor((timeLeft / 1000) % 60);
      const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
      const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

      const formatted = `${
        days > 0 ? `${days}d ` : ""
      }${hours}h ${minutes}m ${seconds}s`;

      let textColor = "text-green-600";
      if (timeLeft < 60 * 60 * 1000) textColor = "text-orange-500"; // < 1 hour
      if (timeLeft < 5 * 60 * 1000) textColor = "text-red-500"; // < 5 minutes

      return <span className={`font-semibold ${textColor}`}>{formatted}</span>;
    },
  },

  {
    accessorKey: "approved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const approved = row.original.approved;
      return (
        <div
          className={`font-semibold ${
            approved ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {approved ? "Approved" : "Pending"}
        </div>
      );
    },
  },
  {
    id: "action",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const requestDetails = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => approveTransferRequest(requestDetails.requestId)}
              className="bg-green-700"
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => rejectTransferRequest(requestDetails.requestId)}
              className="bg-red-700"
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
