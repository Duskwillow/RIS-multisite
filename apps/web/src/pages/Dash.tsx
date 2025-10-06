import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/Button";
import {
  Activity,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../services/authStore";

interface DashboardStats {
  pendingExams: number;
  urgentExams: number;
  completedExams: number;
  activePatients: number;
}

interface RecentExam {
  id: string;
  patientName: string;
  accession: string;
  modality: string;
  bodyPart: string;
  urgency: "routine" | "urgent" | "stat";
  site: string;
  time: string;
}

interface SiteStatus {
  name: string;
  status: "online" | "maintenance" | "offline";
  exams: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [sites, setSites] = useState<SiteStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel
      const [statsResponse, examsResponse, sitesResponse] = await Promise.all([
        axios.get("http://localhost:3001/dashboard/stats", { headers }),
        axios.get("http://localhost:3001/dashboard/recent-exams", { headers }),
        axios.get("http://localhost:3001/dashboard/sites-status", { headers }),
      ]);
      console.log(
        "Console log :",
        statsResponse.data,
        examsResponse.data,
        sitesResponse.data
      );

      setStats(statsResponse.data);
      setRecentExams(examsResponse.data);
      setSites(sitesResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          usedFor="Examens en Attente"
          ValueOFTheCard={stats?.pendingExams || 0}
          icon={<Clock className="text-purple-500" />}
        />
        <Card
          usedFor="Examens Urgents"
          ValueOFTheCard={stats?.urgentExams || 0}
          icon={<AlertTriangle className="text-red-500" />}
        />
        <Card
          usedFor="Examens Complétés"
          ValueOFTheCard={stats?.completedExams || 0}
          icon={<CheckCircle className="text-green-500" />}
        />
        <Card
          usedFor="Patients Actifs"
          ValueOFTheCard={stats?.activePatients || 0}
          icon={<Users className="text-blue-500" />}
        />
      </div>

      {/* Recent Exams & Sites Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Exams */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Examens Récents</h2>
            <Button variant="glow" size="sm">
              Voir tout
            </Button>
          </div>

          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800">
                      {exam.patientName}
                    </h4>
                    <Badge
                      variant={
                        exam.urgency === "urgent"
                          ? "destructive"
                          : exam.urgency === "stat"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {exam.urgency.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {exam.accession} • {exam.modality} {exam.bodyPart}
                  </div>
                  <div className="text-xs text-gray-400">
                    {exam.site} • {exam.time}
                  </div>
                </div>
                <Button
                  variant="glass"
                  size="sm"
                  className="hover:scale-110 transition-transform duration-300"
                >
                  Ouvrir
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sites Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-gray-800">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-blue-500 to-teal-400">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span>État des Sites</span>
          </div>

          <div className="space-y-4">
            {sites.map((site) => (
              <div
                key={site.name}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm text-gray-800">
                    {site.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {site.exams} examens en cours
                  </div>
                </div>
                <Badge
                  variant={
                    site.status === "online"
                      ? "default"
                      : site.status === "maintenance"
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {site.status === "online"
                    ? "En ligne"
                    : site.status === "maintenance"
                    ? "Maintenance"
                    : "Hors ligne"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
