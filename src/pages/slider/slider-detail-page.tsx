import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, ArrowLeft, Tags } from "lucide-react";
import { useSliderById } from "@/hooks/use-slider";
import LoaderDots from "@/components/ui/loader-dots";

export default function SliderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sliderId = Number(id);
  const { data: slider, isLoading, error } = useSliderById(sliderId);

  if (isLoading)
    return <LoaderDots message="Slider yükleniyor..." heightClass="h-64" />;
  if (error || !slider)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Image className="mx-auto mb-4 h-10 w-10 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-300">Slider bulunamadı</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
          </Button>
        </div>
      </div>
    );

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Image className="mr-3 h-8 w-8 text-blue-600" /> Slider Detayı
          </h1>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
      </div>

      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            {slider.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="w-full md:w-72">
              {slider.image ? (
                <img
                  src={slider.image}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white">
                  {slider.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {slider.description}
              </p>
              {slider.excerpt && (
                <p className="italic text-gray-500 dark:text-gray-400">
                  {slider.excerpt}
                </p>
              )}
              {slider.tagIds?.length ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Tags className="h-4 w-4 text-gray-500" />
                  {slider.tagIds.map((t) => (
                    <span
                      key={t.id}
                      className="rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
