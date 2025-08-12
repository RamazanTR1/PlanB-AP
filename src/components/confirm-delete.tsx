import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

// Entity türleri için tip tanımlamaları
export type EntityType =
  | "iletişimMesaj"
  | "takımUyesi"
  | "bildirimAbonelik"
  | "slider"
  | "kullanıcı"
  | "bildirim"
  | "hizmet"
  | "portfolio"
  | "partner"
  | "etiket";

// Entity konfigürasyonu
interface EntityConfig {
  article: string; // "bu", "şu" vb.
  accusative: string; // "kullanıcıyı", "kategoriyi", "etiketi" vb.
}

const entityConfigs: Record<EntityType, EntityConfig> = {
  kullanıcı: { article: "bu", accusative: "kullanıcıyı" },
  iletişimMesaj: { article: "bu", accusative: "iletişim mesajını" },
  takımUyesi: { article: "bu", accusative: "takım üyesini" },
  bildirim: { article: "bu", accusative: "bildirimi" },
  bildirimAbonelik: { article: "bu", accusative: "bildirim aboneliğini" },
  partner: { article: "bu", accusative: "partneri" },
  etiket: { article: "bu", accusative: "etiketi" },
  portfolio: { article: "bu", accusative: "portfolyonu" },
  slider: { article: "bu", accusative: "slideri" },
  hizmet: { article: "bu", accusative: "hizmeti" },
};

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  entityType: EntityType;
  entityName?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  requireTextConfirmation?: boolean;
  confirmationText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
  title,
  description,
  confirmText = "Sil",
  cancelText = "İptal",
  requireTextConfirmation = false,
  confirmationText,
  isDangerous = true,
  isLoading = false,
  children,
}: DeleteConfirmationModalProps) {
  const [textInput, setTextInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const config = entityConfigs[entityType];
  const defaultConfirmationText = confirmationText || entityName || entityType;

  // Varsayılan başlık ve açıklama
  const defaultTitle =
    title ||
    `${entityType?.charAt(0).toUpperCase() + entityType?.slice(1)} Sil`;
  const defaultDescription =
    description ||
    `${config?.article?.charAt(0).toUpperCase() + config?.article?.slice(1)} ${
      config?.accusative
    } silmek istediğinize emin misiniz?${
      entityName
        ? ` Bu işlem "${entityName}" öğesini kalıcı olarak kaldıracaktır.`
        : ""
    }`;

  const handleConfirm = async () => {
    if (
      requireTextConfirmation &&
      textInput.trim() !== defaultConfirmationText
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting && !isLoading) {
      setTextInput("");
      onClose();
    }
  };

  const isConfirmDisabled =
    isDeleting ||
    isLoading ||
    (requireTextConfirmation && textInput.trim() !== defaultConfirmationText);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-4 w-4 text-destructive" />
            </div>
            {defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-left">
            {defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isDangerous && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bu işlem geri alınamaz. Silinen veriler kalıcı olarak
                kaybolacaktır.
              </AlertDescription>
            </Alert>
          )}

          {requireTextConfirmation && (
            <div className="space-y-2">
              <Label htmlFor="confirmation-input">
                Silmek için "<strong>{defaultConfirmationText}</strong>" yazın:
              </Label>
              <Input
                id="confirmation-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={defaultConfirmationText}
                disabled={isDeleting || isLoading}
                className="font-mono"
              />
            </div>
          )}

          {/* Ek içerik için children */}
          {children}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting || isLoading}
            className="w-full cursor-pointer sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full cursor-pointer sm:w-auto"
          >
            {(isDeleting || isLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
// Hook moved to `src/hooks/use-delete-confirmation.tsx` to satisfy
// react-refresh rule (file should only export components).

export default DeleteConfirmationModal;
