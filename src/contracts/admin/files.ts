/**
 * Contratos da manutenção administrativa de arquivos (integridade / limpeza).
 */

export type FileIntegrityReportDto = {
  totalFiles: number;
  totalPhotos: number;
  missingFiles: number;
  orphanFiles: number;
  missingThumbnails: number;
  duplicateStorageKeys: number;
  invalidRecords: number;
  checksumMismatches: number;
  missingFileKeys: string[];
  orphanFileKeys: string[];
  missingThumbnailKeys: string[];
  duplicateKeys: string[];
  invalidRecordDetails: string[];
  checksumMismatchDetails: string[];
  warnings: string[];
  elapsedMilliseconds: number;
};

export type FileCleanupResultDto = {
  dryRun: boolean;
  candidates: number;
  removed: number;
  failed: number;
  candidateKeys: string[];
  removedKeys: string[];
  failedKeys: string[];
  warnings: string[];
  elapsedMilliseconds: number;
};
