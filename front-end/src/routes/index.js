import HomePage from "../pages/HomePage/HomePage";
import ProjectPage from "../pages/ProjectPage/ProjectPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage/ProjectDetailsPage";
import ProjectManagementPage from "../pages/ProjectManage/ProjectManagePage";


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
    }
]