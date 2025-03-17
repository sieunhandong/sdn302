import HomePage from "../pages/HomePage/HomePage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage/ProjectDetailsPage";
import ProjectManagementPage from "../pages/ProjectManage/ProjectManagePage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ChangePasswordPage from "../pages/ChangePasswordPage/ChangePasswordPage";
import UserManagePage from "../pages/UserManagePage/UserManagePage";
import ReportPage from "../pages/InternReports/InternReports";
import ApplyProjectPosition from "../pages/ApplyProjectPosition/ApplyProjectPosition";
import UserInformation from "../pages/UserInformation/UserInformation";
import InternOfProject from "../pages/InternOfProject/InternOfProject";
import MyProject from "../pages/MyProject/MyProject";

import InterviewSchedulePage from "../pages/InterviewSchedulePage/InterviewSchedulePage";
import InterViewSchedule from "../pages/InterviewSchedule/InterviewSchedule";
import DetailsProjectPage from "../pages/DetailsProjectPage/DetailsProjectPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true
  },
  {
    path: "/project",
    page: ProjectPage,
    isShowHeader: true
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false
  },
  {
    path: "/project/:id",
    page: ProjectDetailsPage,
    isShowHeader: true
  },
  {
    path: "/project-details/:id",
    page: DetailsProjectPage,
    isShowHeader: true
  },
  {
    path: "/project-management",
    page: ProjectManagementPage,
    isShowHeader: true
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowHeader: true
  },
  {
    path: "/change-password",
    page: ChangePasswordPage,
    isShowHeader: true
  },
  {
    path: "/users-management",
    page: UserManagePage,
    isShowHeader: true
  },
  {
    path: "/apply-project-position/:projectId",
    page: ApplyProjectPosition,
    isShowHeader: true
  },
  {
    path: "/get-user-info",
    page: UserInformation,
    isShowHeader: true
  },
  {
    path: "/get-interns-by-project/:projectId",
    page: InternOfProject,
    isShowHeader: true
  },
  {
    path: "/get-project-by-user-id/:userId",
    page: MyProject,
    isShowHeader: true
  },
  {
    path: "/schedule-management",
    page: InterviewSchedulePage,
    isShowHeader: true,
  },
  {
    path: "/interview-schedule",
    page: InterViewSchedule,
    isShowHeader: true,
  },
  {
    path: "/report",
    page: ReportPage,
    isShowHeader: true

  }
];
