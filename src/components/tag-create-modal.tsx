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
import { useCreateTag } from "@/hooks/use-tag";
import {
  createTagSchema,
  type CreateTagFormData,
} from "@/validations/tag.validation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface TagCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagCreateModal({
  isOpen,
  onClose,
}: TagCreateModalProps) {
  const createTagMutation = useCreateTag();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CreateTagFormData) => {
    await createTagMutation.mutateAsync({ name: data.name.trim() });
    reset();
    onClose();
  };

  const handleClose = () => {
    if (!createTagMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <TagIcon className="h-4 w-4 text-blue-600" />
            </div>
            Yeni Etiket Oluştur
          </DialogTitle>
          <DialogDescription>
            Yeni bir etiket oluşturmak için aşağıdaki formu doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Etiket Adı</Label>
            <Input
              id="tag-name"
              placeholder="Etiket adını girin..."
              {...register("name")}
              disabled={createTagMutation.isPending}
              className={`transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
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
              disabled={createTagMutation.isPending}
              className="w-full cursor-pointer sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || createTagMutation.isPending}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
            >
              {createTagMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Etiket Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
