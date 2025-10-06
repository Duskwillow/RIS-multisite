import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Eye, Search } from "lucide-react";

// Mock data
const patientsData = [
  {
    id: 1,
    nom_prenom: "Ahmed Ben Ali",
    date_naissance: "1980-05-12",
    regime_pec: "CNAM",
    n_carnet: "123456",
    matricule: "TN0001",
  },
  {
    id: 2,
    nom_prenom: "Fatma Trabelsi",
    date_naissance: "1990-08-20",
    regime_pec: "CNSS",
    n_carnet: "654321",
    matricule: "TN0002",
  },
  {
    id: 3,
    nom_prenom: "Mohamed Gharbi",
    date_naissance: "1985-03-03",
    regime_pec: "RI",
    n_carnet: "112233",
    matricule: "TN0003",
  },
];

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter patients by search term
  const filteredPatients = patientsData.filter(
    (patient) =>
      patient.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.n_carnet.includes(searchTerm)
  );

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Liste des Patients</h3>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, matricule ou carnet..."
          className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
          Réinitialiser
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom et Prénom</TableHead>
              <TableHead>Date de naissance</TableHead>
              <TableHead>Régime de PEC</TableHead>
              <TableHead>N° Carnet</TableHead>
              <TableHead>Matricule</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.nom_prenom}</TableCell>
                <TableCell>{patient.date_naissance}</TableCell>
                <TableCell>{patient.regime_pec}</TableCell>
                <TableCell>{patient.n_carnet}</TableCell>
                <TableCell>{patient.matricule}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPatients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center p-4 text-gray-500"
                >
                  Aucun patient trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Patients;
