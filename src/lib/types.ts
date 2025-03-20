import { z } from "zod";
import { doctorSchema, patientSchema } from "./constants";

export type Doctor = z.infer<typeof doctorSchema>;
export type Patient = z.infer<typeof patientSchema>;
