import { Button } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../services/authStore";
import axios from "axios";
import ActsTable from "../../components/Act";
import Patients from "../Patients/Patients";

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
interface Renseignement {
  Remarque: string;
  Renseignement: string;
}

const Saisie: React.FC = () => {
  const [selectedProvenance, setSelectedProvenance] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [RenseignementClinique, setRenseignementClinique] = useState<
    Renseignement[]
  >([
    {
      Remarque: "",
      Renseignement: "",
    },
  ]);
  const [isComunication, setIsComunication] = useState(false);
  const [remarque, setRemarque] = useState("");
  const [acts, setActs] = useState<any[]>([]);
  const [selectedEncounterId, setSelectedEncounterId] = useState<number | null>(
    null
  );
  const [sending, setSending] = useState(false);
  const { token } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  console.log(RenseignementClinique);

  // console.log("patients data", patients);

  const buildOrderPayload = () => {
    if (!selectedPatient) {
      alert("Sélectionner un patient");
      return null;
    }
    //i add this:
    const items = acts.map((a: any) => ({
      modality: a.modality,
      body_part: a.body_part,
    }));
    if (!items.length) {
      alert("ajouez auu mois un act.");
      return null;
    }

    return {
      patient_id: selectedPatient.id,
      encounter_id: selectedEncounterId,
      items,
      //dont touch it
      radiologue: {
        id: user?.userId,
        nom_prenom: user?.nom_prenom || user?.username,
      },
      patient: selectedPatient,
      acts: acts,
    };
  };

  const provenanceOptions = [
    { value: "admission", label: "Admission", field: "N. Admission" },
    {
      value: "hospitalisation",
      label: "Hospitalisation",
      field: "N. Hospitalisation",
    },
    {
      value: "consultation",
      label: "Consultation externe",
      field: "N. Consultation",
    },
    { value: "autre", label: "Autre", field: "Référence" },
  ];

  useEffect(() => {
    console.log("Fetching patients for provenance:", selectedProvenance);
    if (selectedProvenance) {
      fetchPatientsByProvenance(selectedProvenance);
    }
  }, [selectedProvenance]);

  const fetchPatientsByProvenance = async (provenance: string) => {
    if (!provenance || provenance === "autre") {
      setPatients([]);
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:3001/patients/by-admission-type?type=${provenance}`,
        { headers }
      );
      console.log("response", response);
      setPatients(
        response.data.map((p: any) => ({
          id: p.id,
          encounterId: p.encounter_id,
          nomEtPrenom: p.nomEtPrenom,
          dateDeNee: p.date_de_nee,
          regimeDePEC: p.regime_de_pec,
          nCarnet: p.n_carnet,
          Matricule: p.matricule,
          Telephone: p.Telephone,
          N_Soins: p.N_Soins,
          Etat: p.Etat,
          Sexe: p.Sexe,
        }))
      );
      console.log("the patient data", patients);
    } catch (error) {
      console.error("Error fetching patients:", error);

      alert(
        "Erreur lors du chargement des patients. Vérifiez votre connexion."
      );
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (query: string) => {
    if (!query.trim()) {
      fetchPatientsByProvenance(selectedProvenance);
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:3001/patients/search?q=${encodeURIComponent(query)}`,
        { headers }
      );
      setPatients(
        response.data.map((p: any) => ({
          id: p.id,
          encounterId: p.encounter_id,
          nomEtPrenom: p.nom_et_prenom,
          dateDeNee: p.date_de_nee,
          regimeDePEC: p.regime_de_pec,
          nCarnet: p.n_carnet,
          Matricule: p.matricule,
          N_Soins: p.N_Soins,
          Telephone: p.Telephone,
        }))
      );
    } catch (error) {
      console.error("Error searching patients:", error);
      alert("Erreur lors de la recherche des patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProvenance) {
      fetchPatientsByProvenance(selectedProvenance);
    }
  }, [selectedProvenance]);

  const handleProvenanceChange = (value: string) => {
    setSelectedProvenance(value);
    setSelectedPatient(null);
    if (value && value !== "autre") {
      setIsModalOpen(true);
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return { years: "", months: "", days: "" };
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  };

  const sendOrder = async () => {
    const payload = buildOrderPayload();
    if (!payload) return;
    try {
      const response = await axios.post(
        "http://localhost:3001/orders",
        payload
      );
      alert("✅ Ordre envoyé avec succès");
      console.log("Order response:", response.data);
    } catch (err: any) {
      console.error(err);
      alert("❌ Erreur lors de l'envoi de l'HL7");
    }
  };

  return (
    <div className="flex-1 w-[100%] p-6">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2">Saisie</h2>
      <p className="text-gray-600 mb-6">
        Veuillez remplir les informations ci-dessous.
      </p>

      {/* First Row */}
      <div className="mb-6">
        <label
          htmlFor="demande"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          N.Demande
        </label>
        <input
          type="text"
          id="demande"
          className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Provenance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provenance
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
            value={selectedProvenance}
            onChange={(e) => handleProvenanceChange(e.target.value)}
          >
            <option value="">Sélectionner la provenance</option>
            {provenanceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Field based on Provenance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            N.Accession
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {/* N.Soins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            N.Soins
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
            value={selectedPatient?.N_Soins || ""}
            onChange={(e) =>
              setSelectedPatient((prev) =>
                prev ? { ...prev, N_Soins: e.target.value } : null
              )
            }
          />
        </div>
      </div>

      {/* Patient Information + Clinical Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Patient Info */}
        <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">
            Informations du Patient
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nom et Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom et Prénom
              </label>
              <input
                type="text"
                value={selectedPatient?.nomEtPrenom || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, nomEtPrenom: e.target.value } : null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Sélectionnez un patient"
                disabled={!!selectedPatient}
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                value={selectedPatient?.dateDeNee || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, dateDeNee: e.target.value } : null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                disabled={!!selectedPatient}
              />
            </div>

            {/* État civil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État civil
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                value={selectedPatient?.Etat || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, Etat: e.target.value } : null
                  )
                }
                disabled={!!selectedPatient}
              >
                <option value="">Sélectionner</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié</option>
                <option value="Divorcé(e)">Divorcé</option>
                <option value="Veuf">Veuf</option>
              </select>
            </div>

            {/* Sexe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexe
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                value={selectedPatient?.Sexe || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, Sexe: e.target.value } : null
                  )
                }
                disabled={!!selectedPatient}
              >
                <option value="">Sélectionner</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Âge
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={
                    selectedPatient
                      ? calculateAge(selectedPatient.dateDeNee).years
                      : ""
                  }
                  readOnly
                  placeholder="Ans"
                  className="rounded-lg border border-gray-300 p-2 text-sm bg-gray-100 text-center"
                  disabled={!!selectedPatient}
                />
                <input
                  type="text"
                  value={
                    selectedPatient
                      ? calculateAge(selectedPatient.dateDeNee).months
                      : ""
                  }
                  readOnly
                  placeholder="Mois"
                  className="rounded-lg border border-gray-300 p-2 text-sm bg-gray-100 text-center"
                  disabled={!!selectedPatient}
                />
                <input
                  type="text"
                  value={
                    selectedPatient
                      ? calculateAge(selectedPatient.dateDeNee).days
                      : ""
                  }
                  readOnly
                  placeholder="Jours"
                  className="rounded-lg border border-gray-300 p-2 text-sm bg-gray-100 text-center"
                  disabled={!!selectedPatient}
                />
              </div>
            </div>

            {/* Régime de PEC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Régime de PEC
              </label>
              <input
                type="text"
                value={selectedPatient?.regimeDePEC || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, regimeDePEC: e.target.value } : null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                disabled={!!selectedPatient}
              />
            </div>

            {/* N.Carnet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                N.Carnet
              </label>
              <input
                type="text"
                value={selectedPatient?.nCarnet || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, nCarnet: e.target.value } : null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                disabled={!!selectedPatient}
              />
            </div>

            {/* Matricule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matricule
              </label>
              <input
                type="text"
                value={selectedPatient?.Matricule || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, Matricule: e.target.value } : null
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                disabled={!!selectedPatient}
              />
            </div>

            {/* Service demandeur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service demandeur
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                disabled={!!selectedPatient}
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                value={selectedPatient?.Telephone || ""}
                onChange={(e) =>
                  setSelectedPatient((prev) =>
                    prev ? { ...prev, Telephone: e.target.value } : null
                  )
                }
                disabled={!!selectedPatient}
              />
            </div>

            {/* Special Row: Poids - Taille - Créatinine */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "Poids", label: "Poids", type: "number" },
                { id: "Taille", label: "Taille", type: "number" },
                { id: "Creat", label: "Créatinine", type: "text" },
              ].map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                    disabled={!!selectedPatient}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Clinical Info */}
        <div className="bg-amber-50 p-4 rounded-xl shadow-sm space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Renseignement clinique
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
              value={RenseignementClinique[0].Renseignement}
              onChange={(e) => {
                setRenseignementClinique((prev) => [
                  {
                    ...prev[0],
                    Renseignement: e.target.value,
                    Technique: prev[0].Remarque,
                  },
                ]);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarque
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
              value={remarque}
              onChange={(e) => {
                setRemarque(e.target.value);
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              className="flex-1 p-1 rounded text-sm shadow hover:shadow-2xl bg-blue-500 hover:bg-blue-700
text-white             "
            >
              Historique
            </button>
            <button className="flex-1 p-1 rounded text-sm shadow hover:shadow-2xl bg-blue-500 hover:bg-blue-700 text-white">
              Historique RDV
            </button>
            <button
              onClick={() => {
                setIsComunication(!isComunication);
              }}
              className="flex-1 p-1 rounded text-sm shadow hover:shadow-2xl bg-blue-500 hover:bg-blue-700 text-white"
            >
              Communication
            </button>
          </div>
          {isComunication && (
            <div className="flex flex-wrap   rounded-lg border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none">
              message
            </div>
          )}
        </div>
      </div>

      {/* Actes Médicaux Table */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Actes Médicaux
        </h3>

        <div className="overflow-x-auto">
          <ActsTable patientData={selectedPatient} onRowsChange={setActs} />
        </div>
      </div>

      {/* Patient Selection Modal */}
      {isModalOpen && (
        <div
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Sélectionner un Patient -{" "}
              {
                provenanceOptions.find(
                  (opt) => opt.value === selectedProvenance
                )?.label
              }
            </h2>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher par nom, matricule, N. carnet..."
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchPatients(e.target.value);
                }}
              />
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm text-left border">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="p-2 border">Nom</th>
                    <th className="p-2 border">Date de naissance</th>
                    <th className="p-2 border">Regime PEC</th>
                    <th className="p-2 border">N.Carnet</th>
                    <th className="p-2 border">Matricule</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        Chargement...
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        Aucun patient trouvé
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{patient.nomEtPrenom}</td>
                        <td className="p-2 border">{patient.dateDeNee}</td>
                        <td className="p-2 border">{patient.regimeDePEC}</td>
                        <td className="p-2 border">{patient.nCarnet}</td>
                        <td className="p-2 border">{patient.Matricule}</td>

                        <td className="p-2 border">
                          <Button
                            color="blue"
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsModalOpen(false);
                              setSelectedEncounterId(patient.encounterId);
                            }}
                          >
                            Sélectionner
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button
                className="bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saisie;
