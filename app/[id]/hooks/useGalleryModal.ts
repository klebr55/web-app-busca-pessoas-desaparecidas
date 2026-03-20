import { useState, useCallback, useEffect } from "react";

export interface ModalItem {
  src: string;
  type: "image" | "pdf" | "video";
  caption?: string;
}

export function useGalleryModal() {
  const [modal, setModal] = useState<{
    open: boolean;
    items: ModalItem[];
    index: number;
  }>({ open: false, items: [], index: 0 });

  useEffect(() => {
    if (modal.open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [modal.open]);

  const closeModal = useCallback(
    () => setModal((m) => ({ ...m, open: false })),
    [],
  );

  const prevModal = useCallback(
    () =>
      setModal((m) => ({
        ...m,
        index: (m.index - 1 + m.items.length) % m.items.length,
      })),
    [],
  );

  const nextModal = useCallback(
    () => setModal((m) => ({ ...m, index: (m.index + 1) % m.items.length })),
    [],
  );

  useEffect(() => {
    if (!modal.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevModal();
      if (e.key === "ArrowRight") nextModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal.open, closeModal, prevModal, nextModal]);

  const openModal = useCallback((items: ModalItem[], index: number) => {
    setModal({ open: true, items, index });
  }, []);

  return {
    modal,
    openModal,
    closeModal,
    prevModal,
    nextModal,
  };
}
