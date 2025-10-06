import { render, screen, fireEvent } from '@testing-library/react';
import { UnifiedWorklistTable } from './UnifiedWorklistTable';
import { useUnifiedWorklistStore } from './useUnifiedWorklistStore';
import { beforeEach, describe, it, expect, vi } from 'vitest';

// Mock the zustand store to control its state in tests
vi.mock('./useUnifiedWorklistStore', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useUnifiedWorklistStore: vi.fn(),
  };
});

describe('UnifiedWorklistTable', () => {
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
  ];

  let setWorklist: vi.Mock;
  let setSearchTerm: vi.Mock;

  beforeEach(() => {
    setWorklist = vi.fn();
    setSearchTerm = vi.fn();

    (useUnifiedWorklistStore as vi.Mock).mockReturnValue({
      worklist: MOCK_WORKLIST_DATA,
      filteredWorklist: MOCK_WORKLIST_DATA,
      searchTerm: '',
      setWorklist,
      setSearchTerm,
    });
  });

  it('should render the table with correct headers', () => {
    render(<UnifiedWorklistTable />);
    expect(screen.getByText('Patient')).toBeInTheDocument();
    expect(screen.getByText('Examen')).toBeInTheDocument();
    expect(screen.getByText('Site')).toBeInTheDocument();
    expect(screen.getByText('Urgence')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('should display worklist data', () => {
    render(<UnifiedWorklistTable />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Radiographie du thorax')).toBeInTheDocument();
  });

  it('should highlight urgent exams', () => {
    render(<UnifiedWorklistTable />);
    const johnDoeRow = screen.getByText('John Doe').closest('tr');
    expect(johnDoeRow).toHaveClass('bg-red-100');

    const janeSmithRow = screen.getByText('Jane Smith').closest('tr');
    expect(janeSmithRow).not.toHaveClass('bg-red-100');
  });

  it('should call setSearchTerm on search input change', () => {
    render(<UnifiedWorklistTable />);
    const searchInput = screen.getByRole('textbox', { name: 'Rechercher par patient' });
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(setSearchTerm).toHaveBeenCalledWith('John');
  });

  it('should filter worklist based on search term', () => {
    (useUnifiedWorklistStore as vi.Mock).mockReturnValue({
      worklist: MOCK_WORKLIST_DATA,
      filteredWorklist: [
        {
          patientName: 'John Doe',
          examDescription: 'Radiographie du thorax',
          siteName: 'Site A',
          isUrgent: true,
          examDate: '2025-09-25',
        },
      ],
      searchTerm: 'John',
      setWorklist,
      setSearchTerm,
    });

    render(<UnifiedWorklistTable />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});
