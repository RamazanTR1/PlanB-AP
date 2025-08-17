import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { useNotificationById } from "@/hooks/use-notification";
import LoaderDots from "@/components/ui/loader-dots";

export default function NotificationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notificationId = Number(id);
  const { data: notification, isLoading, error } = useNotificationById(notificationId);

  if (isLoading)
    return <LoaderDots message="Bildirim yükleniyor..." heightClass="h-64" />;
  if (error || !notification)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Bell className="mx-auto mb-4 h-10 w-10 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-300">Bildirim bulunamadı</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
          </Button>
        </div>
      </div>
    );

  const getTypeBadge = (type: string) => {
    return type === "EMAIL" ? (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
        <Mail className="mr-1 h-3 w-3" />
        E-posta
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
        <MessageSquare className="mr-1 h-3 w-3" />
        SMS
      </Badge>
    );
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Bell className="mr-3 h-8 w-8 text-blue-600" /> Bildirim Detayı
          </h1>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
      </div>

      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            {notification.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bildirim Türü:
                </span>
                {getTypeBadge(notification.type)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                ID: {notification.id}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                İçerik
              </h3>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {notification.content}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
