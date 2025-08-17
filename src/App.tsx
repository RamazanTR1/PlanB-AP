import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginProvider } from "./providers/login-state-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import DashboardPage from "./pages/dashboard/dashboard-page";
import LoginPage from "./pages/login/login-page";
import UserListPage from "./pages/user/user-list-page";
import UserDetailPage from "./pages/user/user-detail-page";
import UserCreatePage from "./pages/user/user-create-page";
import UserEditPage from "./pages/user/user-edit-page";
import ServiceListPage from "./pages/service/service-list-page";
import ServiceCreatePage from "./pages/service/service-create-page";
import ServiceDetailPage from "./pages/service/service-detail-page";
import ServiceEditPage from "./pages/service/service-edit-page";
import TagListPage from "./pages/tag/tag-CRUD-page";
import TeamMemberListPage from "./pages/team-member/team-member-list-page";
import TeamMemberDetailPage from "./pages/team-member/team-member-detail-page";
import TeamMemberCreatePage from "./pages/team-member/team-member-create-page";
import TeamMemberEditPage from "./pages/team-member/team-member-edit-page";
import { Toaster } from "@/components/ui/sonner";
import NotificationSubscriberListPage from "./pages/notification-subscribers/notification-subscriber-list-page";
import ContactListPage from "./pages/contact/contact-list-page";
import ContactDetailPage from "./pages/contact/contact-detail-page";
import PartnerCRUDPage from "./pages/partner/partner-CRUD-page";
import PortfolioListPage from "./pages/portfolio/portfolio-list-page";
import PortfolioCreatePage from "./pages/portfolio/portfolio-create-page";
import PortfolioEditPage from "./pages/portfolio/portfolio-edit-page";
import PortfolioDetailPage from "./pages/portfolio/portfolio-detail-page";
import SettingsEditPage from "./pages/settings/settings-edit-page";
import SliderListPage from "./pages/slider/slider-list-page";
import SliderCreatePage from "./pages/slider/slider-create-page";
import SliderEditPage from "./pages/slider/slider-edit-page";
import SliderDetailPage from "./pages/slider/slider-detail-page";
import NotificationListPage from "./pages/notification/notification-list-page";
import NotificationCreatePage from "./pages/notification/notification-create-page";
import NotificationEditPage from "./pages/notification/notification-edit-page";
import NotificationDetailPage from "./pages/notification/notification-detail-page";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AdminLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/edit/:id" element={<UserEditPage />} />
                <Route path="/services" element={<ServiceListPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route
                  path="/services/create"
                  element={<ServiceCreatePage />}
                />
                <Route
                  path="/services/edit/:id"
                  element={<ServiceEditPage />}
                />
                <Route path="/tags" element={<TagListPage />} />
                <Route path="/team-members" element={<TeamMemberListPage />} />
                <Route
                  path="/team-members/:id"
                  element={<TeamMemberDetailPage />}
                />
                <Route
                  path="/team-members/create"
                  element={<TeamMemberCreatePage />}
                />
                <Route
                  path="/team-members/edit/:id"
                  element={<TeamMemberEditPage />}
                />
                <Route
                  path="/notification-subscribers"
                  element={<NotificationSubscriberListPage />}
                />
                <Route path="/contacts" element={<ContactListPage />} />
                <Route path="/contacts/:id" element={<ContactDetailPage />} />
                <Route path="/partners" element={<PartnerCRUDPage />} />
                <Route path="/portfolios" element={<PortfolioListPage />} />
                <Route
                  path="/portfolios/create"
                  element={<PortfolioCreatePage />}
                />
                <Route
                  path="/portfolios/edit/:id"
                  element={<PortfolioEditPage />}
                />
                <Route
                  path="/portfolios/:id"
                  element={<PortfolioDetailPage />}
                />
                <Route path="/sliders" element={<SliderListPage />} />
                <Route path="/sliders/create" element={<SliderCreatePage />} />
                <Route path="/sliders/edit/:id" element={<SliderEditPage />} />
                <Route path="/sliders/:id" element={<SliderDetailPage />} />
                <Route path="/settings" element={<SettingsEditPage />} />
                <Route
                  path="/notifications"
                  element={<NotificationListPage />}
                />
                <Route
                  path="/notifications/create"
                  element={<NotificationCreatePage />}
                />
                <Route
                  path="/notifications/edit/:id"
                  element={<NotificationEditPage />}
                />
                <Route
                  path="/notifications/:id"
                  element={<NotificationDetailPage />}
                />
              </Route>
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </LoginProvider>
    </QueryClientProvider>
  );
}
