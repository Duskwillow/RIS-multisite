import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useAuthStore } from "../services/authStore";

export interface Act {
  code: string;
  name: string;
  id: number;
}

interface ActSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  acts: Act[];
  onSelect: (act: Act) => void;
}

const ActSelectionModal: React.FC<ActSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [acts, setActs] = useState<Act[]>([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const now = new Date();
  const currentDate = now.toLocaleDateString();
  const currentTime = now.toLocaleTimeString();

  useEffect(() => {
    if (isOpen) {
      fetchAct();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchAct = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:3001/act`, {
        headers,
      });
      console.log("response", response);
      setActs(response.data);
      /*
      setAct(
        response.data.map((p: any) => ({
          id: p.id,
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
      );*/
      console.log("the patient data", acts);
    } catch (error) {
      console.error("Error fetching patients:", error);

      alert(
        "Erreur lors du chargement des patients. Vérifiez votre connexion."
      );
      setActs([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      className="fixed inset-0 flex items-center justify-center z-50 "
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Sélectionner un Acte</h2>

        <div className="overflow-y-auto max-h-96">
          <table className="w-full text-sm text-left border ">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 border ">Code</th>
                <th className="p-2 border">Libelle Acte</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    Chargement...
                  </td>
                </tr>
              ) : acts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center">
                    Aucun acte disponible
                  </td>
                </tr>
              ) : (
                acts.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{act.code}</td>
                    <td className="p-2 border">{act.name}</td>
                    <td className="p-2 border">
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => {
                          onSelect(act);
                          onClose();
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
          <Button className="bg-blue-500" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActSelectionModal;
