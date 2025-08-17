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
  Bell,
  Loader2,
  Filter,
  Send,
  Mail,
  MessageSquare,
} from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";
import {
  useNotificationList,
  useNotificationDelete,
  useNotificationSend,
} from "@/hooks/use-notification";
import { MultiSelect } from "@/components/multi-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";
import { useSendConfirmation } from "@/components/confirm-send";
import type { Notification } from "@/types/notification.types";
import PaginationBar from "@/components/pagination";

// Sort options for multi-select
const sortOptions = [
  { label: "ID (Azalan)", value: "id,desc" },
  { label: "ID (Artan)", value: "id,asc" },
  { label: "Başlık (A-Z)", value: "title,asc" },
  { label: "Başlık (Z-A)", value: "title,desc" },
  { label: "Tür (E-posta -> SMS)", value: "type,asc" },
  { label: "Tür (SMS -> E-posta)", value: "type,desc" },
];

// Size options for dropdown
const sizeOptions = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "20", value: 20 },
];

export default function NotificationListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0); // 0-indexed for backend
  const [size, setSize] = useState(5);
  const [sort, setSort] = useState<string[]>(["id,desc"]);

  const {
    data: notificationListResponse,
    isLoading,
    error,
  } = useNotificationList(page, size, sort[0] || "id,desc");
  const deleteNotificationMutation = useNotificationDelete();
  const sendNotificationMutation = useNotificationSend();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();
  const { openSendModal, SendModal } = useSendConfirmation();

  const notifications = notificationListResponse?.content || [];
  const totalPages = notificationListResponse?.page?.totalPages || 0;
  const totalElements = notificationListResponse?.page?.totalElements || 0;

  const handleDelete = useCallback(
    (notification: Notification) => {
      openDeleteModal({
        entityType: "bildirim",
        entityName: notification.title,
        onConfirm: async () => {
          await deleteNotificationMutation.mutateAsync(notification.id);
        },
        isLoading: deleteNotificationMutation.isPending,
      });
    },
    [openDeleteModal, deleteNotificationMutation],
  );

  const handleSend = useCallback(
    (notification: Notification) => {
      openSendModal({
        onConfirm: async () => {
          await sendNotificationMutation.mutateAsync(notification.id);
        },
        notificationTitle: notification.title,
        notificationType: notification.type,
        isLoading: sendNotificationMutation.isPending,
      });
    },
    [openSendModal, sendNotificationMutation],
  );

  const handleViewNotification = useCallback(
    (notificationId: number) => {
      navigate(`/notifications/${notificationId}`);
    },
    [navigate],
  );

  const handleSortChange = useCallback((values: string[]) => {
    setSort(values);
    setPage(0); // Reset to first page when sorting
  }, []);

  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing size
  }, []);

  const getTypeBadge = (type: string) => {
    return type === "EMAIL" ? (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200">
        <Mail className="mr-1 h-3 w-3" />
        E-posta
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
        <MessageSquare className="mr-1 h-3 w-3" />
        SMS
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <Bell className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bir hata oluştu
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Bildirim listesi yüklenirken bir sorun oluştu.
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
              <Bell className="mr-3 h-8 w-8 text-blue-600" />
              Bildirimler
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Sistem bildirimlerini yönetin ve izleyin ({totalElements}{" "}
              bildirim)
            </p>
          </div>
          <Button
            className="transform bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            onClick={() => navigate("/notifications/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Bildirim Ekle
          </Button>
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
              {/* Sort Multi-Select */}
              <div className="w-full md:w-1/2">
                <MultiSelect
                  options={sortOptions}
                  onValueChange={handleSortChange}
                  defaultValue={sort}
                  placeholder="Sıralama seçin..."
                  maxCount={1}
                />
              </div>

              {/* Size Dropdown */}
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

        {/* Notifications Table */}
        <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-700 dark:to-gray-800">
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <span className="mr-2 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </span>
              Tüm Bildirimler
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Sistemdeki {totalElements} bildirimin listesi
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <LoaderDots message="Bildirimler yükleniyor..." />
            ) : notifications.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="animate-fade-in text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 p-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bildirim bulunamadı
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Henüz bildirim bulunmuyor.
                  </p>
                  <Button
                    onClick={() => navigate("/notifications/create")}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Bildirimi Ekle
                  </Button>
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
                        Tür
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 dark:text-white">
                        İçerik
                      </TableHead>
                      <TableHead className="text-center font-semibold text-gray-900 dark:text-white">
                        İşlemler
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification: Notification, index) => (
                      <TableRow
                        key={notification.id}
                        className="animate-fade-in group transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                              {notification.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300">
                                {notification.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: #{notification.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {getTypeBadge(notification.type)}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-xs truncate text-gray-600 transition-colors group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-100">
                            {notification.content}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Görüntüle"
                              onClick={() =>
                                handleViewNotification(notification.id)
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
                                navigate(
                                  `/notifications/edit/${notification.id}`,
                                )
                              }
                              className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Gönder"
                              onClick={() => handleSend(notification)}
                              disabled={sendNotificationMutation.isPending}
                              className="from-blue-300 to-indigo-500 transition-all duration-300 hover:bg-gradient-to-b hover:text-white disabled:opacity-50"
                            >
                              {sendNotificationMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Sil"
                              onClick={() => handleDelete(notification)}
                              disabled={deleteNotificationMutation.isPending}
                              className="transition-all duration-200 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                            >
                              {deleteNotificationMutation.isPending ? (
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

      {/* Send Confirmation Modal */}
      <SendModal />
    </>
  );
}
