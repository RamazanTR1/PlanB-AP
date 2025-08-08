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

export default function PortfolioCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreatePortfolio();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePortfolioFormData>({
    resolver: zodResolver(createPortfolioSchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      excerpt: "",
      outSourceLink: "",
      publishDate: "",
    },
  });

  const [coverIndex, setCoverIndex] = useState<number>(0);
  const watchFiles = watch("files") as unknown as FileList | undefined;

  const filesRegister = register("files");

  const onSubmit = async (data: CreatePortfolioFormData) => {
    const files = (data.files as unknown as FileList | undefined) ?? undefined;
    const assetsMeta = files
      ? Array.from(files).map((_, idx) => ({ isCovered: idx === coverIndex }))
      : [];

    await createMutation.mutateAsync({
      title: data.title.trim(),
      description: data.description.trim(),
      excerpt: (data.excerpt || "").trim(),
      outSourceLink: (data.outSourceLink || "").trim(),
      publishDate: toBackendDateTime(data.publishDate),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assets: assetsMeta as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(files ? ({ files } as any) : {}),
    } as unknown as any);
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
            Başlık, açıklama ve yayın tarihini girin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input id="title" placeholder="Başlık" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
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
              <Label htmlFor="files">Görseller (çoklu seçilebilir)</Label>
              <Input
                id="files"
                type="file"
                accept="image/*"
                multiple
                {...filesRegister}
                onChange={(e) => {
                  filesRegister.onChange(e);
                  setCoverIndex(0);
                }}
              />

              {watchFiles && watchFiles.length > 0 ? (
                <div className="mt-2 rounded-md border border-dashed border-border p-3">
                  <div className="mb-2 text-sm font-medium text-foreground">
                    Kapak görseli seçin
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {Array.from(watchFiles).map((file, idx) => (
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
