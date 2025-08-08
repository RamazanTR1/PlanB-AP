import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Users,
  Loader2,
  Filter,
  User,
  Hash,
} from "lucide-react";
import {
  useTeamMemberList,
  useDeleteTeamMember,
} from "@/hooks/use-team-member";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/components/confirm-delete";
import type { TeamMember } from "@/types/team-member-types";

// Sort options for multi-select
const sortOptions = [
  { label: "Sıra Numarası (Küçük)", value: "orderNumber,asc" },
  { label: "Sıra Numarası (Büyük)", value: "orderNumber,desc" },
  { label: "İsim (A-Z)", value: "name,asc" },
  { label: "İsim (Z-A)", value: "name,desc" },
  { label: "Pozisyon (A-Z)", value: "title,asc" },
  { label: "Pozisyon (Z-A)", value: "title,desc" },
  { label: "Oluşturulma Tarihi (Yeni)", value: "createdAt,desc" },
  { label: "Oluşturulma Tarihi (Eski)", value: "createdAt,asc" },
];

// Size options for dropdown
const sizeOptions = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
];

export default function TeamMemberListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0); // 0-indexed for backend
  const [size, setSize] = useState(5);
  const [sort, setSort] = useState<string[]>(["orderNumber,asc"]);

  const {
    data: teamMemberListResponse,
    isLoading,
    error,
  } = useTeamMemberList(page, size, sort[0] || "orderNumber,asc");
  const deleteTeamMemberMutation = useDeleteTeamMember();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const teamMembers = teamMemberListResponse?.content || [];
  const totalPages = teamMemberListResponse?.page?.totalPages || 0;
  const totalElements = teamMemberListResponse?.page?.totalElements || 0;

  const handleDelete = useCallback(
    (teamMember: TeamMember) => {
      openDeleteModal({
        entityType: "takımUyesi",
        entityName: teamMember.name,
        onConfirm: async () => {
          await deleteTeamMemberMutation.mutateAsync(teamMember.id);
        },
        requireTextConfirmation: true,
        confirmationText: teamMember.name,
        isLoading: deleteTeamMemberMutation.isPending,
      });
    },
    [openDeleteModal, deleteTeamMemberMutation],
  );

  const handleViewTeamMember = useCallback(
    (teamMemberId: number) => {
      navigate(`/team-members/${teamMemberId}`);
    },
    [navigate],
  );

  const handleEditTeamMember = useCallback(
    (teamMemberId: number) => {
      navigate(`/team-members/edit/${teamMemberId}`);
    },
    [navigate],
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

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Takım üyeleri listesi yüklenirken bir sorun oluştu.
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
              <Users className="mr-3 h-8 w-8 text-blue-600" />
              Takım Üyeleri
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem takım üyelerini yönetin ve düzenleyin ({totalElements} üye)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => navigate("/team-members/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Takım Üyesi Ekle
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <span className="mr-2 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </span>
              Filtreler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              <i>Listeyi özelleştirmede tek sınır sizsiniz!</i>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="w-full md:w-1/2">
                <MultiSelect
                  options={sortOptions}
                  onValueChange={handleSortChange}
                  defaultValue={sort}
                  placeholder="Sıralama seçin..."
                  maxCount={1}
                />
              </div>

              <div className="w-full md:w-1/2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-gray-700 transition-colors duration-200 dark:border-none dark:text-gray-200"
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
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              Tüm Takım Üyeleri
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} takım üyesinin listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="relative mx-auto mb-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full border border-blue-400 opacity-20"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Takım üyeleri yükleniyor...
                  </p>
                  <div className="mt-2 flex justify-center space-x-1">
                    <div
                      className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-1 w-1 animate-bounce rounded-full bg-blue-400"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Takım üyesi bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Henüz takım üyesi bulunmuyor.
                  </p>
                  {
                    <Button
                      onClick={() => navigate("/team-members/create")}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Takım Üyesini Ekle
                    </Button>
                  }
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 dark:border-gray-700">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Sıra
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Takım Üyesi
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Pozisyon
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((teamMember, index) => (
                      <TableRow
                        key={teamMember.id}
                        className="animate-fade-in border-gray-200 transition-colors duration-200 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="font-mono">
                            {teamMember.orderNumber}. Sıra
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                              {teamMember.profilePhoto ? (
                                <img
                                  src={teamMember.profilePhoto}
                                  alt={teamMember.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
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
                                className={`flex h-full w-full items-center justify-center ${teamMember.profilePhoto ? "hidden" : ""}`}
                              >
                                {teamMember.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 transition-colors hover:text-blue-900 dark:text-white dark:hover:text-blue-300">
                                {teamMember.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{teamMember.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {teamMember.title}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Görüntüle"
                              onClick={() =>
                                handleViewTeamMember(teamMember.id)
                              }
                              className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Düzenle"
                              onClick={() =>
                                handleEditTeamMember(teamMember.id)
                              }
                              className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Sil"
                              onClick={() => handleDelete(teamMember)}
                              disabled={deleteTeamMemberMutation.isPending}
                              className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleteTeamMemberMutation.isPending ? (
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
        {totalElements > 0 && (
          <Card className="animate-fade-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Toplam{" "}
                  <span className="font-semibold text-blue-600">
                    {totalElements}
                  </span>{" "}
                  takım üyesinden{" "}
                  <span className="font-semibold text-blue-600">
                    {page * size + 1}
                  </span>
                  -
                  <span className="font-semibold text-blue-600">
                    {Math.min((page + 1) * size, totalElements)}
                  </span>{" "}
                  arası gösteriliyor
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Önceki
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Sayfa
                    </span>
                    <Badge
                      variant="outline"
                      className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      {page + 1} / {totalPages}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteModal />
      </div>
    </>
  );
}
