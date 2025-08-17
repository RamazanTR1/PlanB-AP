import { useState, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaginationBar from "@/components/pagination";
import LoaderDots from "@/components/ui/loader-dots";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useNavigate } from "react-router-dom";
import { useDeleteSlider, useSliderList } from "@/hooks/use-slider";
import type { Slider } from "@/types/slider.types";
import {
  Image,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";

const sortOptions = [
  { label: "ID (Azalan)", value: "id,desc" },
  { label: "ID (Artan)", value: "id,asc" },
  { label: "Ad (A-Z)", value: "name,asc" },
  { label: "Ad (Z-A)", value: "name,desc" },
];

const sizeOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
];

export default function SliderListPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string[]>(["id,desc"]);

  const { data, isLoading } = useSliderList(page, size, sort[0] || "id,desc");
  const deleteMutation = useDeleteSlider();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const sliders = data?.content || [];
  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    return q
      ? sliders.filter((s) => s.name.toLowerCase().includes(q))
      : sliders;
  }, [sliders, searchInput]);
  const totalPages = data?.page?.totalPages || 0;
  const totalElements = data?.page?.totalElements || 0;

  const handleDelete = useCallback(
    (slider: Slider) => {
      openDeleteModal({
        entityType: "slider",
        entityName: slider.name,
        onConfirm: async () => {
          await deleteMutation.mutateAsync(slider.id);
        },
        isLoading: deleteMutation.isPending,
      });
    },
    [openDeleteModal, deleteMutation],
  );

  return (
    <div className="animate-page-fade space-y-6">
      <div className="animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
            <Image className="mr-3 h-8 w-8 text-blue-600" />
            Sliderlar
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Toplam {totalElements} kayıt
          </p>
        </div>
        <Button
          className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          onClick={() => navigate("/sliders/create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Yeni Slider
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
                placeholder="Slider ara..."
                className="pl-10 focus:border-transparent focus:pl-4 dark:border-none"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="w-full md:w-auto">
              <MultiSelect
                options={sortOptions}
                onValueChange={(values) => setSort(values)}
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
                    onClick={() => setSize(option.value)}
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
            Tüm Sliderlar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <LoaderDots message="Sliderlar yükleniyor..." />
          ) : filtered.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-fade-in text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4 text-center dark:bg-gray-700">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Kayıt bulunamadı
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((s, index) => (
                <Card
                  key={s.id}
                  className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                          {s.image ? (
                            <img
                              src={s.image}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            s.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                            {s.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: #{s.id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Düzenle"
                          onClick={() => navigate(`/sliders/edit/${s.id}`)}
                          className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Sil"
                          onClick={() => handleDelete(s)}
                          disabled={deleteMutation.isPending}
                          className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                      {s.excerpt || s.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      <DeleteModal />
    </div>
  );
}
