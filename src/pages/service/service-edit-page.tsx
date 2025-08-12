import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Wrench, Loader2, Upload, X } from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";
import { useUpdateService, useServiceById } from "@/hooks/use-service";
import { useState, useEffect, useRef } from "react";
import type { ServiceRequest } from "@/types/service.types";
import {
  updateServiceSchema,
  type UpdateServiceFormData,
} from "@/validations/service.validation";

export default function ServiceEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const serviceId = parseInt(id || "0");

  const { data: service, isLoading: isLoadingService } =
    useServiceById(serviceId);
  const updateServiceMutation = useUpdateService(serviceId);

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
    },
    mode: "onChange",
  });

  // Form'u service verisi geldiğinde doldur
  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description,
        icon: undefined,
      });

      // Existing icon preview
      if (service.icon && typeof service.icon === "string") {
        const preview = URL.createObjectURL(new Blob([service.icon]));
        setPreviewUrl(preview);
      }
    }
  }, [service, form]);

  const handleIconSelect = (file: File) => {
    setSelectedIcon(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    form.setValue("icon", file);
  };

  const handleIconRemove = () => {
    setSelectedIcon(null);
    setPreviewUrl(null);
    form.setValue("icon", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: UpdateServiceFormData) => {
    const serviceData: ServiceRequest = {
      name: data.name,
      description: data.description,
      icon: selectedIcon || null,
    };

    updateServiceMutation.mutate(serviceData, {
      onSuccess: () => {
        navigate(`/services/${serviceId}`);
      },
    });
  };

  if (isLoadingService) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderDots message="Hizmet yükleniyor..." />
      </div>
    );
  }

  if (!service) {
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
            Düzenlemek istediğiniz hizmet bulunamadı.
          </p>
          <Button
            onClick={() => navigate("/services")}
            className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white transition-all duration-200 hover:from-emerald-700 hover:to-teal-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hizmetlere Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-fade space-y-6">
      {/* Header */}
      <div className="animate-slide-up flex items-center justify-between">
        <Button
          onClick={() => navigate("/services")}
          className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white transition-all duration-200 hover:from-emerald-700 hover:to-teal-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Hizmetlere Geri Dön
        </Button>
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Wrench className="mr-3 h-8 w-8 text-emerald-600" />
            Hizmet Düzenle
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            <b>{service.name}</b> hizmetinin bilgilerini güncelleyin
          </p>
        </div>
      </div>

      {/* Service Edit Form */}
      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
          <CardTitle className="flex items-center text-gray-800 dark:text-white">
            <div className="mr-3 rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900">
              <Wrench className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            Hizmet Bilgilerini Güncelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Hizmet Adı
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Hizmet adını giriniz"
                          {...field}
                          className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-emerald-500 dark:border-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Icon Upload Field */}
                <FormField
                  control={form.control}
                  name="icon"
                  render={() => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Hizmet İkonu
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleIconSelect(file);
                              }
                            }}
                            className="hidden"
                          />

                          {/* Upload Area with Preview */}
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="group relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:border-emerald-400 hover:from-emerald-50 hover:to-emerald-100 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700 dark:hover:border-emerald-500 dark:hover:from-gray-700 dark:hover:to-gray-600"
                          >
                            {previewUrl ? (
                              <>
                                {/* Image Preview */}
                                <div className="relative">
                                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                                    <img
                                      src={previewUrl}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleIconRemove();
                                    }}
                                    className="absolute -right-2 -top-2 h-7 w-7 rounded-full p-0 shadow-lg"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="mt-3 text-center">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {selectedIcon?.name || "Mevcut İkon"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Değiştirmek için tıklayın
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* Upload Icon */}
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 group-hover:scale-110 dark:bg-gray-700">
                                  <Upload className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />
                                </div>
                                <div className="mt-4 text-center">
                                  <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                    Hizmet İkonu Yükleyin
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    PNG, JPG, SVG formatlarında
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Maksimum 5MB
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="animate-fade-in">
                    <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                      Hizmet Açıklaması
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Hizmet açıklamasını giriniz"
                        {...field}
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus:border-transparent focus:ring-2 focus:ring-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/services`)}
                  className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={updateServiceMutation.isPending}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
                >
                  {updateServiceMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    "Hizmeti Güncelle"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
