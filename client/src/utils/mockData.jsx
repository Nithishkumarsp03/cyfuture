// shared mock data and helpers
export const mockDefects = [
  {
    id: "def-001",
    industry: "automotive",
    defectType: "Welding crack",
    location: { x: 120, y: 80 },
    severity: "critical",
    detectedAt: "2025-07-31T09:12:00Z",
    imageUrl: null,
    detectionSource: "CAM-12",
    machineId: "MCH-01",
    operatorId: "OP-23",
    shift: "morning",
    batchId: "BATCH-1001",
    status: "open",
  },
  {
    id: "def-002",
    industry: "automotive",
    defectType: "Paint discoloration",
    location: { zone: "rear-left" },
    severity: "minor",
    detectedAt: "2025-07-30T14:30:00Z",
    imageUrl: null,
    detectionSource: "CAM-03",
    machineId: "MCH-02",
    operatorId: "OP-11",
    shift: "afternoon",
    batchId: "BATCH-1001",
    status: "under review",
  },
  {
    id: "def-003",
    industry: "pharma",
    defectType: "Missing parts",
    location: { x: 50, y: 220 },
    severity: "major",
    detectedAt: "2025-07-29T21:05:00Z",
    imageUrl: null,
    detectionSource: "ROBOT-5",
    machineId: "MCH-10",
    operatorId: "OP-02",
    shift: "night",
    batchId: "BATCH-2009",
    status: "resolved",
  },
];

export const mockMachines = [
  { id: "MCH-01", name: "Weld Station A", line: "Line 1", industry: "automotive" },
  { id: "MCH-02", name: "Paint Booth 3", line: "Line 1", industry: "automotive" },
  { id: "MCH-10", name: "Assembly Robot X", line: "Line 5", industry: "pharma" },
];

export const mockOperators = [
  { id: "OP-23", name: "Ravi Kumar", shift: "morning" },
  { id: "OP-11", name: "Anita Singh", shift: "afternoon" },
  { id: "OP-02", name: "Liu Wei", shift: "night" },
];

export const mockThresholds = [
  { id: "thr-1", productLine: "Line 1", defectType: "Welding crack", severity: "critical", limit: 1, notify: true },
  { id: "thr-2", productLine: "Line 1", defectType: "Paint discoloration", severity: "minor", limit: 5, notify: false },
];

export const mockAlerts = [
  { id: "alert-001", message: "Critical welding crack on MCH-01", createdAt: "2025-07-31T09:15:00Z", acknowledged: false },
  { id: "alert-002", message: "Threshold exceeded for Paint discoloration (Line 1)", createdAt: "2025-07-30T15:00:00Z", acknowledged: true },
];

export const formatDate = (iso) => new Date(iso).toLocaleString();
