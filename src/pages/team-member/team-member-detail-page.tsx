import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  User,
  Hash,
  Quote,
  Loader2,
  ExternalLink,
  UserCheck,
  Award,
  MessageSquare,
  Linkedin,
} from "lucide-react";
import LoaderDots from "@/components/ui/loader-dots";
import {
  useTeamMemberById,
  useDeleteTeamMember,
} from "@/hooks/use-team-member";
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation";

export default function TeamMemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const teamMemberId = parseInt(id || "0");
  const {
    data: teamMember,
    isLoading,
    error,
  } = useTeamMemberById(teamMemberId);

  // Set loading state for profile photo if it exists
  useEffect(() => {
    if (teamMember?.profilePhoto) {
      setIsImageLoading(true);
    }
  }, [teamMember?.profilePhoto]);
  const deleteTeamMemberMutation = useDeleteTeamMember();
  const { openDeleteModal, DeleteModal } = useDeleteConfirmation();

  const handleDelete = () => {
    if (!teamMember) return;

    openDeleteModal({
      entityType: "takımUyesi",
      entityName: teamMember.name,
      onConfirm: async () => {
        await deleteTeamMemberMutation.mutateAsync(teamMember.id);
        navigate("/team-members");
      },
      requireTextConfirmation: true,
      confirmationText: teamMember.name,
      isLoading: deleteTeamMemberMutation.isPending,
    });
  };

  const handleEdit = () => {
    navigate(`/team-members/edit/${teamMemberId}`);
  };

  const handleBack = () => {
    navigate("/team-members");
  };

  if (error) {
    return (
      <div className="animate-page-fade space-y-6">
        <div className="flex h-64 items-center justify-center">
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 p-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Takım üyesi bulunamadı
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Belirtilen ID'ye sahip takım üyesi bulunamadı.
            </p>
            <Button
              onClick={handleBack}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-page-fade space-y-6">
        <LoaderDots message="Takım üyesi yükleniyor..." />
      </div>
    );
  }

  if (!teamMember) {
    return null;
  }

  return (
    <>
      <div className="animate-page-fade space-y-6">
        {/* Header */}
        <div className="animate-slide-up flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center justify-center gap-1 border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
            <div>
              <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                <Users className="mr-3 h-8 w-8 text-blue-600" />
                Takım Üyesi Detayı
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {teamMember.name} - {teamMember.title}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={deleteTeamMemberMutation.isPending}
              className="transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            >
              {deleteTeamMemberMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Sil
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center text-gray-800 dark:text-white">
                  <div className="mr-3 rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  Profil Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Profile Photo */}
                  <div className="relative mx-auto mb-6 h-32 w-32">
                    <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                      {teamMember.profilePhoto && !imageError ? (
                        <>
                          <img
                            src={teamMember.profilePhoto}
                            alt={teamMember.name}
                            className={`h-full w-full rounded-full object-cover transition-all duration-300 ${
                              isImageLoading ? "blur-sm" : "blur-0"
                            }`}
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => {
                              setImageError(true);
                              setIsImageLoading(false);
                            }}
                          />
                          {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200/80 backdrop-blur-sm dark:bg-gray-700/80">
                              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white">
                          {teamMember.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                      <UserCheck className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Name and Title */}
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {teamMember.name}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900 dark:to-indigo-900 dark:text-blue-200"
                  >
                    {teamMember.title}
                  </Badge>

                  {/* Order Number */}
                  <div className="mb-4 flex items-center justify-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {teamMember.orderNumber}. Sıra
                    </span>
                  </div>

                  {/* LinkedIn */}
                  {teamMember.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(teamMember.linkedinUrl, "_blank")
                      }
                      className="mt-4 w-full transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn Profili
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Card */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quote Card */}
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center text-gray-800 dark:text-white">
                  <div className="mr-3 rounded-lg bg-green-100 p-2 dark:bg-green-900">
                    <Quote className="h-5 w-5 text-green-600 dark:text-green-300" />
                  </div>
                  Kişisel Görüş
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative">
                  <Quote className="absolute -left-2 -top-2 h-8 w-8 text-green-200 dark:text-green-800" />
                  <blockquote className="relative rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-lg italic text-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200">
                    "{teamMember.quote}"
                  </blockquote>
                </div>
              </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="animate-scale-in border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="flex items-center text-gray-800 dark:text-white">
                  <div className="mr-3 rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  Detaylı Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          İsim
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {teamMember.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Award className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Pozisyon
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {teamMember.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                        <Hash className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Sıra Numarası
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {teamMember.orderNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                        <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          ID
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          #{teamMember.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* LinkedIn Section */}
                {teamMember.linkedinUrl && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Sosyal Medya
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          LinkedIn Profili
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {teamMember.linkedinUrl}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(teamMember.linkedinUrl, "_blank")
                        }
                        className="transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal />
    </>
  );
}
