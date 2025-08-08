import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Wrench,
  Info,
  Loader2,
  Eye,
} from "lucide-react";
import { useServiceById, useDeleteServiceById } from "@/hooks/use-service";
import { useDeleteConfirmation } from "@/components/confirm-delete";

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = id ? parseInt(id, 10) : 0;

  const { data: service, isLoading, error } = useServiceById(serviceId);
  const deleteServiceMutation = useDeleteServiceById();
  const { openDeleteModal } = useDeleteConfirmation();

  const handleDelete = () => {
    openDeleteModal({
      entityType: "service" as any,
      title: "Hizmeti Sil",
      description: `"${service?.name}" hizmetini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      onConfirm: () => {
        deleteServiceMutation.mutate(serviceId, {
          onSuccess: () => {
            navigate("/services");
          },
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="relative">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4 dark:from-blue-900 dark:to-indigo-900">
              <Wrench className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="absolute -inset-2 animate-ping rounded-xl bg-gradient-to-br from-blue-200 to-indigo-200 opacity-50 dark:from-blue-800 dark:to-indigo-800"></div>
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">
            Hizmet yükleniyor...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 p-4 dark:bg-red-900/20">
            <Wrench className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hizmet Bulunamadı
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Hizmet detayları yüklenirken bir sorun oluştu.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={() => navigate("/services")}
              variant="outline"
              className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
            >
              Yeniden Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 p-4 dark:bg-gray-800">
            <Eye className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hizmet Bulunamadı
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Bu ID'ye sahip bir hizmet mevcut değil.
          </p>
          <Button
            onClick={() => navigate("/services")}
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hizmetlere Geri Dön
          </Button>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate("/services")}
              className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
          </div>

          {/* Main Content Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Left Section - Service Info */}
            <div className="flex flex-1 items-start gap-4 md:gap-6">
              {/* Service Icon */}
              <div className="relative flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-lg ring-4 ring-white md:h-20 md:w-20">
                  {service.icon && typeof service.icon === "string" ? (
                    <img
                      src={service.icon}
                      alt={service.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Icon yüklenemezse fallback'e geç
                        (e.target as HTMLImageElement).style.display = "none";
                        const fallbackElement = (e.target as HTMLImageElement)
                          .nextElementSibling as HTMLElement;
                        if (fallbackElement) {
                          fallbackElement.classList.remove("hidden");
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 ${
                      service.icon && typeof service.icon === "string"
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <span className="text-lg font-bold text-white md:text-xl">
                      {service.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-green-500 shadow-sm md:h-7 md:w-7">
                  <div className="h-full w-full animate-pulse rounded-full bg-green-400"></div>
                </div>
              </div>

              {/* Service Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
                  <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
                    {service.name}
                  </h1>
                </div>
                <div className="mb-3 flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <p className="text-base md:text-lg">{service.description}</p>
                </div>
                {/* Status Badge */}
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Aktif Hizmet
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex flex-row gap-3 md:min-w-fit md:flex-col">
              <Button
                onClick={() => navigate(`/services/edit/${serviceId}`)}
                variant="outline"
                className="flex flex-1 items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-none dark:bg-gray-800/90 dark:text-gray-200 md:flex-none"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Düzenle</span>
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex flex-1 items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 md:flex-none"
                disabled={deleteServiceMutation.isPending}
              >
                {deleteServiceMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Sil</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Service Information */}
        <Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
              <Wrench className="mr-2 h-5 w-5 text-blue-600" />
              Hizmet Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Hizmet ID
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  #{service.id}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Hizmet Adı
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {service.name}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="border-0 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-900 dark:text-white">
              <Info className="mr-2 h-5 w-5 text-blue-600" />
              Detaylar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Açıklama
                </span>
                <p className="mt-2 text-gray-900 dark:text-white">
                  {service.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
