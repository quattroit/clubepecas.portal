"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileWarning,
  FolderOpen,
  ImageOff,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  AdminEmptyState,
  AdminMetricCard,
  AdminPage,
  AdminSection,
  AdminStatsGrid,
  ConfirmDialog,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type {
  FileCleanupResultDto,
  FileIntegrityReportDto,
} from "@/contracts/admin/files";
import { useCheckFileIntegrity } from "@/hooks/api/useCheckFileIntegrity";
import { useCleanupOrphanFiles } from "@/hooks/api/useCleanupOrphanFiles";
import { formatMetricCount } from "@/utils/formatMetrics";

function KeyList({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-4">
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-medium">
        {title}{" "}
        <span className="text-muted-foreground font-normal">
          ({items.length}
          {items.length >= 200 ? "+" : ""})
        </span>
      </p>
      <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs break-all">
        {items.map((item) => (
          <li key={item} className="text-muted-foreground font-mono">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Painel administrativo de integridade e limpeza do armazenamento.
 */
function AdminFilesView() {
  const integrityMutation = useCheckFileIntegrity();
  const cleanupMutation = useCleanupOrphanFiles();

  const [report, setReport] = useState<FileIntegrityReportDto | null>(null);
  const [cleanupResult, setCleanupResult] =
    useState<FileCleanupResultDto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const busy = integrityMutation.isPending || cleanupMutation.isPending;

  const statusMessage = useMemo(() => {
    if (integrityMutation.isPending) {
      return "Verificando consistência entre banco e armazenamento…";
    }
    if (cleanupMutation.isPending) {
      return cleanupMutation.variables === true
        ? "Simulando limpeza (dry run)…"
        : "Removendo arquivos órfãos…";
    }
    return null;
  }, [
    integrityMutation.isPending,
    cleanupMutation.isPending,
    cleanupMutation.variables,
  ]);

  const handleVerify = async () => {
    setCleanupResult(null);
    const data = await integrityMutation.mutateAsync();
    setReport(data);
  };

  const handleDryRun = async () => {
    const data = await cleanupMutation.mutateAsync(true);
    setCleanupResult(data);
  };

  const handleCleanupConfirm = async () => {
    const data = await cleanupMutation.mutateAsync(false);
    setCleanupResult(data);
    setConfirmOpen(false);

    // Revalida o relatório após limpeza real.
    const refreshed = await integrityMutation.mutateAsync();
    setReport(refreshed);
  };

  const hasIssues =
    report != null &&
    (report.missingFiles > 0 ||
      report.orphanFiles > 0 ||
      report.missingThumbnails > 0 ||
      report.duplicateStorageKeys > 0 ||
      report.invalidRecords > 0 ||
      report.checksumMismatches > 0);

  return (
    <AdminPage
      title="Arquivos"
      description="Verifique a consistência do armazenamento e remova arquivos órfãos com segurança."
      breadcrumb={[
        { label: "Admin", href: ROUTES.ADMIN },
        { label: "Arquivos" },
      ]}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void handleVerify()}
          >
            {integrityMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 className="size-4" aria-hidden />
            )}
            Verificar
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void handleDryRun()}
          >
            {cleanupMutation.isPending && cleanupMutation.variables === true ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <FileWarning className="size-4" aria-hidden />
            )}
            Dry Run
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={busy}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Executar limpeza
          </Button>
        </div>
      }
    >
      {statusMessage ? (
        <div
          className="bg-muted/60 text-muted-foreground mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
          {statusMessage}
        </div>
      ) : null}

      {!report && !cleanupResult ? (
        <AdminEmptyState
          icon={<FolderOpen className="size-6" aria-hidden />}
          title="Nenhuma verificação executada"
          description="Clique em Verificar para analisar a consistência entre o banco de dados e os arquivos no armazenamento."
        />
      ) : null}

      {report ? (
        <>
          <AdminSection
            title="Resumo"
            description={
              hasIssues
                ? "Foram encontradas inconsistências. Revise os detalhes abaixo."
                : "Armazenamento consistente — nenhuma inconsistência crítica encontrada."
            }
          >
            <AdminStatsGrid aria-label="Resumo de integridade">
              <AdminMetricCard
                title="Arquivos analisados"
                value={formatMetricCount(report.totalFiles)}
                description={`${formatMetricCount(report.totalPhotos)} fotos no banco`}
                icon={<FolderOpen className="size-4" aria-hidden />}
              />
              <AdminMetricCard
                title="Arquivos órfãos"
                value={formatMetricCount(report.orphanFiles)}
                description="No disco, sem registro"
                icon={<FileWarning className="size-4" aria-hidden />}
                trend={report.orphanFiles > 0 ? "down" : "neutral"}
              />
              <AdminMetricCard
                title="Arquivos ausentes"
                value={formatMetricCount(report.missingFiles)}
                description="No banco, sem arquivo"
                icon={<ImageOff className="size-4" aria-hidden />}
                trend={report.missingFiles > 0 ? "down" : "neutral"}
              />
              <AdminMetricCard
                title="Thumbnails ausentes"
                value={formatMetricCount(report.missingThumbnails)}
                icon={<ImageOff className="size-4" aria-hidden />}
                trend={report.missingThumbnails > 0 ? "down" : "neutral"}
              />
              <AdminMetricCard
                title="Duplicidades"
                value={formatMetricCount(report.duplicateStorageKeys)}
                icon={<Copy className="size-4" aria-hidden />}
                trend={report.duplicateStorageKeys > 0 ? "down" : "neutral"}
              />
              <AdminMetricCard
                title="Registros inválidos"
                value={formatMetricCount(report.invalidRecords)}
                description={
                  report.checksumMismatches > 0
                    ? `${report.checksumMismatches} checksum(s) divergente(s)`
                    : undefined
                }
                icon={<AlertTriangle className="size-4" aria-hidden />}
                trend={
                  report.invalidRecords > 0 || report.checksumMismatches > 0
                    ? "down"
                    : "neutral"
                }
              />
            </AdminStatsGrid>
            <p className="text-muted-foreground mt-3 text-xs tabular-nums">
              Análise concluída em {Math.round(report.elapsedMilliseconds)} ms
            </p>
          </AdminSection>

          {report.warnings.length > 0 ? (
            <AdminSection title="Avisos">
              <ul className="space-y-2 text-sm">
                {report.warnings.map((warning) => (
                  <li
                    key={warning}
                    className="bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-lg px-3 py-2"
                  >
                    {warning}
                  </li>
                ))}
              </ul>
            </AdminSection>
          ) : null}

          <AdminSection title="Detalhes">
            <div className="grid gap-4 lg:grid-cols-2">
              <KeyList
                title="Órfãos"
                items={report.orphanFileKeys}
                emptyLabel="Nenhum arquivo órfão."
              />
              <KeyList
                title="Ausentes"
                items={report.missingFileKeys}
                emptyLabel="Nenhum arquivo ausente."
              />
              <KeyList
                title="Thumbnails ausentes"
                items={report.missingThumbnailKeys}
                emptyLabel="Nenhum thumbnail ausente."
              />
              <KeyList
                title="Duplicidades"
                items={report.duplicateKeys}
                emptyLabel="Nenhuma StorageKey duplicada."
              />
              <KeyList
                title="Registros inválidos"
                items={report.invalidRecordDetails}
                emptyLabel="Nenhum registro inválido."
              />
              <KeyList
                title="Checksums divergentes"
                items={report.checksumMismatchDetails}
                emptyLabel="Nenhuma divergência de checksum."
              />
            </div>
          </AdminSection>
        </>
      ) : null}

      {cleanupResult ? (
        <AdminSection
          title={cleanupResult.dryRun ? "Resultado do Dry Run" : "Resultado da limpeza"}
          description={
            cleanupResult.dryRun
              ? "Nenhum arquivo foi removido. Apenas simulação."
              : "Arquivos órfãos removidos do armazenamento."
          }
        >
          <AdminStatsGrid aria-label="Resumo da limpeza">
            <AdminMetricCard
              title="Candidatos"
              value={formatMetricCount(cleanupResult.candidates)}
            />
            <AdminMetricCard
              title={cleanupResult.dryRun ? "Seriam removidos" : "Removidos"}
              value={formatMetricCount(
                cleanupResult.dryRun
                  ? cleanupResult.candidates
                  : cleanupResult.removed,
              )}
            />
            <AdminMetricCard
              title="Falhas"
              value={formatMetricCount(cleanupResult.failed)}
              trend={cleanupResult.failed > 0 ? "down" : "neutral"}
            />
          </AdminStatsGrid>
          <p className="text-muted-foreground mt-3 text-xs tabular-nums">
            Operação concluída em{" "}
            {Math.round(cleanupResult.elapsedMilliseconds)} ms
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <KeyList
              title="Candidatos"
              items={cleanupResult.candidateKeys}
              emptyLabel="Nenhum candidato."
            />
            {!cleanupResult.dryRun ? (
              <KeyList
                title="Removidos"
                items={cleanupResult.removedKeys}
                emptyLabel="Nenhum arquivo removido."
              />
            ) : null}
            {cleanupResult.failedKeys.length > 0 ? (
              <KeyList
                title="Falhas"
                items={cleanupResult.failedKeys}
                emptyLabel=""
              />
            ) : null}
          </div>
        </AdminSection>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Executar limpeza de órfãos?"
        description="Arquivos presentes no armazenamento e sem referência no banco serão removidos permanentemente. Arquivos referenciados nunca são apagados. Recomendamos executar o Dry Run antes."
        confirmLabel="Remover órfãos"
        confirmVariant="destructive"
        loading={cleanupMutation.isPending && cleanupMutation.variables === false}
        onConfirm={() => void handleCleanupConfirm()}
      />
    </AdminPage>
  );
}

export { AdminFilesView };
