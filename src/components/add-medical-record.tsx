import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recordSchema } from "@/lib/constants";
import { Record } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Contract } from "ethers";
import { Textarea } from "./ui/textarea";

interface AddMedicalRecordProps {
  contract: Contract | null;
  doctorAddress: string;
  addMedicalRecord: (data: Record) => void;
}

const AddMedicalRecord = ({
  doctorAddress,
  addMedicalRecord,
}: AddMedicalRecordProps) => {
  const form = useForm<Record>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      recordID: "",
      timestamp: new Date().toISOString(),
      diagnosedBy: doctorAddress,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => addMedicalRecord(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="disease"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disease</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Caries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Advanced Decay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Treatment</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Tooth Filling" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add Record
        </Button>
      </form>
    </Form>
  );
};

export default AddMedicalRecord;
