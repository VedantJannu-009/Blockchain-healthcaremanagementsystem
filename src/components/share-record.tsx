import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, CircleCheck, CircleX } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Contract } from "ethers";
import { shareRecordSchema } from "@/lib/constants";
import { Doctor, ShareRecordType } from "@/lib/types";

interface ShareRecordProps {
  contract: Contract | null;
  shareRecords: (data: ShareRecordType) => void;
}

const ShareRecord = ({ contract, shareRecords }: ShareRecordProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<ShareRecordType>({
    resolver: zodResolver(shareRecordSchema),
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!contract) throw new Error("Contract not initialized");

        setLoading(true);
        const [addresses, names, specializations, isActiveArray] =
          await contract.getAllDoctors();
        const doctorList = addresses.map((address: string, index: number) => ({
          doctorAddress: address,
          doctorName: names[index] || "Unknown",
          doctorSpecialization: specializations[index] || "Not Provided",
          isActive: isActiveArray[index],
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [contract]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => shareRecords(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="doctorAddress"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Doctor</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? doctors.find(
                            (doctor) => doctor.doctorAddress === field.value
                          )?.doctorName
                        : "Select a doctor"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search doctor..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No doctor found.</CommandEmpty>
                      <CommandGroup>
                        {doctors.map((doctor) => (
                          <CommandItem
                            value={doctor.doctorAddress}
                            key={doctor.doctorAddress}
                            onSelect={() => {
                              form.setValue(
                                "doctorAddress",
                                doctor.doctorAddress
                              );
                            }}
                          >
                            {doctor.isActive ? (
                              <CircleCheck className="size-4 text-green-500" />
                            ) : (
                              <CircleX className="size-4 text-red-500" />
                            )}
                            {doctor.doctorName} ({doctor.doctorSpecialization})
                            <Check
                              className={cn(
                                "ml-auto",
                                doctor.doctorAddress === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a doctor to grant access to your medical records.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "sharing..." : "Share record"}
        </Button>
      </form>
    </Form>
  );
};

export default ShareRecord;
