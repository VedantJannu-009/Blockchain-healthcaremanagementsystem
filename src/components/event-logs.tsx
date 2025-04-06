import { Contract, Event } from "ethers";
import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { RefreshCw } from "lucide-react";

interface ContractProps {
  contract: Contract;
}

const EventLogs = ({ contract }: ContractProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const seenEvents = useRef<Set<string>>(new Set());

  const addLog = (message: string, eventId: string) => {
    if (!seenEvents.current.has(eventId)) {
      seenEvents.current.add(eventId);
      setLogs((prevLogs) => [...prevLogs, message]);
    }
  };

  const fetchPastEvents = async () => {
    try {
      const eventsToQuery = [
        "PatientRegistered",
        "DoctorRegistered",
        "RecordAdded",
        "TransferRequested",
        "TransferApproved",
        "TransferRejected",
        "RecordShared",
        "AccessRevoked",
        "DoctorActivated",
        "DoctorDeactivated",
      ];

      for (const eventName of eventsToQuery) {
        const pastEvents: Event[] = await contract.queryFilter(
          contract.filters[eventName]()
        );

        pastEvents.forEach((event) => {
          const { args, transactionHash, logIndex } = event;
          if (!args) return;
          const eventId = `${transactionHash}-${logIndex}`;

          switch (eventName) {
            case "PatientRegistered":
              addLog(`👤 Patient Registered: ${args[1]} (${args[0]})`, eventId);
              break;
            case "DoctorRegistered":
              addLog(`🩺 Doctor Registered: ${args[1]} (${args[0]})`, eventId);
              break;
            case "RecordAdded":
              addLog(
                `📑 Record Added - Patient: ${args[0]}, Doctor: ${
                  args[1]
                }, Record ID: ${args[2].toString()}`,
                eventId
              );
              break;
            case "TransferRequested":
              addLog(
                `🔄 Transfer Requested - ReqID: ${args[0].toString()}, Patient: ${
                  args[1]
                }, From: ${args[2]}, To: ${args[3]}`,
                eventId
              );
              break;
            case "TransferApproved":
              addLog(
                `✅ Transfer Approved - ReqID: ${args[0].toString()}, Patient: ${
                  args[1]
                }, From: ${args[2]}, To: ${args[3]}`,
                eventId
              );
              break;
            case "TransferRejected":
              addLog(
                `❌ Transfer Rejected - ReqID: ${args[0].toString()}, Patient: ${
                  args[1]
                }, From: ${args[2]}, To: ${args[3]}, Reason: ${args[4]}`,
                eventId
              );
              break;
            case "RecordShared":
              addLog(
                `🔓 Record Shared - Patient: ${args[0]}, Doctor: ${args[1]}`,
                eventId
              );
              break;
            case "AccessRevoked":
              addLog(
                `🔒 Access Revoked - Patient: ${args[0]}, Doctor: ${args[1]}`,
                eventId
              );
              break;
            case "DoctorActivated":
              addLog(`✅ Doctor Activated: ${args[0]}`, eventId);
              break;
            case "DoctorDeactivated":
              addLog(`❌ Doctor Deactivated: ${args[0]}`, eventId);
              break;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching past events:", error);
    }
  };

  useEffect(() => {
    fetchPastEvents();

    const subscribe = () => {
      contract.on("*", (...args) => {
        const event = args[args.length - 1];
        const { event: eventName, transactionHash, logIndex } = event;
        const eventId = `${transactionHash}-${logIndex}`;

        const logFromArgs = (message: string) => addLog(message, eventId);

        switch (eventName) {
          case "PatientRegistered":
            logFromArgs(`👤 Patient Registered: ${args[1]} (${args[0]})`);
            break;
          case "DoctorRegistered":
            logFromArgs(`🩺 Doctor Registered: ${args[1]} (${args[0]})`);
            break;
          case "RecordAdded":
            logFromArgs(
              `📑 Record Added - Patient: ${args[0]}, Doctor: ${
                args[1]
              }, Record ID: ${args[2].toString()}`
            );
            break;
          case "TransferRequested":
            logFromArgs(
              `🔄 Transfer Requested - ReqID: ${args[0].toString()}, Patient: ${
                args[1]
              }, From: ${args[2]}, To: ${args[3]}`
            );
            break;
          case "TransferApproved":
            logFromArgs(
              `✅ Transfer Approved - ReqID: ${args[0].toString()}, Patient: ${
                args[1]
              }, From: ${args[2]}, To: ${args[3]}`
            );
            break;
          case "TransferRejected":
            logFromArgs(
              `❌ Transfer Rejected - ReqID: ${args[0].toString()}, Patient: ${
                args[1]
              }, From: ${args[2]}, To: ${args[3]}, Reason: ${args[4]}`
            );
            break;
          case "RecordShared":
            logFromArgs(
              `🔓 Record Shared - Patient: ${args[0]}, Doctor: ${args[1]}`
            );
            break;
          case "AccessRevoked":
            logFromArgs(
              `🔒 Access Revoked - Patient: ${args[0]}, Doctor: ${args[1]}`
            );
            break;
          case "DoctorActivated":
            logFromArgs(`✅ Doctor Activated: ${args[0]}`);
            break;
          case "DoctorDeactivated":
            logFromArgs(`❌ Doctor Deactivated: ${args[0]}`);
            break;
        }
      });
    };

    subscribe();

    return () => {
      contract.removeAllListeners();
    };
  }, [contract]);

  const filteredLogs = logs.filter((log) =>
    log.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">📜 Event Logs</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            seenEvents.current.clear();
            setLogs([]);
            fetchPastEvents();
          }}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <Input
        placeholder="Search logs..."
        className="mb-3 text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ScrollArea className="space-y-2 h-[300px] pr-4">
        {filteredLogs.length > 0 ? (
          filteredLogs
            .slice()
            .reverse()
            .map((log, index) => (
              <Card key={index} className="bg-gray-800 border-none mb-1">
                <CardContent className="text-sm">{log}</CardContent>
              </Card>
            ))
        ) : (
          <p className="text-gray-400">No matching logs...</p>
        )}
      </ScrollArea>
    </div>
  );
};

export default EventLogs;
