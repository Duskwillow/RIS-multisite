import { act } from 'react';
import { useUnifiedWorklistStore } from './useUnifiedWorklistStore';
import { beforeEach, describe, it, expect } from 'vitest';

describe('useUnifiedWorklistStore', () => {
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

  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useUnifiedWorklistStore.setState({
        worklist: [],
        searchTerm: '',
        filteredWorklist: [],
      });
    });
  });

  it('should initialize with empty worklist and search term', () => {
    const { worklist, searchTerm, filteredWorklist } = useUnifiedWorklistStore.getState();
    expect(worklist).toEqual([]);
    expect(searchTerm).toBe('');
    expect(filteredWorklist).toEqual([]);
  });

  it('should set worklist and filter it', () => {
    const { setWorklist } = useUnifiedWorklistStore.getState();
    act(() => {
      setWorklist(MOCK_WORKLIST_DATA);
    });
    const { worklist, filteredWorklist } = useUnifiedWorklistStore.getState();
    expect(worklist).toEqual(MOCK_WORKLIST_DATA);
    expect(filteredWorklist).toEqual(MOCK_WORKLIST_DATA);
  });

  it('should set search term and filter worklist', () => {
    const { setWorklist, setSearchTerm } = useUnifiedWorklistStore.getState();
    act(() => {
      setWorklist(MOCK_WORKLIST_DATA);
      setSearchTerm('John');
    });
    const { searchTerm, filteredWorklist } = useUnifiedWorklistStore.getState();
    expect(searchTerm).toBe('John');
    expect(filteredWorklist).toEqual([
      {
        patientName: 'John Doe',
        examDescription: 'Radiographie du thorax',
        siteName: 'Site A',
        isUrgent: true,
        examDate: '2025-09-25',
      },
    ]);
  });

  it('should return all worklist items if search term is empty', () => {
    const { setWorklist, setSearchTerm } = useUnifiedWorklistStore.getState();
    act(() => {
      setWorklist(MOCK_WORKLIST_DATA);
      setSearchTerm('');
    });
    const { filteredWorklist } = useUnifiedWorklistStore.getState();
    expect(filteredWorklist).toEqual(MOCK_WORKLIST_DATA);
  });
});
