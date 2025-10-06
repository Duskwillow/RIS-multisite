import React, { useState, useEffect, use } from "react";
import { Button } from "@material-tailwind/react";
import ActSelectionModal from "./ActSelectionModal";
import { useAuthStore } from "../services/authStore";
import axios from "axios";
import { Value } from "@radix-ui/react-select";

interface ActRow {
  act?: Act;
  injection: string;
  modality: string;
  date: string;
  hour: string;
  room: string;
  doctor: string;
  technician: string;
  dose: string;
}

interface Patient {
  id: number;
  encounterId: number;
  nomEtPrenom: string;
  dateDeNee: string;
  regimeDePEC: string;
  nCarnet: string;
  Matricule: string;
  Telephone?: string;
  N_Soins?: string;
  Etat?: string;
  Sexe?: "Homme" | "Femme";
}

interface ActsTableProps {
  patientData: Patient | null;
  onRowsChange?: (rows: ActRow[]) => void;
}

const ActsTable: React.FC<ActsTableProps> = ({ patientData, onRowsChange }) => {
  const { token } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  console.log("User in ActsTable:", user);
  const [rows, setRows] = useState<ActRow[]>([
    {
      injection: "",
      modality: "",
      date: "",
      hour: "",
      room: "",
      doctor: "",
      technician: "",
      dose: "",
    },
  ]);
  const [modalRowIndex, setModalRowIndex] = useState<number | null>(null);

  const handleRowChange = (index: number, field: keyof ActRow, value: any) => {
    const updatedRows = [...rows];
    (updatedRows[index] as any)[field] = value;
    setRows(updatedRows);
    onRowsChange?.(updatedRows);
  };

  const handleSelectAct = (act: Act, index: number) => {
    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString();
    const reverseDate = currentDate.split("/").reverse().join("-");

    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      act: act,
      doctor: user?.nom_prenom || user?.username || "Médecin",
      date: reverseDate,
      hour: currentTime,
    };
    setRows(updatedRows);
  };

  const sendToWorklist = async (row: ActRow) => {
    if (!patientData) return alert("Select patient first");

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        "http://localhost:3001/orders",
        {
          patient: patientData,

          radiologue: {
            id: user?.userId,
            nom: user?.nom_prenom?.split(" ")[0] || user?.username,
            prenom: user?.nom_prenom?.split(" ")[1] || "",
          },
          acts: [
            {
              code: row.act?.code,
              name: row.act?.name,
              modality: row.modality,
              date: row.date,
              hour: row.hour,
              room: row.room,
              doctor: row.doctor,
              technician: row.technician,
              dose: row.dose,
            },
          ],
        },
        { headers }
      );
      alert("✅ Order sent to DCM4CHEE Worklist via HL7");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send order");
    }
  };

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Actes Médicaux
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Code",
                "Libelle Acte",
                "Injection",
                "Modalité",
                "Date",
                "Heure",
                "Salle",
                "Médecin",
                "Technicien",
                "mGy/cm",
                "Action",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                {/* Code Column as Button */}
                <td className="px-4 py-2">
                  <button
                    size="sm"
                    className={`w-full ${
                      row.act ? "bg-green-500" : "bg-blue-500"
                    } text-white rounded px-2 py-1 text-sm`}
                    onClick={() => setModalRowIndex(idx)}
                  >
                    {row.act?.code || "Choisir"}
                  </button>
                </td>

                {/* Libelle Acte */}
                <td className="px-4 py-2">{row.act?.name || ""}</td>

                {[
                  "injection",
                  "modality",
                  "date",
                  "hour",
                  "room",
                  "doctor",
                  "technician",
                  "dose",
                ].map((field) => (
                  <td key={field} className="px-4 py-2">
                    <input
                      type={field === "date" ? "date" : "text"}
                      className="border rounded px-2 py-1 text-sm w-fit"
                      value={(row as any)[field]}
                      onChange={(e) =>
                        handleRowChange(
                          idx,
                          field as keyof ActRow,
                          e.target.value
                        )
                      }
                      readOnly={["date", "hour", "doctor"].includes(field)}
                    />
                  </td>
                ))}

                {/* Worklist button */}
                <td className="px-4 py-2">
                  <Button
                    color="blue"
                    size="sm"
                    className="w-full"
                    onClick={() => sendToWorklist(row)}
                  >
                    Worklist
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalRowIndex !== null && (
        <ActSelectionModal
          isOpen={modalRowIndex !== null}
          onClose={() => setModalRowIndex(null)}
          acts={[]}
          onSelect={(act) => handleSelectAct(act, modalRowIndex)}
        />
      )}
    </div>
  );
};

export default ActsTable;
