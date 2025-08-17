import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { usePortfolioById, useUpdatePortfolio } from "@/hooks/use-portfolio";
import {
  updatePortfolioSchema,
  type UpdatePortfolioFormData,
} from "@/validations/portfolio.validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toBackendDateTime } from "@/utils/date";
import type { PortfolioRequest } from "@/types/portfolio.types";

export default function PortfolioEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const portfolioId = Number(id);
  const { data } = usePortfolioById(portfolioId);
  const updateMutation = useUpdatePortfolio(portfolioId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdatePortfolioFormData>({
    resolver: zodResolver(updatePortfolioSchema) as never,
    mode: "onChange",
  });

  const [coverIndex, setCoverIndex] = useState<number>(0);
  const watchFiles = watch("assets") as FileList | undefined;

  useEffect(() => {
    if (data) {
      // Existing cover index from assets
      const existingCoverIdx =
        data.assets?.findIndex((asset) => asset.isCovered) ?? 0;
      setCoverIndex(existingCoverIdx >= 0 ? existingCoverIdx : 0);
      reset({
        name: data.name as unknown as string,
        description: data.description,
        excerpt: data.excerpt,
        outSourceLink: data.outSourceLink,
        publishDate: data.publishDate?.slice(0, 10),
      });
    }
  }, [data, reset]);

  const onSubmit = async (form: UpdatePortfolioFormData) => {
    const files = (watchFiles as FileList | undefined) ?? undefined;

    // PortfolioRequest objesi oluştur
    const request: PortfolioRequest = {
      name: (form.name as unknown as string).trim(),
      description: form.description.trim(),
      excerpt: (form.excerpt || "").trim(),
      outSourceLink: (form.outSourceLink || "").trim(),
      publishDate: toBackendDateTime(form.publishDate),
      assets:
        files && files.length > 0
          ? Array.from(files).map((file, index) => ({
              asset: file.name,
              isCovered: index === coverIndex,
            }))
          : data?.assets && data.assets.length > 0
            ? data.assets.map((asset, index) => ({
                asset: asset.asset,
                isCovered: index === coverIndex,
              }))
            : undefined,
    };

    await updateMutation.mutateAsync(request);
    navigate(-1);
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
            Portfolio Düzenle
          </h1>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Bilgiler
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Portfolyo bilgilerini güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Başlık</Label>
              <Input id="name" placeholder="Başlık" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publishDate">Yayın Tarihi</Label>
                <Input
                  id="publishDate"
                  type="date"
                  {...register("publishDate")}
                />
                {errors.publishDate && (
                  <p className="text-sm text-red-500">
                    {errors.publishDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="outSourceLink">Dış Bağlantı (opsiyonel)</Label>
                <Input
                  id="outSourceLink"
                  placeholder="https://..."
                  {...register("outSourceLink")}
                />
                {errors.outSourceLink && (
                  <p className="text-sm text-red-500">
                    {errors.outSourceLink.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Özet (opsiyonel)</Label>
              <Input
                id="excerpt"
                placeholder="Kısa özet"
                {...register("excerpt")}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-500">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Detaylı açıklama"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Görselleri Güncelle (opsiyonel)</Label>
              <Input
                id="files"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    setValue("assets", files);
                    setCoverIndex(0);
                  }
                }}
              />

              {/* Cover selector: either from new files or existing assets */}
              {watchFiles && (watchFiles as FileList).length > 0 ? (
                <div className="mt-2 rounded-md border border-dashed border-border p-3">
                  <div className="mb-2 text-sm font-medium text-foreground">
                    Kapak görseli seçin
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from(watchFiles as FileList).map((file, idx) => (
                      <label
                        key={idx}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-2 text-sm transition-colors ${
                          coverIndex === idx
                            ? "border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <span className="truncate pr-2" title={file.name}>
                          {file.name}
                        </span>
                        <input
                          type="radio"
                          name="cover"
                          className="h-4 w-4"
                          checked={coverIndex === idx}
                          onChange={() => setCoverIndex(idx)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : data?.assets && data.assets.length > 0 ? (
                <div className="mt-2 rounded-md border border-dashed border-border p-3">
                  <div className="mb-2 text-sm font-medium text-foreground">
                    Kapak görseli seçin (mevcut görseller)
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {data.assets.map((_, idx) => (
                      <label
                        key={idx}
                        className={`flex cursor-pointer items-center justify-between rounded-md border p-2 text-sm transition-colors ${
                          coverIndex === idx
                            ? "border-blue-400 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <span className="truncate pr-2">Asset #{idx + 1}</span>
                        <input
                          type="radio"
                          name="cover-existing"
                          className="h-4 w-4"
                          checked={coverIndex === idx}
                          onChange={() => setCoverIndex(idx)}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}
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
