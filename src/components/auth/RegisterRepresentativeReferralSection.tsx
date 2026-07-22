"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { IndicatedByRepresentativeCard } from "@/components/representatives/IndicatedByRepresentativeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ValidateRepresentativeCodeResponse } from "@/contracts/admin/representatives";
import { isRepresentativeActive } from "@/contracts/admin/representatives";
import { useValidateRepresentativeCode } from "@/hooks/api/useValidateRepresentativeCode";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import {
  clearRepresentativeReferral,
  getRepresentativeReferral,
  saveRepresentativeReferral,
} from "@/utils/representativeReferral";

/**
 * Exibe / edita indicação salva no LocalStorage durante o cadastro.
 */
function RegisterRepresentativeReferralSection() {
  const validateMutation = useValidateRepresentativeCode();
  const [validated, setValidated] =
    useState<ValidateRepresentativeCodeResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;
    const referral = getRepresentativeReferral();
    if (!referral) {
      setHydrated(true);
      return;
    }

    setDraft(referral.representativeCode);
    validateMutation.mutate(
      { representativeCode: referral.representativeCode },
      {
        onSuccess: (data) => {
          if (isRepresentativeActive(data.status)) {
            setValidated(data);
            setIsEditing(false);
          } else {
            setValidated(null);
            setIsEditing(true);
          }
          setHydrated(true);
        },
        onError: () => {
          clearRepresentativeReferral();
          setValidated(null);
          setIsEditing(false);
          setDraft("");
          setHydrated(true);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot hydrate
  }, [hydrated]);

  const handleValidate = () => {
    const code = draft.trim().toUpperCase();
    if (!code) return;
    validateMutation.mutate(
      { representativeCode: code },
      {
        onSuccess: (data) => {
          if (!isRepresentativeActive(data.status)) {
            setValidated(null);
            return;
          }
          setValidated(data);
          setDraft(data.representativeCode);
          saveRepresentativeReferral(data.representativeCode);
          setIsEditing(false);
        },
        onError: () => setValidated(null),
      },
    );
  };

  const handleChangeCode = () => {
    clearRepresentativeReferral();
    setValidated(null);
    setIsEditing(true);
    validateMutation.reset();
  };

  if (!hydrated) {
    return (
      <div className="border-border bg-muted/30 flex items-center gap-2 rounded-xl border p-3 text-sm">
        <Loader2 className="size-4 animate-spin" />
        Verificando indicação…
      </div>
    );
  }

  if (validated && !isEditing) {
    return (
      <div className="border-border bg-muted/30 flex flex-col gap-2 rounded-xl border p-3">
        <p className="text-sm font-medium">Código do representante</p>
        <IndicatedByRepresentativeCard
          name={validated.name}
          representativeCode={validated.representativeCode}
          onChangeCode={handleChangeCode}
        />
      </div>
    );
  }

  if (!isEditing && !validated) {
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
              setValidated(null);
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
