import { useCallback, useMemo, useState } from "react";
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
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import PartnerCreateModal from "@/components/partner-create-modal";
import PartnerEditModal from "@/components/partner-edit-modal";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/components/confirm-delete";
import { usePartnerList, useDeletePartnerById } from "@/hooks/use-partner";
import type { Partner } from "@/types/partner.types";
import { getAssetUrl } from "@/utils/asset-url";

// Sort options
const sortOptions = [
  { label: "İsim (A-Z)", value: "name,asc" },
  { label: "İsim (Z-A)", value: "name,desc" },
  { label: "ID (Artan)", value: "id,asc" },
  { label: "ID (Azalan)", value: "id,desc" },
];

// Size options
const sizeOptions = [
  { label: "4", value: 4 },
  { label: "8", value: 8 },
  { label: "12", value: 12 },
  { label: "24", value: 24 },
];

export default function PartnerCRUDPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 350);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [sort, setSort] = useState<string[]>(["name,asc"]);

  const { data, isLoading, error } = usePartnerList();
  const deletePartnerMutation = useDeletePartnerById();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  // Backend partners endpoint returns full list; filter/sort/paginate client-side
  const allPartners = data ?? [];
  const filteredPartners = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    const base = q
      ? allPartners.filter((p) =>
          [p.name, String(p.id)].some((f) => f?.toLowerCase().includes(q)),
        )
      : allPartners;
    const [field, direction] = (sort[0] || "name,asc").split(",");
    const sorted = [...base].sort((a, b) => {
      const av = (a as any)[field];
      const bv = (b as any)[field];
      if (typeof av === "string" && typeof bv === "string") {
        return direction === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return direction === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [allPartners, debouncedSearch, sort]);

  const totalElements = filteredPartners.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const pageStart = page * size;
  const partners = filteredPartners.slice(pageStart, pageStart + size);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleDelete = useCallback(
    (partner: Partner) => {
      openDeleteModal({
        entityType: "partner",
        entityName: partner.name,
        onConfirm: async () => {
          await deletePartnerMutation.mutateAsync(partner.id);
        },
        isLoading: deletePartnerMutation.isPending,
      });
    },
    [openDeleteModal, deletePartnerMutation],
  );

  const handleEdit = useCallback((partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditModalOpen(true);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(0, Math.min(newPage, totalPages - 1)));
    },
    [totalPages],
  );

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  const handleSortChange = useCallback((newSort: string[]) => {
    setSort(newSort);
    setPage(0);
  }, []);

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <Building2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Partner listesi yüklenirken bir sorun oluştu.
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
              <Building2 className="mr-3 h-8 w-8 text-blue-600" />
              Partnerler
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem partnerlerini yönetin ve düzenleyin ({totalElements}{" "}
              partner)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Partner Ekle
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
                  placeholder="Partner ara..."
                  className="pl-10 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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

        {/* Partners Grid */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              Tüm Partnerler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} partnerin listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="relative">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                    <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4 border-blue-200"></div>
                  </div>
                  <p className="mt-4 font-medium text-gray-600 dark:text-gray-300">
                    Partnerler yükleniyor...
                  </p>
                </div>
              </div>
            ) : partners.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Partner bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {debouncedSearch
                      ? "Arama kriterlerinize uygun partner bulunamadı."
                      : "Henüz partner bulunmuyor."}
                  </p>
                  {!debouncedSearch && (
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Partneri Ekle
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {partners.map((partner, index) => (
                  <Card
                    key={partner.id}
                    className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                            {partner.icon ? (
                              <img
                                src={getAssetUrl(partner.icon)}
                                alt={partner.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              partner.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                              {partner.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: #{partner.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Düzenle"
                            onClick={() => handleEdit(partner)}
                            className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Sil"
                            onClick={() => handleDelete(partner)}
                            disabled={deletePartnerMutation.isPending}
                            className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!isLoading && (
          <div className="rounded-lg border border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sayfa {page + 1} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal />

        {/* Create & Edit Modals */}
        <PartnerCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <PartnerEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPartner(null);
          }}
          partner={selectedPartner}
        />
      </div>
    </>
  );
}
