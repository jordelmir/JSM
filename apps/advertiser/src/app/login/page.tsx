"use client";

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@gasolinera-jsm/shared/store/authStore';
import { loginAdvertiser } from '@/lib/apiClient';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from 'react-i18next'; // New import

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation(); // Use useTranslation hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { token } = await loginAdvertiser(data.email, data.password);
      login(null, token);
      toast.success(t("Login successful!")); // Translated
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || t('An unknown error occurred.')); // Translated
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{t("Advertiser Portal Login")}</CardTitle> {/* Translated */}
            <CardDescription>
              {t("Enter your credentials to access the control panel.")} {/* Translated */}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("Email")}</Label> {/* Translated */}
              <Input
                id="email"
                type="email"
                placeholder={t("advertiser@example.com")} {/* Translated */}
                required
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{t(errors.email.message || "Invalid email.")}</p> {/* Translated */}
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("Password")}</Label> {/* Translated */}
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{t(errors.password.message || "Invalid password.")}</p> {/* Translated */}
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner /> {t("Logging in...")} {/* Translated */}
                </div>
              ) : (
                t('Login') // Translated
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
      </div>
  );
}
