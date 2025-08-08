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
import { useUpdatePartner } from "@/hooks/use-partner";
import {
  updatePartnerSchema,
  type UpdatePartnerFormData,
} from "@/validations/partner.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PartnerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: { id: number; name: string; icon: string } | null;
}

export default function PartnerEditModal({
  isOpen,
  onClose,
  partner,
}: PartnerEditModalProps) {
  const updatePartnerMutation = useUpdatePartner(partner?.id || 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdatePartnerFormData>({
    resolver: zodResolver(updatePartnerSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (partner) {
      reset({ name: partner.name });
    }
  }, [partner, reset]);

  const onSubmit = async (data: UpdatePartnerFormData) => {
    const file = (data.icon as unknown as FileList | undefined)?.[0];
    await updatePartnerMutation.mutateAsync({
      name: data.name.trim(),
      icon: file,
    });
    onClose();
  };

  const handleClose = () => {
    if (!updatePartnerMutation.isPending) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Building2 className="h-4 w-4 text-green-600" />
            </div>
            Partner Düzenle
          </DialogTitle>
          <DialogDescription>
            "{partner?.name}" partnerini düzenleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partner-name">Partner Adı</Label>
            <Input
              id="partner-name"
              placeholder="Partner adını girin..."
              {...register("name")}
              disabled={updatePartnerMutation.isPending}
              className={`transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
              }`}
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner-icon">İkonu Güncelle (opsiyonel)</Label>
            <Input
              id="partner-icon"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              {...register("icon")}
              disabled={updatePartnerMutation.isPending}
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
              disabled={updatePartnerMutation.isPending}
              className="w-full cursor-pointer sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={!isValid || updatePartnerMutation.isPending}
              className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white transition-all duration-200 hover:from-green-700 hover:to-emerald-700 sm:w-auto"
            >
              {updatePartnerMutation.isPending && (
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
