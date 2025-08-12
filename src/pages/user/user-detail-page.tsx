import { useParams, useNavigate } from "react-router-dom";
import LoaderDots from "@/components/ui/loader-dots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  Mail,
  Shield,
  Clock,
} from "lucide-react";
import { useUserById } from "@/hooks/use-user";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = id ? parseInt(id, 10) : 0;

  const { data: user, isLoading, error } = useUserById(userId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderDots message="Kullanıcı yükleniyor..." />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <User className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Kullanıcı bulunamadı
          </h3>
          <p className="mb-6 max-w-md text-gray-600 dark:text-gray-300">
            Belirtilen kullanıcı mevcut değil veya silinmiş olabilir.
          </p>
          <Button
            onClick={() => navigate("/users")}
            className="transform bg-black transition-all duration-200 hover:scale-105 hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kullanıcı Listesine Dön
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 shadow-sm dark:border-gray-600 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
        <div className="space-y-6">
          {/* Top Section - Back Button */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Left Section - User Info */}
            <div className="flex flex-1 items-start gap-4 md:gap-6">
              {/* User Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg ring-4 ring-white md:h-20 md:w-20">
                  <User className="h-8 w-8 text-white md:h-10 md:w-10" />
                </div>
                {/* Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white shadow-sm md:h-7 md:w-7 ${user.active ? "bg-green-500" : "bg-gray-400"}`}
                >
                  {user.active && (
                    <div className="h-full w-full animate-pulse rounded-full bg-green-400"></div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
                  <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                    {user.username}
                  </h1>
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400 md:text-xl">
                    #{user.id}
                  </span>
                </div>
                <div className="mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <p className="truncate text-base md:text-lg">{user.email}</p>
                </div>
                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${user.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${user.active ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                    {user.active ? "Aktif Kullanıcı" : "Pasif Kullanıcı"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-row gap-3 md:min-w-fit md:flex-col">
              <Button
                variant="outline"
                className="flex flex-1 items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-none dark:bg-gray-800/90 dark:text-gray-200 md:flex-none"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Düzenle</span>
              </Button>
              <Button
                variant="destructive"
                className="flex flex-1 items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 md:flex-none"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Sil</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* User Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Quick Info Card */}
        <Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Temel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Kullanıcı ID
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  #{user.id}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Kullanıcı Adı
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.username}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  E-posta
                </span>
                <span className="flex items-center text-lg font-semibold text-blue-600 dark:text-blue-400">
                  <Mail className="mr-1 h-4 w-4" />
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Durum
                </span>
                <span className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold shadow-sm ${
                      user.active
                        ? "border border-green-200 bg-green-100 text-green-800"
                        : "border border-gray-200 bg-gray-100 text-gray-800"
                    } `}
                  >
                    {user.active ? "🟢 Aktif" : "⚪ Pasif"}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Card */}
        <Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
              <Clock className="mr-2 h-5 w-5 text-purple-600" />
              Zaman Çizelgesi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-start space-x-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:border-blue-700 dark:from-blue-900/30 dark:to-blue-800/30">
                  <div className="mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-800">
                        Hesap Oluşturuldu
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-start space-x-4 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-4 dark:border-green-700 dark:from-green-900/30 dark:to-green-800/30">
                  <div className="mt-2 h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Son Güncelleme
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats or Additional Info Card */}
      <Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-xl text-gray-900 dark:text-white">
            <Shield className="mr-3 h-6 w-6 text-indigo-600" />
            Hesap Durumu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center dark:border-blue-700 dark:from-blue-900/30 dark:to-blue-800/30">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                Kullanıcı Profili
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tam Erişim
              </p>
            </div>

            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 text-center dark:border-green-700 dark:from-green-900/30 dark:to-green-800/30">
              <div
                className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${user.active ? "bg-green-500" : "bg-gray-400"}`}
              >
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                Hesap Durumu
              </h3>
              <p
                className={`text-sm font-semibold ${user.active ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}
              >
                {user.active ? "Aktif ve Güvenli" : "Devre Dışı"}
              </p>
            </div>

            <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center dark:border-purple-700 dark:from-purple-900/30 dark:to-purple-800/30">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                Üyelik Süresi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {Math.floor(
                  (new Date().getTime() - new Date(user.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{" "}
                gün
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
