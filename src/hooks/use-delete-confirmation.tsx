import { useState } from "react";
import DeleteConfirmationModal, {
  type EntityType,
} from "@/components/confirm-delete";
import type { ReactNode } from "react";

export interface DeleteConfirmationModalProps {
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
  children?: ReactNode;
}

export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<
    Partial<DeleteConfirmationModalProps>
  >({});

  const openDeleteModal = (
    config: Partial<DeleteConfirmationModalProps> & {
      entityType: EntityType;
      onConfirm: () => Promise<void> | void;
    },
  ) => {
    setDeleteConfig(config);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setDeleteConfig({});
  };

  const DeleteModal = () => (
    <DeleteConfirmationModal
      {...deleteConfig}
      isOpen={isOpen}
      onClose={closeDeleteModal}
      entityType={deleteConfig.entityType!}
      onConfirm={deleteConfig.onConfirm!}
    />
  );

  return {
    openDeleteModal,
    closeDeleteModal,
    DeleteModal,
    isOpen,
  };
}

export default useDeleteConfirmation;
