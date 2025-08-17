import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CalendarDays, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePortfolio } from "@/hooks/use-portfolio";
import {
  createPortfolioSchema,
  type CreatePortfolioFormData,
} from "@/validations/portfolio.validation";
import { toBackendDateTime } from "@/utils/date";
import { useState } from "react";
import { toast } from "sonner";
import type { PortfolioRequest } from "@/types/portfolio.types";

export default function PortfolioCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreatePortfolio();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreatePortfolioFormData>({
    resolver: zodResolver(createPortfolioSchema) as never,
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      excerpt: "",
      outSourceLink: "",
      publishDate: "",
    },
  });

  const [coverIndex, setCoverIndex] = useState<number>(0);
  const watchFiles = watch("assets") as FileList | undefined;

  const removeSelectedFile = (removeIndex: number) => {
    const current = (watchFiles as FileList | undefined) ?? undefined;
    if (!current) return;
    const filesArr = Array.from(current).filter(
      (_, idx) => idx !== removeIndex,
    );
    const dt = new DataTransfer();
    filesArr.slice(0, 5).forEach((f) => dt.items.add(f));
    setValue("assets", dt.files as unknown as FileList);
    if (filesArr.length === 0) {
      setCoverIndex(0);
    } else if (removeIndex === coverIndex) {
      setCoverIndex(0);
    } else if (removeIndex < coverIndex) {
      setCoverIndex(Math.max(0, coverIndex - 1));
    }
  };

  const onSubmit = async (data: CreatePortfolioFormData) => {
    console.log(data);
    const files = watchFiles ?? undefined;

    // PortfolioRequest objesi oluştur
    const request: PortfolioRequest = {
      name: data.name.trim(),
      description: data.description.trim(),
      excerpt: (data.excerpt || "").trim(),
      outSourceLink: (data.outSourceLink || "").trim(),
      publishDate: toBackendDateTime(data.publishDate),
      assets:
        files && files.length > 0
          ? Array.from(files).map((file, index) => ({
              file,
              isCovered: index === coverIndex,
            }))
          : undefined,
    };

    await createMutation.mutateAsync(request);
    navigate("/portfolios");
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
            Yeni Portfolio
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yeni bir portfolio kaydı oluşturun
          </p>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Bilgiler
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Portfolio adı, açıklama ve yayın tarihini girin
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
              <Label htmlFor="files">Görseller (en fazla 5 adet)</Label>
              <Input
                id="files"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const selected = Array.from(files);
                    if (selected.length > 5) {
                      toast.warning("En fazla 5 görsel yükleyebilirsiniz");
                    }
                    const limited = selected.slice(0, 5);
                    const dt = new DataTransfer();
                    limited.forEach((f) => dt.items.add(f));
                    setValue("assets", dt.files as unknown as FileList);
                    setCoverIndex(0);
                  }
                }}
              />

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
                        <div className="flex items-center gap-2 pr-2">
                          <img
                            alt={file.name}
                            className="h-12 w-12 rounded object-cover"
                            src={(() => {
                              const url = URL.createObjectURL(file);
                              return url;
                            })()}
                            onLoad={(ev) => {
                              const img = ev.currentTarget as HTMLImageElement;
                              URL.revokeObjectURL(img.src);
                            }}
                          />
                          <span
                            className="max-w-[140px] truncate"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cover"
                            className="h-4 w-4"
                            checked={coverIndex === idx}
                            onChange={() => setCoverIndex(idx)}
                          />
                          <button
                            type="button"
                            className="rounded border px-2 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeSelectedFile(idx);
                            }}
                          >
                            Kaldır
                          </button>
                        </div>
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
                disabled={!isValid || createMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
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
