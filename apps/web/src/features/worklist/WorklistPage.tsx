import { useState } from "react";
import { Filter, Search, RefreshCw, Eye, FileText, Clock } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

const Worklist: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedModality, setSelectedModality] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const handleViewExam = (examId: string) => console.log("Viewing", examId);
  const handleCreateReport = (examId: string) =>
    console.log("Report for", examId);

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Liste de Travail</h2>
          <p className="text-gray-500">
            Examens radiologiques en provenance de tous les sites
          </p>
        </div>
        <Button variant="glow" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-500">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <span className="text-blue-600 font-semibold">Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les sites</SelectItem>
                <SelectItem value="principal">Hôpital Principal</SelectItem>
                <SelectItem value="regional">Hôpital Régional</SelectItem>
                <SelectItem value="centre">Centre Médical</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedModality}
              onValueChange={setSelectedModality}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Modalité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les modalités</SelectItem>
                <SelectItem value="CT">Scanner (CT)</SelectItem>
                <SelectItem value="MRI">IRM</SelectItem>
                <SelectItem value="XR">Radiographie</SelectItem>
                <SelectItem value="US">Échographie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg">
          <TabsTrigger value="all">Tous (3)</TabsTrigger>
          <TabsTrigger value="urgent">Urgents (2)</TabsTrigger>
          <TabsTrigger value="pending">En Attente (1)</TabsTrigger>
          <TabsTrigger value="mine">Mes Examens (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Examen</TableHead>
                    <TableHead>Modalité</TableHead>
                    <TableHead>Urgence</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Date/Heure</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {[1, 2, 3].map((id) => (
                    <TableRow
                      key={id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-gray-700">
                          Patient {id}
                        </div>
                        <div className="text-sm text-gray-400">
                          ID TN000{id} • 35 ans • M
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-700 text-sm">
                          Examen {id}
                        </div>
                        <div className="text-xs text-gray-400">RAD000{id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          CT
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          URGENT
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        Hôpital Principal
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          En attente
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 flex items-center gap-1">
                        2024-09-14 <Clock className="h-3 w-3 text-gray-400" />{" "}
                        09:30
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Worklist;
