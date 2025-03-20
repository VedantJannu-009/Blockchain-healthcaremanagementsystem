import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../dataTableColumnHeader";
import { Doctor } from "@/lib/types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import CopyButton from "../copyButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ColumnProps {
  doctorAction: (isActive: boolean, doctorAddress: string) => void;
  viewDoctorDetails: (doctorAddress: string) => void;
}

export const columns = ({
  doctorAction,
  viewDoctorDetails,
}: ColumnProps): ColumnDef<Doctor>[] => [
  {
    accessorKey: "doctorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "doctorSpecialization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialization" />
    ),
  },
  {
    accessorKey: "doctorAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const doctorDetails = row.original;
      return (
        <div className="flex gap-2 items-center">
          <span>{doctorDetails.doctorAddress}</span>
          <CopyButton text={doctorDetails.doctorAddress} />
        </div>
      );
    },
  },
  {
    id: "status",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const doctorDetails = row.original;
      return (
        <Badge
          className={
            doctorDetails.isActive
              ? "bg-green-500 text-green-100"
              : "bg-red-500 text-red-100"
          }
        >
          {doctorDetails.isActive ? "Active" : "Inactive"}
        </Badge>
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
      const doctorDetails = row.original;
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
              onClick={() => viewDoctorDetails(doctorDetails.doctorAddress)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                doctorAction(
                  doctorDetails.isActive,
                  doctorDetails.doctorAddress
                )
              }
              className={`text-xs rounded transition  ${
                doctorDetails.isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {doctorDetails.isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
