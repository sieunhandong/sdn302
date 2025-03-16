import HomePage from "../pages/HomePage/HomePage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage/ProjectDetailsPage";
import ProjectManagementPage from "../pages/ProjectManage/ProjectManagePage";
import ApplyProjectPosition from "../pages/ApplyProjectPosition/ApplyProjectPosition";
import UserInformation from "../pages/UserInformation/UserInformation";
import InternOfProject from "../pages/InternOfProject/InternOfProject";
import MyProject from "../pages/MyProject/MyProject";

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
        path: "/project-management",
        page: ProjectManagementPage,
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
    }
]
