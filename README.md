# Decentralized Healthcare Records Management System

A blockchain-based platform for managing patient medical records with 
patient-controlled, permissioned access. Patients decide which doctors can 
view their records, and doctors can request transfer of a patient's history 
to another doctor — with the patient approving or rejecting each request.

🔗 **Live Demo:** [healthcaremanagementsystem.vercel.app](https://healthcaremanagementsystem.vercel.app)

## Features

- **Role-based dashboards** — separate views for Owner (admin), Doctor, and Patient
- **Wallet-based identity** — MetaMask connection for authentication, no passwords
- **Patient registration** — Owner registers patients and doctors on-chain, with all actions logged in an event log
- **Doctor management** — Owner adds doctors with name, specialization, and wallet address
- **Medical records** — Doctors add records (condition, treatment, diagnosis) tied to a patient's on-chain identity
- **Authorized doctor management** — Patients control which doctors have active access to their records, and can share records with new doctors
- **Record transfer requests** — A doctor can request that a patient's record access be transferred to another doctor; the patient reviews and approves or rejects each request, with a visible countdown before the request expires

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Blockchain:** Solidity smart contracts, Ethers.js
- **Wallet:** MetaMask
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js (v18+)
- MetaMask browser extension
- A wallet with test ETH on your target network (e.g. Sepolia)

### Setup

```bash
git clone https://github.com/VedantJannu-009/Blockchain-healthcaremanagementsystem.git
cd Blockchain-healthcaremanagementsystem
npm install
```

Create a `.env` file in the project root with your contract address and network config:

```
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_NETWORK_RPC_URL=your_rpc_url
```

Run the development server:

```bash
npm run dev
```

Open the app in your browser, connect MetaMask, and you're in.

### Smart Contract

If you're deploying the contract yourself rather than using an existing deployment, compile and deploy it with your preferred toolchain (Hardhat/Foundry), then update `VITE_CONTRACT_ADDRESS` above with the deployed address.

## Screenshots

**Owner Dashboard** — event log, doctor management, and patient management in one place
![Owner dashboard](./screenshots/01-owner-dashboard.png)

**Doctor View — Shared Patients**
![Doctor shared patients view](./screenshots/02-doctor-shared-patients.png)

**Patient View — Medical Records & Authorized Doctors**
![Patient medical records](./screenshots/03-patient-medical-records.png)

**Doctor View — Patient Details Panel**
![Patient details panel](./screenshots/04-patient-details-panel.png)

**Requesting a Record Transfer to Another Doctor**
![Request transfer record](./screenshots/05-request-transfer-record.png)

**Patient Reviewing a Transfer Request**
![Manage transfer requests](./screenshots/06-manage-transfer-requests.png)

## License

MIT
