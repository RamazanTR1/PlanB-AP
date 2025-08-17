import { useParams, useNavigate } from "react-router-dom";
import { usePortfolioById } from "@/hooks/use-portfolio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Calendar,
  FileText,
  Image,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useDeletePortfolioById } from "@/hooks/use-portfolio";

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: portfolio, isLoading, error } = usePortfolioById(Number(id));
  const deletePortfolioMutation = useDeletePortfolioById();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const handleDelete = () => {
    if (!portfolio) return;

    openDeleteModal({
      entityType: "portfolio",
      entityName: portfolio.name,
      requireTextConfirmation: true,
      confirmationText: portfolio.name,
      onConfirm: async () => {
        await deletePortfolioMutation.mutateAsync(Number(id));
        navigate("/portfolios");
      },
      isLoading: deletePortfolioMutation.isPending,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="relative">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-4 dark:from-blue-900 dark:to-indigo-900">
              <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="absolute -inset-2 animate-ping rounded-xl bg-gradient-to-br from-blue-200 to-indigo-200 opacity-50 dark:from-blue-800 dark:to-indigo-800"></div>
          </div>
          <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">
            Portfolio yükleniyor...
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
            <CalendarDays className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hata Oluştu
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Portfolio detayları yüklenirken bir sorun oluştu.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={() => navigate("/portfolios")}
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

  if (!portfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 p-4 dark:bg-gray-800">
            <CalendarDays className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Bulunamadı
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Bu ID'ye sahip bir portfolio mevcut değil.
          </p>
          <Button
            onClick={() => navigate("/portfolios")}
            className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Portfoliolara Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-page-fade space-y-6">
        {/* Header */}
        <div className="animate-slide-up flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/portfolios")}
              className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-700/90 dark:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
            <div>
              <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
                Portfolio Detayı
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {portfolio.name}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate(`/portfolios/edit/${id}`)}
              variant="outline"
              className="flex items-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-700/90 dark:text-gray-200"
            >
              <Edit className="h-4 w-4" />
              <span>Düzenle</span>
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-105"
              disabled={deletePortfolioMutation.isPending}
            >
              {deletePortfolioMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>Sil</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Portfolio Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Portfolio Header Card */}
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {portfolio.name}
                    </CardTitle>
                    <CardDescription className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                      {portfolio.excerpt}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    ID: #{portfolio.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                    {portfolio.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Images */}
            {portfolio.assets && portfolio.assets.length > 0 && (
              <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
                    <Image className="mr-2 h-5 w-5 text-green-600" />
                    Portfolio Görselleri
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {portfolio.assets.length} görsel
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {portfolio.assets.map((asset, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white/70 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/40"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={asset.asset}
                            alt={`Portfolio görsel ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          {asset.isCovered && (
                            <div className="absolute right-2 top-2">
                              <Badge className="bg-blue-600 text-white">
                                Kapak
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Görsel {idx + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Portfolio Details */}
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  Detaylar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Yayın Tarihi
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(portfolio.publishDate)}
                    </span>
                  </div>

                  {portfolio.outSourceLink && (
                    <div className="rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Dış Bağlantı
                        </span>
                        <a
                          href={portfolio.outSourceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <span className="text-sm">Görüntüle</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Görsel Sayısı
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {portfolio.assets?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Eye className="mr-2 h-5 w-5 text-orange-600" />
                  İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Başlık Uzunluğu
                    </span>
                    <Badge variant="outline">
                      {portfolio.name.length} karakter
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Açıklama Uzunluğu
                    </span>
                    <Badge variant="outline">
                      {portfolio.description.length} karakter
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Özet Uzunluğu
                    </span>
                    <Badge variant="outline">
                      {portfolio.excerpt.length} karakter
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal />
    </>
  );
}
