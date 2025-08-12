// src/pages/service/service-list-page.tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
// removed unused Badge import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Wrench,
  Loader2,
  Filter,
} from "lucide-react";
import { useServiceList, useDeleteServiceById } from "@/hooks/use-service";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import type { Service } from "@/types/service.types";
import PaginationBar from "@/components/pagination";
import LoaderDots from "@/components/ui/loader-dots";

// Sort options for multi-select
const sortOptions = [
  { label: "Hizmet Adı (A-Z)", value: "name,asc" },
  { label: "Hizmet Adı (Z-A)", value: "name,desc" },
  { label: "Açıklama (A-Z)", value: "description,asc" },
  { label: "Açıklama (Z-A)", value: "description,desc" },
];

// Size options for dropdown
const sizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
  { label: "50", value: 50 },
];

export default function ServiceListPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 350);
  const [page, setPage] = useState(0); // 0-indexed for backend
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string[]>(["name,asc"]);

  const {
    data: serviceListResponse,
    isLoading,
    error,
  } = useServiceList(debouncedSearch, page, size, sort[0] || "name,asc");
  const deleteServiceMutation = useDeleteServiceById();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const services = serviceListResponse?.content || [];
  const totalPages = serviceListResponse?.page?.totalPages || 0;
  const totalElements = serviceListResponse?.page?.totalElements || 0;

  const handleDelete = useCallback(
    (service: Service) => {
      openDeleteModal({
        entityType: "hizmet",
        entityName: service.name,
        onConfirm: async () => {
          await deleteServiceMutation.mutateAsync(service.id);
        },
        isLoading: deleteServiceMutation.isPending,
      });
    },
    [openDeleteModal, deleteServiceMutation],
  );

  const handleViewService = useCallback(
    (serviceId: number) => {
      navigate(`/services/${serviceId}`);
    },
    [navigate],
  );

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    setPage(0); // Reset to first page when searching (0-indexed)
  }, []);

  const handleSortChange = useCallback((values: string[]) => {
    setSort(values);
    setPage(0); // Reset to first page when sorting
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  }, []);

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <Wrench className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Hizmet listesi yüklenirken bir sorun oluştu.
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
        {/* Header */}
        <div className="animate-slide-up flex items-center justify-between">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <Wrench className="mr-3 h-8 w-8 text-blue-600" />
              Hizmetler
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem hizmetlerini yönetin ve izleyin ({totalElements} hizmet)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => navigate("/services/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Hizmet Ekle
          </Button>
        </div>

        {/* Search and Filters */}
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
                  placeholder="Hizmet ara..."
                  className="pl-10 focus:border-transparent focus:pl-4 dark:border-none"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Sort Multi-Select */}
              <div className="w-full md:w-auto">
                <MultiSelect
                  options={sortOptions}
                  onValueChange={handleSortChange}
                  defaultValue={sort}
                  placeholder="Sıralama seçin..."
                  maxCount={1}
                />
              </div>

              {/* Size Dropdown */}
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

        {/* Services Table */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              Tüm Hizmetler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} hizmetin listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoaderDots message="Hizmetler yükleniyor..." />
            ) : services.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4">
                    <Wrench className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Hizmet bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {debouncedSearch
                      ? "Arama kriterlerinize uygun hizmet bulunamadı."
                      : "Henüz hizmet bulunmuyor."}
                  </p>
                  {!debouncedSearch && (
                    <Button
                      onClick={() => navigate("/services/create")}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Hizmeti Ekle
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
                        Hizmet
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Açıklama
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service: Service, index) => (
                      <TableRow
                        key={service.id}
                        className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                              {service.icon &&
                              typeof service.icon === "string" ? (
                                <img
                                  src={service.icon}
                                  alt={service.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    // Icon yüklenemezse fallback'e geç
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                    const fallbackElement = (
                                      e.target as HTMLImageElement
                                    ).nextElementSibling as HTMLElement;
                                    if (fallbackElement) {
                                      fallbackElement.classList.remove(
                                        "hidden",
                                      );
                                    }
                                  }}
                                />
                              ) : null}
                              <div
                                className={`flex h-full w-full items-center justify-center ${
                                  service.icon &&
                                  typeof service.icon === "string"
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                {service.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                                {service.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{service.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-md text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
                            <p className="truncate" title={service.description}>
                              {service.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Görüntüle"
                              onClick={() => handleViewService(service.id)}
                              className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Düzenle"
                              onClick={() =>
                                navigate(`/services/edit/${service.id}`)
                              }
                              className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Sil"
                              onClick={() => handleDelete(service)}
                              disabled={deleteServiceMutation.isPending}
                              className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleteServiceMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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

        {/* Pagination */}
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal />
    </>
  );
}
