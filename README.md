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
<img width="910" height="596" alt="image" src="https://github.com/user-attachments/assets/621a3ece-79a5-49fc-b103-dfc79eaf58b5" />


**Doctor View — Shared Patients**
<img width="931" height="495" alt="image" src="https://github.com/user-attachments/assets/b4661ad9-4aad-4f25-bb1b-b3c70459fda5" />


**Patient View — Medical Records & Authorized Doctors**
<img width="969" height="514" alt="image" src="https://github.com/user-attachments/assets/eda2ad88-3925-4289-a4ce-a8af4b87bea2" />

**Doctor View — Patient Details Panel**
<img width="1012" height="538" alt="image" src="https://github.com/user-attachments/assets/974e3995-346d-4f6f-9002-f0615c90f230" />


**Requesting a Record Transfer to Another Doctor**
<img width="1012" height="538" alt="image" src="https://github.com/user-attachments/assets/400fca27-cc94-4a68-af8d-63fe278efeb5" />


**Patient Reviewing a Transfer Request**
<img width="1023" height="543" alt="image" src="https://github.com/user-attachments/assets/2b033710-7d38-487e-ad32-8bfec8f3da41" />


## License

MIT
