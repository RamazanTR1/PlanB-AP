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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, AlertTriangle, Loader2 } from "lucide-react";

interface SendConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  notificationTitle?: string;
  notificationType?: string;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

function SendConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  notificationTitle,
  notificationType,
  title,
  description,
  confirmText = "Gönder",
  cancelText = "İptal",
  isLoading = false,
  children,
}: SendConfirmationModalProps) {
  const [isSending, setIsSending] = useState(false);

  // Varsayılan başlık ve açıklama
  const defaultTitle = title || "Bildirim Gönder";
  const defaultDescription =
    description ||
    `Bu bildirimi göndermek istediğinize emin misiniz?${
      notificationTitle
        ? ` "${notificationTitle}" başlıklı bildirim gönderilecektir.`
        : ""
    }`;

  const handleConfirm = async () => {
    try {
      setIsSending(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Gönderme işlemi başarısız:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending && !isLoading) {
      onClose();
    }
  };

  const isConfirmDisabled = isSending || isLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
              <Send className="h-4 w-4 text-blue-500" />
            </div>
            {defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-left">
            {defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bildirim Türü Bilgisi */}
          {notificationType && (
            <div
              className={`rounded-lg border p-3 ${
                notificationType === "EMAIL"
                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                  : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    notificationType === "EMAIL"
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-green-900 dark:text-green-100"
                  }`}
                >
                  Bildirim Türü:
                </span>
                <div className="flex items-center gap-2">
                  {notificationType === "EMAIL" ? (
                    <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Send className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                  <span
                    className={`font-bold ${
                      notificationType === "EMAIL"
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-green-900 dark:text-green-100"
                    }`}
                  >
                    {notificationType === "EMAIL" ? "E-posta" : "SMS"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Bu işlem geri alınamaz. Bildirim gönderildikten sonra iptal
              edilemez.
            </AlertDescription>
          </Alert>

          {/* Ek içerik için children */}
          {children}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSending || isLoading}
            className="w-full cursor-pointer sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
          >
            {(isSending || isLoading) && (
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
export const useSendConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    onConfirm: () => Promise<void> | void;
    notificationTitle?: string;
    notificationType?: string;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
  }>({
    onConfirm: () => {},
  });

  const openSendModal = (options: {
    onConfirm: () => Promise<void> | void;
    notificationTitle?: string;
    notificationType?: string;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const closeSendModal = () => {
    setIsOpen(false);
  };

  const SendModal = () => (
    <SendConfirmationModal
      isOpen={isOpen}
      onClose={closeSendModal}
      onConfirm={config.onConfirm}
      notificationTitle={config.notificationTitle}
      notificationType={config.notificationType}
      title={config.title}
      description={config.description}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      isLoading={config.isLoading}
    />
  );

  return {
    openSendModal,
    closeSendModal,
    SendModal,
  };
};

export default SendConfirmationModal;
