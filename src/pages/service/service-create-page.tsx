import { useNavigate } from "react-router-dom";
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

import { ArrowLeft, Wrench, Upload, Loader2, X } from "lucide-react";
import { useCreateService } from "@/hooks/use-service";
import { useState, useRef } from "react";
import type { ServiceRequest } from "@/types/service.types";
import {
  createServiceSchema,
  type CreateServiceFormData,
} from "@/validations/service.validation";

export default function ServiceCreatePage() {
  const navigate = useNavigate();
  const createServiceMutation = useCreateService();
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: undefined,
    },
    mode: "onTouched",
  });

  const handleIconSelect = (file: File) => {
    setSelectedIcon(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    form.setValue("icon", file);
  };

  const handleIconRemove = () => {
    setSelectedIcon(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    form.setValue("icon", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreateServiceFormData) => {
    const serviceData: ServiceRequest = {
      name: data.name,
      description: data.description,
      icon: data.icon || null,
    };

    createServiceMutation.mutate(serviceData, {
      onSuccess: () => {
        navigate("/services");
      },
    });
  };

  return (
    <div className="animate-page-fade space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/services")}
            className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Yeni Hizmet
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sisteme yeni hizmet ekleyin
            </p>
          </div>
        </div>
      </div>

      {/* Service Create Form */}
      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
          <CardTitle className="flex items-center text-gray-800 dark:text-white">
            <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            Hizmet Bilgileri
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
                          className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
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
                            className="group relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:border-blue-400 hover:from-blue-50 hover:to-blue-100 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700 dark:hover:border-blue-500 dark:hover:from-gray-700 dark:hover:to-gray-600"
                          >
                            {previewUrl ? (
                              <>
                                {/* Image Preview */}
                                <div className="relative">
                                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
                                    <img
                                      src={previewUrl}
                                      alt="Icon preview"
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
                                    {selectedIcon?.name}
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
                                  <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
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
                        placeholder="Hizmet açıklamasını giriniz..."
                        className="min-h-[120px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 border-t border-gray-100 pt-6 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/services")}
                  className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={createServiceMutation.isPending}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={createServiceMutation.isPending}
                  className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                  {createServiceMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Wrench className="mr-2 h-4 w-4" />
                      Hizmet Oluştur
                    </>
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
