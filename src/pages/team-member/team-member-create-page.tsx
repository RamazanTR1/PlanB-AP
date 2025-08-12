import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Save,
  Users,
  User,
  Quote,
  Upload,
  X,
  Loader2,
  Camera,
  CheckCircle,
  Globe,
} from "lucide-react";
import { useCreateTeamMember } from "@/hooks/use-team-member";
import type { TeamMemberRequest } from "@/types/team-member-types";
import {
  teamMemberSchema,
  type TeamMemberFormData,
} from "@/validations/team-member.validation";

export default function TeamMemberCreatePage() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const createTeamMemberMutation = useCreateTeamMember();

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      title: "",
      quote: "",
      linkedinUrl: "",
      orderNumber: 1,
      profilePhoto: null,
    },
    mode: "onTouched",
  });

  const watchedValues = form.watch();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageLoading(true);

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert("Profil fotoğrafı 5MB'dan küçük olmalıdır");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Sadece JPEG, PNG veya WebP formatında dosya yükleyebilirsiniz");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setIsImageLoading(false);
      };
      reader.readAsDataURL(file);
      form.setValue("profilePhoto", file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    form.setValue("profilePhoto", null);
    const fileInput = document.getElementById(
      "profilePhoto",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      const request: TeamMemberRequest = {
        name: data.name,
        title: data.title,
        quote: data.quote,
        orderNumber: data.orderNumber,
        linkedinUrl: data.linkedinUrl || null,
        profilePhoto: data.profilePhoto || null,
      };
      await createTeamMemberMutation.mutateAsync(request);
      navigate("/team-members");
    } catch (error) {
      console.error("Takım üyesi oluşturulurken hata:", error);
    }
  };

  return (
    <div className="animate-page-fade space-y-6">
      {/* Header */}
      <div className="animate-slide-up flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/team-members")}
            className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <Users className="mr-3 h-8 w-8 text-blue-600" />
              Yeni Takım Üyesi
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sisteme yeni takım üyesi ekleyin
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Photo Card */}
            <div className="lg:col-span-1">
              <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center text-gray-800 dark:text-white">
                    <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                      <Camera className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    Profil Fotoğrafı
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Takım üyesinin profil fotoğrafını yükleyin (opsiyonel)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="flex justify-center">
                      <div className="relative h-32 w-32">
                        <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                          {previewImage ? (
                            <>
                              <img
                                src={previewImage}
                                alt="Profil önizleme"
                                className="h-full w-full rounded-full object-cover transition-all duration-300"
                              />
                              {isImageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200/80 backdrop-blur-sm dark:bg-gray-700/80">
                                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white">
                              {watchedValues.name
                                ? watchedValues.name.charAt(0).toUpperCase()
                                : "?"}
                            </div>
                          )}
                        </div>
                        {previewImage && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* File Input */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="profilePhoto"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Fotoğraf Seç
                      </Label>
                      <div className="relative">
                        <input
                          id="profilePhoto"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <div className="flex h-12 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-600">
                          <div className="flex items-center space-x-2">
                            <Upload className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {previewImage
                                ? "Fotoğrafı değiştir"
                                : "Fotoğraf yükle"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPEG, PNG veya WebP formatında, maksimum 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields Card */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Information */}
              <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center text-gray-800 dark:text-white">
                    <div className="mr-3 rounded-lg bg-green-100 p-2 dark:bg-green-900">
                      <User className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                    Temel Bilgiler
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Takım üyesinin temel bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="animate-fade-in">
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                            İsim *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Takım üyesinin adını girin"
                              {...field}
                              className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="animate-fade-in">
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                            Pozisyon *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pozisyon veya görev"
                              {...field}
                              className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* Order Number Field */}
                    <FormField
                      control={form.control}
                      name="orderNumber"
                      render={({ field }) => (
                        <FormItem className="animate-fade-in">
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                            Sıra Numarası *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="1"
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const num = parseInt(value);
                                if (!isNaN(num) && num >= 1 && num <= 999) {
                                  field.onChange(num);
                                } else if (value === "") {
                                  field.onChange(1);
                                }
                              }}
                              className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    {/* LinkedIn URL Field */}
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem className="animate-fade-in">
                          <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span>LinkedIn URL</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/in/..."
                              {...field}
                              className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quote Card */}
              <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center text-gray-800 dark:text-white">
                    <div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                      <Quote className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    </div>
                    Kişisel Görüş
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Takım üyesinin kişisel görüşünü veya motto'sunu yazın
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <FormField
                    control={form.control}
                    name="quote"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in">
                        <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                          Kişisel Görüş *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Takım üyesinin kişisel görüşünü, motto'sunu veya kısa bir tanıtımını yazın..."
                            rows={4}
                            {...field}
                            className="resize-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage className="text-red-500" />
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {watchedValues.quote?.length || 0}/500
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Summary */}
          <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="flex items-center text-gray-800 dark:text-white">
                <div className="mr-3 rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                  <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                </div>
                Form Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    İsim
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchedValues.name || "Belirtilmemiş"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pozisyon
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchedValues.title || "Belirtilmemiş"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sıra
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    {watchedValues.orderNumber || 1}. Sıra
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Fotoğraf
                  </p>
                  <Badge
                    variant={previewImage ? "default" : "outline"}
                    className="text-sm"
                  >
                    {previewImage ? "Yüklendi" : "Yok"}
                  </Badge>
                </div>
              </div>

              {watchedValues.quote && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Kişisel Görüş
                    </p>
                    <blockquote className="rounded-lg bg-gray-50 p-4 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      "{watchedValues.quote}"
                    </blockquote>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 border-t border-gray-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/team-members")}
              className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200 dark:hover:bg-gray-700"
              disabled={createTeamMemberMutation.isPending}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={createTeamMemberMutation.isPending}
              className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              {createTeamMemberMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Takım Üyesi Oluştur
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
