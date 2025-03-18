import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { specializations } from "@/lib/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface RegisterDoctorProps {
  registerAsDoctor: (values: {
    doctorAddress: string;
    doctorName: string;
    doctorSpecialization: string;
  }) => void;
}

const RegisterDoctor = ({ registerAsDoctor }: RegisterDoctorProps) => {
  const formSchema = z.object({
    doctorAddress: z
      .string()
      .min(10, "Invalid address")
      .max(42, "Invalid address"),
    doctorName: z
      .string()
      .min(2, "Name is too short")
      .max(50, "Name is too long"),
    doctorSpecialization: z.string().min(1, "Select a specialization"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorAddress: "",
      doctorName: "",
      doctorSpecialization: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerAsDoctor(values);
    console.log(values);
  }

  return (
    <Card className="max-w-lg mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Register New Doctor</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RegisterDoctor;
