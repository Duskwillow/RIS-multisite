import React, { useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Typography } from '@material-tailwind/react';
import { useUnifiedWorklistStore } from './useUnifiedWorklistStore';

const TABLE_HEAD = ['Patient', 'Examen', 'Site', 'Urgence', 'Date'];

// Mock data for now, will be replaced by API call
const MOCK_WORKLIST_DATA = [
  {
    patientName: 'John Doe',
    examDescription: 'Radiographie du thorax',
    siteName: 'Site A',
    isUrgent: true,
    examDate: '2025-09-25',
  },
  {
    patientName: 'Jane Smith',
    examDescription: 'IRM du genou',
    siteName: 'Site B',
    isUrgent: false,
    examDate: '2025-09-25',
  },
  {
    patientName: 'Peter Jones',
    examDescription: 'Échographie abdominale',
    siteName: 'Site A',
    isUrgent: true,
    examDate: '2025-09-24',
  },
  {
    patientName: 'Alice Brown',
    examDescription: 'Scanner cérébral',
    siteName: 'Site C',
    isUrgent: false,
    examDate: '2025-09-23',
  },
];

export function UnifiedWorklistTable() {
  const { filteredWorklist, searchTerm, setWorklist, setSearchTerm } = useUnifiedWorklistStore();

  useEffect(() => {
    // For this story, we use mock data. In Story 2.2, this will be an API call.
    setWorklist(MOCK_WORKLIST_DATA);
  }, [setWorklist]);

  return (
    <Card className="w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Worklist Unifiée
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Liste de tous les examens
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                id="patient-search"
                label="Rechercher par patient"
                aria-label="Rechercher par patient"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map(head => (
                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredWorklist.map(({ patientName, examDescription, siteName, isUrgent, examDate }, index) => {
              const isLast = index === filteredWorklist.length - 1;
              const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
              const urgentClass = isUrgent ? 'bg-red-100' : '';

              return (
                <tr key={patientName} className={urgentClass}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {patientName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {examDescription}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {siteName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {isUrgent ? 'Oui' : 'Non'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {examDate}
                    </Typography>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
