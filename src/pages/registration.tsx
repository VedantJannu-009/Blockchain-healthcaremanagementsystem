import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { patientSchema } from "@/lib/constants";
import { Patient } from "@/lib/types";

interface RegistrationProps {
  registerAsPatient: (values: Patient) => void;
}

const Registration = ({ registerAsPatient }: RegistrationProps) => {
  const form = useForm<Patient>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientName: "",
      patientAge: 0,
      patientAddress: "",
    },
  });

  function onSubmit(values: Patient) {
    registerAsPatient(values);
    console.log(values);
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">Patient Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Complete Registration
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Registration;
