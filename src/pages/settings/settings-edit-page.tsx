import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateSettings } from "@/hooks/use-settings";
import {
  updateSettingsSchema,
  type UpdateSettingsFormData,
} from "@/validations/settings.validation";
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
import { CheckCircle2, Settings as SettingsIcon, SaveIcon } from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";
import { useState } from "react";

export default function SettingsEditPage() {
  const updateMutation = useUpdateSettings();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UpdateSettingsFormData>({
    resolver: zodResolver(updateSettingsSchema) as never,
    mode: "onChange",
    defaultValues: {
      siteLogo: "",
      maintenanceMode: false,
      aboutUsDescription: "",
      email: "",
      instagramUrl: "",
      linkedinUrl: "",
      youtubeUrl: "",
      xurl: "",
      teamMembersHeader: "",
      teamMembersDescription: "",
    },
  });

  const onSubmit = async (data: UpdateSettingsFormData) => {
    setSubmitted(false);
    await updateMutation.mutateAsync({
      siteLogo: data.siteLogo?.trim() || "",
      maintenanceMode: data.maintenanceMode || false,
      aboutUsDescription: data.aboutUsDescription?.trim() || "",
      email: data.email?.trim() || "",
      instagramUrl: data.instagramUrl?.trim() || "",
      linkedinUrl: data.linkedinUrl?.trim() || "",
      youtubeUrl: data.youtubeUrl?.trim() || "",
      xurl: data.xurl?.trim() || "",
      teamMembersHeader: data.teamMembersHeader?.trim() || "",
      teamMembersDescription: data.teamMembersDescription?.trim() || "",
    });
    setSubmitted(true);
  };

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <SettingsIcon className="mr-3 h-8 w-8 text-blue-600" />
            Site Ayarları
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sitenin genel ayarlarını güncelleyin
          </p>
        </div>
        {submitted && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            <span className="text-sm">Kaydedildi</span>
          </div>
        )}
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            Ayarlar
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Zorunlu alanlar doldurulmalıdır
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Site Logo URL</Label>
                <Input
                  id="siteLogo"
                  placeholder="https://..."
                  {...register("siteLogo")}
                />
                {errors.siteLogo && (
                  <p className="text-sm text-red-500">
                    {errors.siteLogo.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E‑posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@mail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutUsDescription">Hakkımızda</Label>
              <Textarea
                id="aboutUsDescription"
                rows={5}
                placeholder="Şirket hakkında kısa bir açıklama"
                {...register("aboutUsDescription")}
              />
              {errors.aboutUsDescription && (
                <p className="text-sm text-red-500">
                  {errors.aboutUsDescription.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  placeholder="https://instagram.com/..."
                  {...register("instagramUrl")}
                />
                {errors.instagramUrl && (
                  <p className="text-sm text-red-500">
                    {errors.instagramUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/company/..."
                  {...register("linkedinUrl")}
                />
                {errors.linkedinUrl && (
                  <p className="text-sm text-red-500">
                    {errors.linkedinUrl.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  placeholder="https://youtube.com/..."
                  {...register("youtubeUrl")}
                />
                {errors.youtubeUrl && (
                  <p className="text-sm text-red-500">
                    {errors.youtubeUrl.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="xurl">X (Twitter) URL</Label>
                <Input
                  id="xurl"
                  placeholder="https://x.com/..."
                  {...register("xurl")}
                />
                {errors.xurl && (
                  <p className="text-sm text-red-500">{errors.xurl.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teamMembersHeader">Ekip Başlığı</Label>
                <Input
                  id="teamMembersHeader"
                  placeholder="Ekip Başlığı"
                  {...register("teamMembersHeader")}
                />
                {errors.teamMembersHeader && (
                  <p className="text-sm text-red-500">
                    {errors.teamMembersHeader.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceMode">Bakım Modu</Label>
                <div className="flex h-10 items-center rounded-md border border-input bg-popover px-3 text-sm">
                  <input
                    id="maintenanceMode"
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    {...register("maintenanceMode")}
                  />
                  <span className="ml-2 text-muted-foreground">
                    Etkinleştir
                  </span>
                </div>
                {errors.maintenanceMode && (
                  <p className="text-sm text-red-500">
                    {String(errors.maintenanceMode.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamMembersDescription">Ekip Açıklaması</Label>
              <Textarea
                id="teamMembersDescription"
                rows={4}
                placeholder="Ekip bölümüne ait açıklama"
                {...register("teamMembersDescription")}
              />
              {errors.teamMembersDescription && (
                <p className="text-sm text-red-500">
                  {errors.teamMembersDescription.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={!isValid || updateMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
              >
                {updateMutation.isPending ? <LoaderDots /> : null}
                <SaveIcon className="mr-2 h-4 w-4" />
                Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
