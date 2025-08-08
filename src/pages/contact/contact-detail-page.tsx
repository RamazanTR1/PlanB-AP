import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, User, FileText, Calendar } from "lucide-react";
import type { Contact } from "@/types/contact.types";
import { useMemo } from "react";

export default function ContactDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const contact = location.state?.contact as Contact | undefined;

  const createdAtText = useMemo(() => {
    if (!contact?.createdAt) return "-";
    return new Date(contact.createdAt).toLocaleString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [contact?.createdAt]);

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="text-gray-700 transition-all duration-200 hover:scale-105 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-none dark:text-gray-200 dark:hover:bg-blue-400/20 dark:hover:text-blue-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri
          </Button>
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <FileText className="mr-3 h-8 w-8 text-blue-600" />
              Mesaj Detayı
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              #{id} numaralı iletişim mesajı
            </p>
          </div>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-800 dark:text-white">
            Gönderen Bilgileri
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Mesajı gönderen kişiye ait detaylar
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
              <User className="h-5 w-5 text-blue-700 dark:text-blue-200" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                İsim
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {contact?.name ?? "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Mail className="h-5 w-5 text-green-700 dark:text-green-200" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                E-posta
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {contact?.email ?? "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <FileText className="h-5 w-5 text-purple-700 dark:text-purple-200" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Konu
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {contact?.subject ?? "-"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <Calendar className="h-5 w-5 text-yellow-700 dark:text-yellow-200" />
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Gönderim
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {createdAtText}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-gray-800 dark:text-white">Mesaj</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Gönderilen mesaj içeriği
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-white/70 p-4 text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-100">
            {contact?.description ?? "-"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
