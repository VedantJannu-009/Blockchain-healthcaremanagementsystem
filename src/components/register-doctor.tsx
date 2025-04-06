import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { doctorSchema, specializations } from "@/lib/constants";
import { Doctor } from "@/lib/types";
import DialogDrawer from "./dialog-drawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

interface RegisterDoctorProps {
  registerAsDoctor: (values: Doctor) => void;
}

const RegisterDoctor = ({ registerAsDoctor }: RegisterDoctorProps) => {
  const form = useForm<Doctor>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      doctorAddress: "",
      doctorName: "",
      doctorSpecialization: "",
      isActive: true,
    },
  });

  function onSubmit(values: Doctor) {
    registerAsDoctor(values);
    console.log(values);
  }

  return (
    <DialogDrawer
      buttonText={"Add doctor"}
      headerText={"Add Doctor Details"}
      dsecription={"Fill in the details to register a doctor"}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Doctor Address */}
          <FormField
            control={form.control}
            name="doctorAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter wallet address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Doctor Name */}
          <FormField
            control={form.control}
            name="doctorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter doctor's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Doctor Specialization */}
          <FormField
            control={form.control}
            name="doctorSpecialization"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Specialization</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? specializations.find(
                              (specialization) =>
                                specialization.value === field.value
                            )?.label
                          : "Select specialization"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search specialization..." />
                      <CommandList>
                        <CommandEmpty>No specializations found.</CommandEmpty>
                        <CommandGroup>
                          {specializations.map((specialization) => (
                            <CommandItem
                              value={specialization.label}
                              key={specialization.value}
                              onSelect={() => {
                                form.setValue(
                                  "doctorSpecialization",
                                  specialization.value
                                );
                              }}
                            >
                              {specialization.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  specialization.value === field.value
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register Doctor
          </Button>
        </form>
      </Form>
    </DialogDrawer>
  );
};

export default RegisterDoctor;
