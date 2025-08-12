import { useState, useCallback } from "react";
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
  Tag as TagIcon,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
} from "lucide-react";
import { useTagList, useDeleteTag } from "@/hooks/use-tag";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import TagCreateModal from "@/components/tag-create-modal";
import TagEditModal from "@/components/tag-edit-modal";
import type { Tag } from "@/types/tag.types";
import PaginationBar from "@/components/pagination";
import LoaderDots from "@/components/ui/loader-dots";

// Sort options for multi-select
const sortOptions = [
  { label: "Tag Adı (A-Z)", value: "name,asc" },
  { label: "Tag Adı (Z-A)", value: "name,desc" },
  { label: "Tag ID (Artan)", value: "id,asc" },
  { label: "Tag ID (Azalan)", value: "id,desc" },
];

// Size options for dropdown
const sizeOptions = [
  { label: "4", value: 4 },
  { label: "8", value: 8 },
  { label: "12", value: 12 },
  { label: "25", value: 25 },
];

export default function TagListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch] = useDebounce(searchInput, 350);
  const [page, setPage] = useState(0); // 0-indexed for backend
  const [size, setSize] = useState(4);
  const [sort, setSort] = useState<string[]>(["name,asc"]);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const savedViewMode = sessionStorage.getItem("tag-view-mode");
    return (savedViewMode as "grid" | "list") || "grid";
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  const {
    data: tagListResponse,
    isLoading,
    error,
  } = useTagList(debouncedSearch, page, size, sort[0] || "name,asc");
  const deleteTagMutation = useDeleteTag();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const tags = tagListResponse?.content || [];
  const totalPages = tagListResponse?.page?.totalPages || 0;
  const totalElements = tagListResponse?.page?.totalElements || 0;

  const handleDelete = useCallback(
    (tag: Tag) => {
      openDeleteModal({
        entityType: "etiket",
        entityName: tag.name,
        onConfirm: async () => {
          await deleteTagMutation.mutateAsync(tag.id);
        },
        isLoading: deleteTagMutation.isPending,
      });
    },
    [openDeleteModal, deleteTagMutation],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  }, []);

  const handleSortChange = useCallback((newSort: string[]) => {
    setSort(newSort);
    setPage(0); // Reset to first page when changing sort
  }, []);

  const handleViewModeChange = useCallback((newViewMode: "grid" | "list") => {
    setViewMode(newViewMode);
    sessionStorage.setItem("tag-view-mode", newViewMode);
  }, []);

  const handleEditTag = useCallback((tag: Tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  }, []);

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <TagIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Etiket listesi yüklenirken bir sorun oluştu.
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
              <TagIcon className="mr-3 h-8 w-8 text-blue-600" />
              Etiketler
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem etiketlerini yönetin ve düzenleyin ({totalElements} etiket)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Etiket Ekle
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
                  placeholder="Etiket ara..."
                  className="pl-10 focus:border-transparent focus:pl-4 dark:border-none"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
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

              {/* View Mode */}
              <div className="flex w-full rounded-md border md:w-auto">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("grid")}
                  className="flex-1 rounded-r-none transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("list")}
                  className="flex-1 rounded-l-none transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <TagIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              Tüm Etiketler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} etiketin listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoaderDots message="Etiketler yükleniyor..." />
            ) : tags.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4">
                    <TagIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Etiket bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {debouncedSearch
                      ? "Arama kriterlerinize uygun etiket bulunamadı."
                      : "Henüz etiket bulunmuyor."}
                  </p>
                  {!debouncedSearch && (
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Etiketi Ekle
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-4"
                }
              >
                {tags.map((tag, index) => (
                  <Card
                    key={tag.id}
                    className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                              {tag.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                                {tag.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{tag.id}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Düzenle"
                            onClick={() => handleEditTag(tag)}
                            className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Sil"
                            onClick={() => handleDelete(tag)}
                            disabled={deleteTagMutation.isPending}
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
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal />

        {/* Tag Create Modal */}
        <TagCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Tag Edit Modal */}
        <TagEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTag(null);
          }}
          tag={selectedTag}
        />
      </div>
    </>
  );
}
