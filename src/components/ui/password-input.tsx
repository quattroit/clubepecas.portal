"use client";

import {
  forwardRef,
  useCallback,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  /** Id do input; se omitido, gera um id estável. */
  id?: string;
};

function readCapsLockState(
  event: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
): boolean {
  return "getModifierState" in event.nativeEvent
    ? event.nativeEvent.getModifierState("CapsLock")
    : false;
}

/**
 * Campo de senha com mostrar/ocultar e aviso de Caps Lock.
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      id,
      disabled,
      onKeyDown,
      onKeyUp,
      onFocus,
      onBlur,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const capsLockId = `${inputId}-caps-lock`;
    const inputRef = useRef<HTMLInputElement>(null);
    const [visible, setVisible] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const toggleLabel = visible ? "Ocultar senha" : "Mostrar senha";

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const updateCapsLock = useCallback(
      (
        event:
          | React.KeyboardEvent<HTMLInputElement>
          | React.FocusEvent<HTMLInputElement>,
      ) => {
        setCapsLockOn(readCapsLockState(event));
      },
      [],
    );

    const describedBy = [ariaDescribedBy, capsLockOn ? capsLockId : null]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <Input
            ref={inputRef}
            id={inputId}
            type={visible ? "text" : "password"}
            disabled={disabled}
            className={cn("pr-11", className)}
            aria-describedby={describedBy || undefined}
            onKeyDown={(event) => {
              updateCapsLock(event);
              onKeyDown?.(event);
            }}
            onKeyUp={(event) => {
              updateCapsLock(event);
              onKeyUp?.(event);
            }}
            onFocus={(event) => {
              updateCapsLock(event);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setCapsLockOn(false);
              onBlur?.(event);
            }}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            tabIndex={-1}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 size-8 -translate-y-1/2"
            aria-label={toggleLabel}
            aria-pressed={visible}
            aria-controls={inputId}
            onMouseDown={(event) => {
              event.preventDefault();
              setVisible((current) => !current);
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
          >
            {visible ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </Button>
        </div>
        {capsLockOn ? (
          <p
            id={capsLockId}
            className="text-amber-600 dark:text-amber-400 text-xs"
            role="status"
          >
            Caps Lock está ativado.
          </p>
        ) : null}
      </div>
    );
  },
);

export { PasswordInput };
export type { PasswordInputProps };
