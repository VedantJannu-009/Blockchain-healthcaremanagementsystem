import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Patient } from "@/lib/types";
import CopyButton from "../copy-button";

interface ColumnProps {
  viewPatientDetails: (patientAddress: string) => void;   
}
export const columns = ({
  viewPatientDetails,
}: ColumnProps): ColumnDef<Patient>[] => [
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "patientAge",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: "patientAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const patientDetails = row.original;
      return (
        <div className="flex gap-2 items-center">
          <span>{patientDetails.patientAddress}</span>
          <CopyButton text={patientDetails.patientAddress} />
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
      const patientDetails = row.original;
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
              onClick={() => viewPatientDetails(patientDetails.patientAddress)}
            >
              View details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
