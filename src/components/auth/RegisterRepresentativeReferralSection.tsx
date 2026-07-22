"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ConfirmDialog } from "@/components/admin";
import { useReferral } from "@/components/providers/ReferralProvider";
import { IndicatedByRepresentativeCard } from "@/components/representatives/IndicatedByRepresentativeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { useValidateRepresentativeCode } from "@/hooks/api/useValidateRepresentativeCode";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";

/**
 * Exibe / edita indicação via ReferralProvider durante o cadastro.
 */
function RegisterRepresentativeReferralSection() {
  const referral = useReferral();
  const validateMutation = useValidateRepresentativeCode();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleValidate = () => {
    const code = draft.trim().toUpperCase();
    if (!code) return;
    validateMutation.mutate(
      { representativeCode: code },
      {
        onSuccess: (data) => {
          if (!isRepresentativeActive(data.status)) {
            return;
          }
          void referral.save(data.representativeCode).then((result) => {
            if (result.status === "blocked") {
              setDraft(result.pendingCode);
              return;
            }
            setDraft(data.representativeCode);
            setIsEditing(false);
          });
        },
      },
    );
  };

  const handleChangeCode = () => {
    setConfirmClearOpen(true);
  };

  if (!referral.isReady) {
    return (
      <div className="border-border bg-muted/30 flex items-center gap-2 rounded-xl border p-3 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Verificando indicação…
      </div>
    );
  }

  if (referral.hasActiveReferral && !isEditing && referral.representativeCode) {
    return (
      <>
        <div className="border-border bg-muted/30 flex flex-col gap-2 rounded-xl border p-3">
          <p className="text-sm font-medium">Código do representante</p>
          <IndicatedByRepresentativeCard
            name={referral.representativeName ?? "Representante"}
            representativeCode={referral.representativeCode}
            onChangeCode={handleChangeCode}
          />
        </div>
        <ConfirmDialog
          open={confirmClearOpen}
          onOpenChange={setConfirmClearOpen}
          title="Trocar indicação?"
          description="A indicação atual será removida para você informar outro código."
          confirmLabel="Trocar Indicação"
          onConfirm={() => {
            referral.clear();
            setIsEditing(true);
            setDraft("");
            setConfirmClearOpen(false);
            validateMutation.reset();
          }}
        />
      </>
    );
  }

  if (!isEditing && !referral.hasActiveReferral) {
    return null;
  }

  return (
    <div className="border-border bg-muted/30 flex flex-col gap-3 rounded-xl border p-3">
      <div>
        <p className="text-sm font-medium">Código do representante</p>
        <p className="text-muted-foreground text-xs">
          Opcional. Informe se um representante comercial indicou sua loja.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="register-rep-code">Código</Label>
          <Input
            id="register-rep-code"
            className="font-mono"
            placeholder="Ex: REP000123"
            value={draft}
            disabled={validateMutation.isPending}
            onChange={(event) => {
              setDraft(event.target.value.toUpperCase());
              validateMutation.reset();
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!draft.trim() || validateMutation.isPending}
          onClick={handleValidate}
        >
          {validateMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Validar"
          )}
        </Button>
      </div>
      {validateMutation.isError ? (
        <p className="text-destructive text-xs">
          {getFriendlyErrorMessage(validateMutation.error)}
        </p>
      ) : null}
    </div>
  );
}

export { RegisterRepresentativeReferralSection };
