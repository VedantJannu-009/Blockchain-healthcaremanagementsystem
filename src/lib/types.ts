import { z } from "zod";
import {
  doctorSchema,
  patientSchema,
  recordSchema,
  shareRecordSchema,
  transferRequestSchema,
} from "./constants";

export type Doctor = z.infer<typeof doctorSchema>;
export type Patient = z.infer<typeof patientSchema>;
export type Record = z.infer<typeof recordSchema>;
export type ShareRecordType = z.infer<typeof shareRecordSchema>;
export type TransferRequest = z.infer<typeof transferRequestSchema>;
