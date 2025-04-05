import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Doctor } from "@/lib/types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ColumnProps {
  approveTransferRequest: (requestId: string) => void;
  rejectTransferRequest: (requestId: string) => void;
}

export const columns = ({
  approveTransferRequest,
  rejectTransferRequest,
}: ColumnProps): ColumnDef<Doctor>[] => [
  {
    accessorKey: "fromDoctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From Doctor" />
    ),
  },
  {
    accessorKey: "toDoctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To Doctor" />
    ),
  },
  {
    accessorKey: "expiryTimestamp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expired by" />
    ),
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
            <DropdownMenuItem
              onClick={() => approveTransferRequest(requestDetails.requestId)}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => rejectTransferRequest(requestDetails.requestId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
