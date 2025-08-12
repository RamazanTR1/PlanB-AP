import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSlider } from "@/hooks/use-slider";
import {
  sliderSchema,
  type SliderFormData,
} from "@/validations/slider.validation";
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
import { ImagePlus, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTagList } from "@/hooks/use-tag";
import { MultiSelect } from "@/components/multi-select";

export default function SliderCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateSlider();
  const { data: tagList } = useTagList("", 0, 100, "id,desc");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SliderFormData>({
    resolver: zodResolver(sliderSchema) as never,
    mode: "onChange",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: SliderFormData) => {
    await createMutation.mutateAsync({
      name: data.name.trim(),
      description: data.description.trim(),
      excerpt: (data.excerpt || "").trim(),
      tagIds: data.tagIds ?? [],
      image: data.image ?? null,
    });
    navigate("/sliders");
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <ImagePlus className="mr-3 h-8 w-8 text-blue-600" /> Yeni Slider
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Yeni bir slider kaydı oluşturun
          </p>
        </div>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Bilgiler
          </CardTitle>
          <CardDescription className="italic text-gray-600 dark:text-gray-300">
            Başlık, açıklama ve görsel ekleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ad</Label>
              <Input id="name" placeholder="Ad" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                rows={5}
                placeholder="Açıklama"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200">
                  Etiketler
                </Label>
                <MultiSelect
                  options={(tagList?.content || []).map((t) => ({
                    label: t.name,
                    value: String(t.id),
                  }))}
                  onValueChange={(values: string[]) => {
                    const nums = values.map((v) => Number(v));
                    (
                      register("tagIds").onChange as unknown as (e: {
                        target: { value: number[] };
                      }) => void
                    )({
                      target: { value: nums },
                    });
                  }}
                  defaultValue={[]}
                  placeholder="Etiket seçin"
                  maxCount={5}
                  className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Görsel
                </Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="border-gray-200 bg-white file:mr-4 file:rounded-md file:text-sm file:font-medium file:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:file:text-blue-100"
                    {...register("image")}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) setPreview(URL.createObjectURL(file));
                    }}
                  />
                  {preview && (
                    <div className="relative mt-2">
                      <img
                        src={preview}
                        alt="preview"
                        className="h-40 w-full rounded-md border border-gray-200 object-cover dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          const fileInput = document.getElementById(
                            "image",
                          ) as HTMLInputElement;
                          if (fileInput) fileInput.value = "";
                        }}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
