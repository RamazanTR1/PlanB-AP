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
import { Loader2, Building2 } from "lucide-react";
import { useCreatePartner } from "@/hooks/use-partner";
import {
  createPartnerSchema,
  type CreatePartnerFormData,
} from "@/validations/partner.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface PartnerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerCreateModal({
  isOpen,
  onClose,
}: PartnerCreateModalProps) {
  const createPartnerMutation = useCreatePartner();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePartnerFormData>({
    resolver: zodResolver(createPartnerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CreatePartnerFormData) => {
    const file = (data.icon as unknown as FileList)[0];
    await createPartnerMutation.mutateAsync({
      name: data.name.trim(),
      icon: file,
    });
    reset();
    onClose();
  };

  const handleClose = () => {
    if (!createPartnerMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            Yeni Partner Oluştur
          </DialogTitle>
          <DialogDescription>Yeni bir partner ekleyin.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-name">Partner Adı</Label>
            <Input
              id="partner-name"
              placeholder="Partner adını girin..."
              {...register("name")}
              disabled={createPartnerMutation.isPending}
              className={`transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-icon">İkon (PNG, JPG, SVG, WEBP)</Label>
            <Input
              id="partner-icon"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              {...register("icon")}
              disabled={createPartnerMutation.isPending}
            />
            {errors.icon && (
              <p className="text-sm text-red-500">
                {String(errors.icon.message)}
              </p>
            )}
          </div>

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPartnerMutation.isPending}
              className="w-full cursor-pointer sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || createPartnerMutation.isPending}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
            >
              {createPartnerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Partner Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
