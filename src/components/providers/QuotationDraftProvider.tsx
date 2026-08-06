"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { UserRole } from "@/contracts/common/enums";
import {
  loadQuotationDraft,
  saveQuotationDraft,
} from "@/lib/quotation-draft/storage";

/** Item da cotação em elaboração — snapshot do anúncio no momento em que foi adicionado. */
export type QuotationDraftItem = {
  advertisementId: number;
  sellerId: number;
  storeName: string;
  /** WhatsApp do vendedor (quando conhecido no momento de adicionar). */
  sellerWhatsApp?: string | null;
  title: string;
  thumbnailUrl: string | null;
  slug: string;
  quantity: number;
  itemNotes?: string;
};

export type QuotationDraftSellerGroup = {
  sellerId: number;
  storeName: string;
  sellerWhatsApp: string | null;
  items: QuotationDraftItem[];
  itemCount: number;
};

type AddQuotationDraftItemInput = Omit<QuotationDraftItem, "quantity">;

type QuotationDraftContextValue = {
  /** Só é `true` quando a sessão está hidratada e o role é ProfessionalBuyer. */
  isActive: boolean;
  items: QuotationDraftItem[];
  totalCount: number;
  addItem: (item: AddQuotationDraftItemInput) => void;
  removeItem: (advertisementId: number) => void;
  updateQuantity: (advertisementId: number, quantity: number) => void;
  updateItemNotes: (advertisementId: number, itemNotes: string) => void;
  clear: () => void;
  clearSellerGroup: (sellerId: number) => void;
  groupBySeller: () => QuotationDraftSellerGroup[];
};

const QuotationDraftContext = createContext<QuotationDraftContextValue | null>(
  null,
);

type QuotationDraftProviderProps = {
  children: React.ReactNode;
};

/**
 * Rascunho local (localStorage) da Central de Cotações do comprador profissional.
 * Não é carrinho/checkout — apenas agrupa itens por vendedor antes do envio.
 * Fica inativo (sem leitura/escrita) para qualquer role diferente de ProfessionalBuyer.
 */
function QuotationDraftProvider({ children }: QuotationDraftProviderProps) {
  const { user, isLoading } = useAuth();
  const isActive = !isLoading && user?.role === UserRole.ProfessionalBuyer;
  const userId = user?.userId ?? null;

  const [items, setItems] = useState<QuotationDraftItem[]>([]);

  useEffect(() => {
    if (!isActive || !userId) {
      setItems([]);
      return;
    }
    setItems(loadQuotationDraft(userId));
  }, [isActive, userId]);

  const updateItems = useCallback(
    (updater: (current: QuotationDraftItem[]) => QuotationDraftItem[]) => {
      setItems((current) => {
        if (!isActive || !userId) return current;
        const next = updater(current);
        saveQuotationDraft(userId, next);
        return next;
      });
    },
    [isActive, userId],
  );

  const addItem = useCallback(
    (item: AddQuotationDraftItemInput) => {
      updateItems((current) => {
        const existing = current.find(
          (draftItem) => draftItem.advertisementId === item.advertisementId,
        );

        if (existing) {
          return current.map((draftItem) =>
            draftItem.advertisementId === item.advertisementId
              ? { ...draftItem, quantity: draftItem.quantity + 1 }
              : draftItem,
          );
        }

        return [...current, { ...item, quantity: 1 }];
      });
    },
    [updateItems],
  );

  const removeItem = useCallback(
    (advertisementId: number) => {
      updateItems((current) =>
        current.filter((item) => item.advertisementId !== advertisementId),
      );
    },
    [updateItems],
  );

  const updateQuantity = useCallback(
    (advertisementId: number, quantity: number) => {
      const safeQuantity = Math.max(1, Math.trunc(quantity) || 1);
      updateItems((current) =>
        current.map((item) =>
          item.advertisementId === advertisementId
            ? { ...item, quantity: safeQuantity }
            : item,
        ),
      );
    },
    [updateItems],
  );

  const updateItemNotes = useCallback(
    (advertisementId: number, itemNotes: string) => {
      updateItems((current) =>
        current.map((item) =>
          item.advertisementId === advertisementId
            ? { ...item, itemNotes: itemNotes.trim() || undefined }
            : item,
        ),
      );
    },
    [updateItems],
  );

  const clear = useCallback(() => {
    updateItems(() => []);
  }, [updateItems]);

  const clearSellerGroup = useCallback(
    (sellerId: number) => {
      updateItems((current) =>
        current.filter((item) => item.sellerId !== sellerId),
      );
    },
    [updateItems],
  );

  const groupBySeller = useCallback((): QuotationDraftSellerGroup[] => {
    const groups = new Map<number, QuotationDraftSellerGroup>();

    for (const item of items) {
      const group = groups.get(item.sellerId);
      if (group) {
        group.items.push(item);
        group.itemCount += 1;
        if (!group.sellerWhatsApp && item.sellerWhatsApp) {
          group.sellerWhatsApp = item.sellerWhatsApp;
        }
      } else {
        groups.set(item.sellerId, {
          sellerId: item.sellerId,
          storeName: item.storeName,
          sellerWhatsApp: item.sellerWhatsApp ?? null,
          items: [item],
          itemCount: 1,
        });
      }
    }

    return Array.from(groups.values());
  }, [items]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo<QuotationDraftContextValue>(
    () => ({
      isActive,
      items,
      totalCount,
      addItem,
      removeItem,
      updateQuantity,
      updateItemNotes,
      clear,
      clearSellerGroup,
      groupBySeller,
    }),
    [
      isActive,
      items,
      totalCount,
      addItem,
      removeItem,
      updateQuantity,
      updateItemNotes,
      clear,
      clearSellerGroup,
      groupBySeller,
    ],
  );

  return (
    <QuotationDraftContext.Provider value={value}>
      {children}
    </QuotationDraftContext.Provider>
  );
}

function useQuotationDraft(): QuotationDraftContextValue {
  const context = useContext(QuotationDraftContext);
  if (!context) {
    throw new Error(
      "useQuotationDraft deve ser usado dentro de QuotationDraftProvider",
    );
  }
  return context;
}

export { QuotationDraftProvider, useQuotationDraft };
