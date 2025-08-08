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
import { ArrowLeft, UserPlus, Eye, EyeOff, Loader2 } from "lucide-react";
import { useCreateUser } from "@/hooks/use-user";
import { useState } from "react";
import type { CreateUserRequest } from "@/types/user.types";
import {
  createUserSchema,
  type CreateUserFormData,
} from "@/validations/user.validation";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const userData: CreateUserRequest = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    createUserMutation.mutate(userData, {
      onSuccess: () => {
        navigate("/users");
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
            onClick={() => navigate("/users")}
            className="flex items-center justify-center gap-2 border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-600 dark:bg-gray-800/90 dark:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri</span>
          </Button>
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Yeni Kullanıcı
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sisteme yeni kullanıcı ekleyin
            </p>
          </div>
        </div>
      </div>

      {/* User Create Form */}
      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
          <CardTitle className="flex items-center text-gray-800 dark:text-white">
            <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            Kullanıcı Bilgileri
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
                        Şifre
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Şifrenizi giriniz"
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

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="font-medium text-gray-700 dark:text-gray-300">
                        Şifre Tekrarı
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Şifrenizi tekrar giriniz"
                            {...field}
                            className="pr-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors duration-200 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
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
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-4 border-t border-gray-100 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
                  className="text-gray-700 transition-all duration-200 hover:scale-105 dark:border-none dark:text-gray-200 dark:hover:bg-gray-700"
                  disabled={createUserMutation.isPending}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                >
                  {createUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Kullanıcı Oluştur
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
