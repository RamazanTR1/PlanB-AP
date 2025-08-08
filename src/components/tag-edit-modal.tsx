import { useEffect } from "react";
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
import { Tag as TagIcon, Loader2 } from "lucide-react";
import { useUpdateTag } from "@/hooks/use-tag";
import {
  updateTagSchema,
  type UpdateTagFormData,
} from "@/validations/tag.validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TagEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: {
    id: number;
    name: string;
  } | null;
}

export default function TagEditModal({
  isOpen,
  onClose,
  tag,
}: TagEditModalProps) {
  const updateTagMutation = useUpdateTag(tag?.id || 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateTagFormData>({
    resolver: zodResolver(updateTagSchema),
    mode: "onChange",
  });

  // Tag değiştiğinde form'u reset et
  useEffect(() => {
    if (tag) {
      reset({ name: tag.name });
    }
  }, [tag, reset]);

  const onSubmit = async (data: UpdateTagFormData) => {
    if (!tag) return;

    try {
      await updateTagMutation.mutateAsync({ name: data.name.trim() });
      onClose();
    } catch (error) {
      console.error("Tag güncelleme hatası:", error);
    }
  };

  const handleClose = () => {
    if (!updateTagMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <TagIcon className="h-4 w-4 text-green-600" />
            </div>
            Etiket Düzenle
          </DialogTitle>
          <DialogDescription>
            "{tag?.name}" etiketini düzenlemek için aşağıdaki formu kullanın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Etiket Adı</Label>
            <Input
              id="tag-name"
              placeholder="Etiket adını girin..."
              {...register("name")}
              disabled={updateTagMutation.isPending}
              className={`transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateTagMutation.isPending}
              className="w-full cursor-pointer sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || updateTagMutation.isPending}
              className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white transition-all duration-200 hover:from-green-700 hover:to-emerald-700 sm:w-auto"
            >
              {updateTagMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
