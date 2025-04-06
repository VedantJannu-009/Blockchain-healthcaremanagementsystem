import { z } from "zod";

export const contractAddress = "0xb819c23c807e24b2e7a51cd490733833eb640bab"; // Replace with your contract address
export const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "AccessRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "DoctorActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "DoctorDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "DoctorRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "PatientRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
    ],
    name: "RecordAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "patient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "doctor",
        type: "address",
      },
    ],
    name: "RecordShared",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDoctor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDoctor",
        type: "address",
      },
    ],
    name: "TransferApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDoctor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDoctor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "TransferRejected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDoctor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDoctor",
        type: "address",
      },
    ],
    name: "TransferRequested",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "activateDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "disease",
        type: "string",
      },
      {
        internalType: "string",
        name: "diagnosis",
        type: "string",
      },
      {
        internalType: "string",
        name: "treatment",
        type: "string",
      },
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
    ],
    name: "approveTransferByPatient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cleanExpiredRequests",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "deactivateDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDoctors",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "bool[]",
        name: "",
        type: "bool[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPatients",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
    ],
    name: "getAuthorizedDoctorsForPatient",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "getDoctorInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
    ],
    name: "getPatientInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
    ],
    name: "getRecordsForPatient",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "recordID",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "disease",
            type: "string",
          },
          {
            internalType: "string",
            name: "diagnosis",
            type: "string",
          },
          {
            internalType: "string",
            name: "treatment",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "diagnosedBy",
            type: "address",
          },
        ],
        internalType: "struct HealthcareRecords.Record[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTransferRequestsForPatient",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "requestId",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "patientAddress",
                type: "address",
              },
              {
                internalType: "address",
                name: "fromDoctor",
                type: "address",
              },
              {
                internalType: "address",
                name: "toDoctor",
                type: "address",
              },
              {
                internalType: "bool",
                name: "approved",
                type: "bool",
              },
              {
                internalType: "uint256",
                name: "expiryTimestamp",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "rejectionReason",
                type: "string",
              },
            ],
            internalType: "struct HealthcareRecords.TransferRequest",
            name: "request",
            type: "tuple",
          },
        ],
        internalType: "struct HealthcareRecords.TransferRequestWithId[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "hasAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "specialization",
        type: "string",
      },
    ],
    name: "registerDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "age",
        type: "uint256",
      },
    ],
    name: "registerPatient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "rejectTransferByPatient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "patientAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "toDoctor",
        type: "address",
      },
    ],
    name: "requestTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "revokeShareAccessFromDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "doctorAddress",
        type: "address",
      },
    ],
    name: "shareRecordsWithDoctor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const specializations = [
  { label: "Cardiology", value: "cardiology" },
  { label: "Neurology", value: "neurology" },
  { label: "Pediatrics", value: "pediatrics" },
  { label: "Orthopedics", value: "orthopedics" },
  { label: "Dermatology", value: "dermatology" },
  { label: "Oncology", value: "oncology" },
  { label: "Gynecology", value: "gynecology" },
  { label: "Psychiatry", value: "psychiatry" },
  { label: "Endocrinology", value: "endocrinology" },
  { label: "Gastroenterology", value: "gastroenterology" },
] as const;

export const doctorSchema = z.object({
  doctorAddress: z.string().refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
    message: "Invalid Ethereum address",
  }),
  doctorName: z
    .string()
    .min(2, "Name is too short")
    .max(50, "Name is too long"),
  doctorSpecialization: z.string().min(1, "Select a specialization"),
  isActive: z.boolean(),
});

export const patientSchema = z.object({
  patientAddress: z
    .string()
    .refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
      message: "Invalid Ethereum address",
    }),
  patientName: z
    .string()
    .min(2, "Name is too short")
    .max(50, "Name is too long"),
  patientAge: z.coerce.number().min(1, "Invalid age").max(120, "Invalid age"),
});

export const recordSchema = z.object({
  recordID: z.string(),
  disease: z.string(),
  diagnosis: z.string(),
  treatment: z.string(),
  timestamp: z.string(),
  diagnosedBy: z.string().refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
    message: "Invalid Ethereum address",
  }),
});

export const shareRecordSchema = z.object({
  doctorAddress: z.string().refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
    message: "Invalid Ethereum address",
  }),
});

export const transferRequestSchema = z.object({
  requestId: z.string(),
  patientAddress: z
    .string()
    .refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
      message: "Invalid Ethereum address",
    }),
  fromDoctor: z.string().refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
    message: "Invalid Ethereum address",
  }),
  fromDoctorName: z.string(),
  fromDoctorSpecialization: z.string(),
  toDoctor: z.string().refine((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr), {
    message: "Invalid Ethereum address",
  }),
  toDoctorName: z.string(),
  toDoctorSpecialization: z.string(),
  approved: z.boolean(),
  expiryTimestamp: z.string(),
  rejectionReason: z.string().optional(),
});
