import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotificationCreate } from "@/hooks/use-notification";
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
import { Bell, Loader2, Plus, Mail, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationCreatePage() {
  const navigate = useNavigate();
  const createMutation = useNotificationCreate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema) as never,
    mode: "onChange",
  });

  const onSubmit = async (data: NotificationFormData) => {
    await createMutation.mutateAsync({
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.type,
    });
    navigate("/notifications");
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Bell className="mr-3 h-8 w-8 text-blue-600" /> Yeni Bildirim
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yeni bir bildirim oluşturun
          </p>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Bildirim Bilgileri
          </CardTitle>
          <CardDescription className="italic text-gray-600 dark:text-gray-300">
            Başlık, içerik ve tür bilgilerini girin
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
                onValueChange={(value: string) =>
                  setValue("type", value as "EMAIL" | "SMS")
                }
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
                disabled={createMutation.isPending}
                className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Oluştur
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
