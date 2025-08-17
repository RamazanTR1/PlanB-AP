import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificationById, useNotificationUpdate } from "@/hooks/use-notification";
import {
  notificationSchema,
  type NotificationFormData,
} from "@/validations/notification.validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Loader2, Save, Mail, MessageSquare } from "lucide-react";
import { useEffect } from "react";

export default function NotificationEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const notificationId = Number(id);
  const { data } = useNotificationById(notificationId);
  const updateMutation = useNotificationUpdate(notificationId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema) as never,
    mode: "onChange",
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        content: data.content,
        type: data.type,
      });
    }
  }, [data, reset]);

  const onSubmit = async (form: NotificationFormData) => {
    await updateMutation.mutateAsync({
      title: form.title.trim(),
      content: form.content.trim(),
      type: form.type,
    });
    navigate(-1);
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Bell className="mr-3 h-8 w-8 text-blue-600" /> Bildirim Düzenle
          </h1>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Bildirim Bilgileri
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Bildirim bilgilerini güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                placeholder="Bildirim başlığı"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <Textarea
                id="content"
                rows={6}
                placeholder="Bildirim içeriği"
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Bildirim Türü</Label>
              <Select
                defaultValue={data?.type}
                onValueChange={(value: string) => setValue("type", value as "EMAIL" | "SMS")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bildirim türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      E-posta
                    </div>
                  </SelectItem>
                  <SelectItem value="SMS">
                    <div className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={!isValid || updateMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
