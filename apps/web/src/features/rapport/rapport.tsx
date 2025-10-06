import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../services/authStore";
import axios from "axios";

interface Patient {
  id: number;
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
interface Rapport {
  Technique: string;
  Renseignement: string;
  Conclusion: string;
  Resultat: string;
}

const Rapport: React.FC = () => {
  const [selectedProvenance, setSelectedProvenance] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  //Loading
  const [loading, setLoading] = useState(false);

  //rapports
  const [rapports, setRapports] = useState<Rapport[]>([
    {
      Technique: "",
      Renseignement: "",
      Conclusion: "",
      Resultat: "",
    },
  ]);

  console.log("repport: ", rapports);
  //patient
  const [patients, setPatients] = useState<Patient[]>([]);

  //user
  const user = useAuthStore((state) => state.user);
  //token
  const { token } = useAuthStore();

  const now = new Date();
  const currentTime = now.toLocaleDateString();

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
    if (selectedProvenance) {
      fetchPatientsByProvenance(selectedProvenance);
    }
  }, [selectedProvenance]);

  const fetchPatientsByProvenance = async (provenance: string) => {
    if (!provenance || provenance === "auter") {
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
      setPatients(
        response.data.map((p: any) => ({
          id: p.id,
          nomEtPrenom: p.nomEtPrenom,
          dateDeNee: p.date_de_nee,
          regimeDePEC: p.regime_de_pec,
          nCarnet: p.n_carnet,
          Matricule: p.matricule,
          N_Soins: p.N_Soins,
          Telephone: p.Telephone,
        }))
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvenanceChange = (value: string) => {
    setSelectedProvenance(value);
    setSelectedPatient(null);
    if (value && value !== "autre") {
      setIsModalOpen(true);
    }
  };

  const startResize = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const stopResize = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing) {
      const newLeftWidth = (e.clientX / window.innerWidth) * 100;
      if (newLeftWidth > 10 && newLeftWidth < 90) {
        // prevent too small/large
        setLeftWidth(newLeftWidth);
      }
    }
  };
  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  function calculateAge(dob: string) {
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
  }
  const fetchPatientExam = async () => {
    setLoading(true);
    try {
      const header = { Authorization: `Beare ${token}` };
      const response = await axios.post(
        `http://localhost:3001/getpatientexam`,
        { header }
      );
    } catch (error) {
      console.error("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const sauvegardeRapport = async (examen_id: number) => {
    if (!rapports) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `http://localhost:3001/Rapport/id=${examen_id}`,
        {
          headers,
        }
      );
      setRapports([
        response.data.map((repo: any) => ({
          Technique: repo.Technique,
          Renseignement: repo.Renseignement,
          Conclusion: repo.Conclusion,
          Resultat: repo.Resultat,
        })),
      ]);
    } catch (error) {
      console.error("Rapport n'est pas envoyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Rapport</h1>

      <div className="flex flex-row 3 gap-6">
        <div
          style={{ flexBasis: leftWidth + "%" }}
          className="bg-white overflow-auto rounded-lg shadow-md"
        >
          {/* Left Column */}
          {!showIframe ? (
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Informations de la Demande
              </h2>
              {/* Type de Demande */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de Demande
                </label>
                <select className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Sélectionner une demande</option>

                  <option>hi</option>
                </select>
              </div>
              {/* Selected Patient Info */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-semibold mb-4">
                  Informations Complémentaires
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Provenance */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Provenance
                    </label>
                    <select
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={selectedProvenance}
                      onChange={(e) => handleProvenanceChange(e.target.value)}
                    >
                      <option>Sélectionner la provenance</option>
                      {provenanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Médecin */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Médecin
                    </label>
                    <input
                      type="text"
                      placeholder="Nom du médecin"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Remarque */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Remarque
                    </label>
                    <input
                      type="text"
                      placeholder="Saisir une remarque"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Examens */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Examens
                    </label>
                    <input
                      type="text"
                      placeholder="Saisir les examens"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>
              {selectedPatient && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md space-y-4">
                  <h3 className="font-medium text-lg mb-2">
                    Patient sélectionné
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Nom */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={selectedPatient?.nomEtPrenom || ""}
                        onChange={(e) =>
                          setSelectedPatient((prev: any) =>
                            prev
                              ? { ...prev, nomEtPrenom: e.target.value }
                              : null
                          )
                        }
                        className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* Date de naissance */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Date de naissance
                      </label>
                      <input
                        type="date"
                        value={selectedPatient?.dateDeNee || ""}
                        onChange={(e) =>
                          setSelectedPatient((prev: any) =>
                            prev ? { ...prev, dateDeNee: e.target.value } : null
                          )
                        }
                        className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    {/* Telephone eli mzamr 3lih*/}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="number"
                        value={selectedPatient?.Telephone || ""}
                        onChange={(e) =>
                          setSelectedPatient((prev: any) =>
                            prev ? { ...prev, Telephone: e.target.value } : null
                          )
                        }
                        placeholder="Téléphone"
                        className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                      />
                    </div>

                    <input
                      type="text"
                      value={calculateAge(selectedPatient.dateDeNee).years}
                      readOnly
                      placeholder="Ans"
                      className="border rounded-md p-2 text-sm bg-gray-100 text-center"
                    />
                    <input
                      type="text"
                      value={calculateAge(selectedPatient.dateDeNee).months}
                      readOnly
                      placeholder="Mois"
                      className="border rounded-md p-2 text-sm bg-gray-100 text-center"
                    />
                    <input
                      type="text"
                      value={calculateAge(selectedPatient.dateDeNee).days}
                      readOnly
                      placeholder="Jours"
                      className="border rounded-md p-2 text-sm bg-gray-100 text-center"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">Salle</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Radiologue */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Radiologue
                    </label>
                    <input
                      type="text"
                      placeholder="Nom du radiologue"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Resident */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Resident
                    </label>
                    <input
                      type="text"
                      placeholder="Nom du resident"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* Salle */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Salle
                    </label>
                    <input
                      type="text"
                      placeholder="Salle assignée"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
                <h2 className="text-xl font-semibold mb-4">Mesures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Micromol/L
                    </label>
                    <input
                      type="text"
                      placeholder="Saisir micromol/l"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      ml/min
                    </label>
                    <input
                      type="text"
                      placeholder="Saisir ml/min"
                      className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Buttons at the bottom */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <button className="px-3 py-1 flex-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Dosimétrie
                  </button>
                  <button className="px-3 py-1 flex-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    Consommable
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-500 flex-1 text-white rounded hover:bg-yellow-600 transition"
                    onClick={() => setShowIframe(true)}
                  >
                    Image Demande
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <button
                className=" px-4 py-2"
                onClick={() => setShowIframe(false)}
              >
                Fermer l'iframe
              </button>

              <iframe
                src="http://127.0.0.1:3000/"
                className="w-full h-screen rounded-lg shadow-md"
                title="External Content"
              ></iframe>
            </div>
          )}
        </div>

        {/* Resizer */}
        <div
          className="w-2 cursor-col-resize bg-gray-300"
          onMouseDown={startResize}
        />

        {/* Right Column */}
        <div
          style={{ flexBasis: 100 - leftWidth + "%" }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-2 gap-4  mb-2">
            <div className="border rounded-md p-2 text w-full"></div>
            <div className="w-full border-transparent"> {currentTime}</div>
          </div>

          <h3> Renseignement Clinique </h3>
          <textarea
            rows={3}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Saisir les Renseignement Clinique ici..."
            value={rapports[0].Renseignement}
            onChange={(e) => {
              setRapports((prev) => [
                {
                  ...prev[0],
                  Renseignement: e.target.value,
                  Technique: prev[0].Technique,
                  Conclusion: prev[0].Conclusion,
                  Resultat: prev[0].Resultat,
                },
              ]);
            }}
          ></textarea>
          <h3> Techniques </h3>
          <textarea
            rows={3}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Saisir les Techniques ici..."
            value={rapports[0].Technique}
            onChange={(e) => {
              setRapports((prev) => [
                {
                  ...prev[0],
                  Renseignement: prev[0].Renseignement,
                  Technique: e.target.value,
                  Conclusion: prev[0].Conclusion,
                  Resultat: prev[0].Resultat,
                },
              ]);
            }}
          ></textarea>
          <h3>Résultats</h3>
          <textarea
            rows={10}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Saisir les Résultats ici..."
            value={rapports[0].Resultat}
            onChange={(e) => {
              setRapports((prev) => [
                {
                  ...prev[2],
                  Renseignement: prev[0].Renseignement,
                  Technique: prev[0].Technique,
                  Conclusion: prev[0].Conclusion,
                  Resultat: e.target.value,
                },
              ]);
            }}
          ></textarea>
          <h3>Conclusions</h3>
          <textarea
            rows={3}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Saisir les Conclusions ici..."
            value={rapports[0].Conclusion}
            onChange={(e) => {
              setRapports((prev) => [
                {
                  ...prev[0],
                  Renseignement: prev[0].Renseignement,
                  Technique: prev[0].Technique,
                  Conclusion: e.target.value,
                  Resultat: prev[0].Technique,
                },
              ]);
            }}
          ></textarea>
          <button className="bg-blue-500 text-white p-1 rounded w-full">
            Envoyer
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }} // transparent background
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Sélectionner un Patient
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100">
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
                          <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={() => {
                              setSelectedPatient(patient);
                              console.log(
                                "selected patients: ",
                                selectedPatient
                              );
                              setIsModalOpen(false);
                            }}
                          >
                            Sélectionner
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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

export default Rapport;
