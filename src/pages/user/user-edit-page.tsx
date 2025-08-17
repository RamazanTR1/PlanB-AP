import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  ArrowLeft,
  UserPen,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  Mail,
  User,
  Shield,
} from "lucide-react";
import { useUpdateUser, useUserById } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import type { UpdateUserRequest } from "@/types/user.types";
import {
  updateUserSchema,
  type UpdateUserFormData,
} from "@/validations/user.validation";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id || "0");

  const { data: user, isLoading: isLoadingUser } = useUserById(userId);
  const updateUserMutation = useUpdateUser(userId);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      active: true,
    },
    mode: "onTouched",
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        password: "",
        active: user.active,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UpdateUserFormData) => {
    const userData: UpdateUserRequest = {
      username: data.username,
      email: data.email,
      password: data.password || "",
      active: data.active,
    };

    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        navigate("/users");
      },
    });
  };

  if (isLoadingUser) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="flex items-center space-x-2 transition-colors duration-200 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
            <div className="animate-slide-up">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>

        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-10 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/users")}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Geri</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-red-600">
                Kullanıcı Bulunamadı
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Aradığınız kullanıcı bulunamadı
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-fade space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/users")}
            className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kullanıcı Düzenle
            </h1>
            <p className="mt-2 flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <span>Kullanıcı bilgilerini güncelleyin</span>
              <Badge
                variant={user.active ? "default" : "secondary"}
                className="text-xs"
              >
                {user.active ? "Aktif" : "Pasif"}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="animate-scale-in border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg backdrop-blur-sm dark:from-gray-700 dark:to-gray-800">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  #{user.id}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                <Mail className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  E-posta
                </p>
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Oluşturulma
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Durum
                </p>
                <Badge variant={user.active ? "default" : "secondary"}>
                  {user.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Edit Form */}
      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
          <CardTitle className="flex items-center text-gray-800 dark:text-white">
            <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <UserPen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            Kullanıcı Bilgilerini Güncelle
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Kullanıcı Adı
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kullanıcı adını giriniz"
                          {...field}
                          className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        E-posta Adresi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="E-posta adresini giriniz"
                          {...field}
                          className="transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Yeni Şifre
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Yeni şifre"
                            {...field}
                            className="pr-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors duration-200 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Active Status Field */}
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Hesap Durumu
                      </FormLabel>
                      <FormControl>
                        <div className="mt-2 flex items-center space-x-4">
                          <label className="flex cursor-pointer items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === true}
                              onChange={() => field.onChange(true)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-green-700">
                              Aktif
                            </span>
                          </label>
                          <label className="flex cursor-pointer items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === false}
                              onChange={() => field.onChange(false)}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm font-medium text-red-700">
                              Pasif
                            </span>
                          </label>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-500 dark:text-gray-400">
                        Kullanıcının sisteme giriş yapabilme durumu
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
                  className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={updateUserMutation.isPending}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white transition-all duration-200 hover:scale-105 hover:from-emerald-700 hover:to-teal-700"
                >
                  {updateUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Güncelleniyor...
                    </>
                  ) : (
                    <>
                      <UserPen className="mr-2 h-4 w-4" />
                      Kullanıcıyı Güncelle
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
