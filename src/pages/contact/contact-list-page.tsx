import { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MultiSelect } from "@/components/multi-select";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { Eye, Mail, ChevronDown, Loader2, Trash2, Filter } from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";
import { useContactList, useDeleteContact } from "@/hooks/use-contact";
import type { Contact } from "@/types/contact.types";
import { useNavigate } from "react-router-dom";
import PaginationBar from "@/components/pagination";

export default function ContactListPage() {
  const navigate = useNavigate();
  // Backend uses 0-based page indexing
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string[]>(["createdAt,desc"]);

  const { data, isLoading, error } = useContactList(
    page,
    size,
    sort[0] || "createdAt,desc",
  );
  const deleteMutation = useDeleteContact();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const contacts = data?.content ?? [];
  const totalPages = data?.page?.totalPages ?? 0;
  const totalElements = data?.page?.totalElements ?? 0;

  const sortOptions = useMemo(
    () => [
      { label: "Oluşturulma (Yeni)", value: "createdAt,desc" },
      { label: "Oluşturulma (Eski)", value: "createdAt,asc" },
      { label: "İsim (A-Z)", value: "name,asc" },
      { label: "İsim (Z-A)", value: "name,desc" },
      { label: "E-posta (A-Z)", value: "email,asc" },
      { label: "E-posta (Z-A)", value: "email,desc" },
      { label: "Konu (A-Z)", value: "subject,asc" },
      { label: "Konu (Z-A)", value: "subject,desc" },
    ],
    [],
  );

  const sizeOptions = useMemo(
    () => [
      { label: "10", value: 10 },
      { label: "20", value: 20 },
      { label: "30", value: 30 },
      { label: "50", value: 50 },
    ],
    [],
  );

  const handleSortChange = useCallback((values: string[]) => {
    setSort(values);
    setPage(0); // reset to first page (0-indexed)
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // reset to first page (0-indexed)
  }, []);

  const handleDelete = useCallback(
    (contact: Contact) => {
      openDeleteModal({
        entityType: "iletişimMesaj",
        entityName: `${contact.name} - ${contact.subject}`,
        onConfirm: async () => {
          await deleteMutation.mutateAsync(contact.id);
        },
        isLoading: deleteMutation.isPending,
      });
    },
    [deleteMutation, openDeleteModal],
  );

  const handleView = useCallback(
    (contact: Contact) => {
      navigate(`/contacts/${contact.id}`, { state: { contact } });
    },
    [navigate],
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4 dark:bg-red-900/20">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              İletişim mesajları yüklenirken bir sorun oluştu.
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
              <Mail className="mr-3 h-8 w-8 text-blue-600" />
              İletişim Mesajları
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem iletişim mesajlarını yönetin ve izleyin ({totalElements}{" "}
              mesaj)
            </p>
          </div>
        </div>

        {/* Filters */}
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

        {/* Table */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              Tüm Mesajlar
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} mesajın listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoaderDots message="Mesajlar yükleniyor..." />
            ) : contacts.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4 dark:bg-gray-700">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mesaj bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Henüz iletişim mesajı bulunmuyor.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg [&>div]:overflow-visible">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        İsim
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        E-posta
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Konu
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        Oluşturulma
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c: Contact, index) => (
                      <TableRow
                        key={c.id}
                        className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                            {c.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: #{c.id}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                          {c.email}
                        </TableCell>
                        <TableCell className="py-4 text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-100">
                          {c.subject}
                        </TableCell>
                        <TableCell className="py-4 text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
                          {formatDate(c.createdAt)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Görüntüle"
                              onClick={() => handleView(c)}
                              className="transition-all duration-200 hover:bg-blue-100 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Sil"
                              onClick={() => handleDelete(c)}
                              disabled={deleteMutation.isPending}
                              className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleteMutation.isPending ? (
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
