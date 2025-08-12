import { useParams, useNavigate } from "react-router-dom";
import { usePortfolioById } from "@/hooks/use-portfolio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, ExternalLink } from "lucide-react";

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = usePortfolioById(Number(id));

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
            Portfolio Detayı
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            #{id} numaralı kayıt
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="text-gray-700 dark:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Geri
        </Button>
      </div>

      <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">
            {data?.title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {data?.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {data?.outSourceLink && (
            <a
              href={data.outSourceLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-blue-600 hover:underline dark:text-blue-400"
            >
              Dış Bağlantı <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          )}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{data?.description}</p>
          </div>

          {data?.assets?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.assets.map((a, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white/70 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <img
                    src={a.asset}
                    alt="asset"
                    className="h-48 w-full object-cover"
                  />
                  {a.isCovered && (
                    <div className="px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
                      Kapak Görseli
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
