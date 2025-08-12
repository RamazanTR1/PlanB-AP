import { useCallback, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useNavigate } from "react-router-dom";
import {
  usePortfolioList,
  useDeletePortfolioById,
} from "@/hooks/use-portfolio";
import type { Portfolio } from "@/types/portfolio.types";
import PaginationBar from "@/components/pagination";
import {
  CalendarDays,
  ChevronDown,
  Eye,
  Filter,
  Pencil,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";

const sortOptions = [
  { label: "Yayın Tarihi (Yeni)", value: "publishDate,desc" },
  { label: "Yayın Tarihi (Eski)", value: "publishDate,asc" },
  { label: "Başlık (A-Z)", value: "title,asc" },
  { label: "Başlık (Z-A)", value: "title,desc" },
  { label: "ID (Azalan)", value: "id,desc" },
  { label: "ID (Artan)", value: "id,asc" },
];

const sizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
  { label: "50", value: 50 },
];

export default function PortfolioListPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 350);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string[]>(["publishDate,desc"]);

  const { data, isLoading, error } = usePortfolioList(
    page,
    size,
    sort[0] || "publishDate,desc",
    debouncedSearch,
  );
  const deleteMutation = useDeletePortfolioById();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const items = data?.content ?? [];
  const totalPages = data?.page?.totalPages ?? 0;
  const totalElements = data?.page?.totalElements ?? 0;

  const handleSortChange = useCallback((values: string[]) => {
    setSort(values);
    setPage(0);
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const handleDelete = useCallback(
    (portfolio: Portfolio) => {
      openDeleteModal({
        entityType: "portfolio",
        entityName: portfolio.title,
        onConfirm: async () => {
          await deleteMutation.mutateAsync(portfolio.id);
        },
        isLoading: deleteMutation.isPending,
      });
    },
    [deleteMutation, openDeleteModal],
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4 dark:bg-red-900/20">
              <CalendarDays className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Portfolyo listesi yüklenirken bir sorun oluştu.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
            >
              Yeniden Dene
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-page-fade space-y-6">
        <div className="animate-slide-up flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <CalendarDays className="mr-3 h-8 w-8 text-blue-600" />
              Portfolyolar
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistemdeki portfolyoları yönetin ve izleyin ({totalElements} öğe)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => navigate("/portfolios/create")}
          >
            <Plus className="mr-2 h-4 w-4" /> Portfolyo Ekle
          </Button>
        </div>

        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <span className="mr-2 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </span>
              Arama ve Filtreler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              <i>Listeyi özelleştirmede tek sınır sizsiniz!</i>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="relative w-full flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Portfolyo ara..."
                  className="pl-10 focus:border-transparent focus:pl-4 dark:border-none"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setPage(0);
                  }}
                />
              </div>

              <div className="w-full md:w-auto">
                <MultiSelect
                  options={sortOptions}
                  onValueChange={handleSortChange}
                  defaultValue={sort}
                  placeholder="Sıralama seçin..."
                  maxCount={1}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-gray-700 transition-colors duration-200 dark:border-none dark:text-gray-200 md:w-20"
                  >
                    {size}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sizeOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => handleSizeChange(option.value)}
                      className={size === option.value ? "bg-accent" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <span className="mr-2 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </span>
              Tüm Portfolyolar
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} portfolyonun listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoaderDots message="Portfolyolar yükleniyor..." />
            ) : items.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Portfolyo bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {debouncedSearch
                      ? "Arama kriterlerinize uygun sonuç bulunamadı."
                      : "Henüz portfolyo bulunmuyor."}
                  </p>
                  {!debouncedSearch && (
                    <Button
                      onClick={() => navigate("/portfolios/create")}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" /> İlk Portfolyoyu Ekle
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg [&>div]:overflow-visible">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Başlık
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Özet
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Yayın Tarihi
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((p: Portfolio, index) => (
                      <TableRow
                        key={p.id}
                        className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                            {p.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: #{p.id}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                          {p.excerpt || "-"}
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
                          {formatDate(p.publishDate)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Görüntüle"
                              onClick={() => navigate(`/portfolios/${p.id}`)}
                              className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Düzenle"
                              onClick={() =>
                                navigate(`/portfolios/edit/${p.id}`)
                              }
                              className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Sil"
                              onClick={() => handleDelete(p)}
                              disabled={deleteMutation.isPending}
                              className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      <DeleteModal />
    </>
  );
}
