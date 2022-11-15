import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import TodosIndexPage from "main/pages/Todos/TodosIndexPage";
import TodosCreatePage from "main/pages/Todos/TodosCreatePage";
import TodosEditPage from "main/pages/Todos/TodosEditPage";

import DiningCommonsIndexPage from "main/pages/DiningCommons/DiningCommonsIndexPage";
import DiningCommonsCreatePage from "main/pages/DiningCommons/DiningCommonsCreatePage";
import DiningCommonsEditPage from "main/pages/DiningCommons/DiningCommonsEditPage";


import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";
import MenuItemCreatePage from "main/pages/MenuItem/MenuItemCreatePage";
import MenuItemEditPage from "main/pages/MenuItem/MenuItemEditPage";

import OrganizationIndexPage from "main/pages/Organization/OrganizationIndexPage";
import OrganizationCreatePage from "main/pages/Organization/OrganizationCreatePage";
import OrganizationEditPage from "main/pages/Organization/OrganizationEditPage";

import RecommendationIndexPage from "main/pages/Recommendation/RecommendationIndexPage";
import RecommendationCreatePage from "main/pages/Recommendation/RecommendationCreatePage";
import RecommendationEditPage from "main/pages/Recommendation/RecommendationEditPage";

import ReviewIndexPage from "main/pages/Review/ReviewIndexPage";
import ReviewCreatePage from "main/pages/Review/ReviewCreatePage";
import ReviewEditPage from "main/pages/Review/ReviewEditPage";

import HelpRequestsIndexPage from "main/pages/HelpRequests/HelpRequestsIndexPage";
import HelpRequestsCreatePage from "main/pages/HelpRequests/HelpRequestsCreatePage";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

import ArticleIndexPage from "main/pages/Article/ArticleIndexPage"
import ArticleCreatePage from "main/pages/Article/ArticleCreatePage"
import ArticleEditPage from "main/pages/Article/ArticleEditPage"

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/todos/list" element={<TodosIndexPage />} />
              <Route exact path="/todos/create" element={<TodosCreatePage />} />
              <Route exact path="/todos/edit/:todoId" element={<TodosEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/diningCommons/list" element={<DiningCommonsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/diningCommons/create" element={<DiningCommonsCreatePage />} />
              <Route exact path="/diningCommons/edit/:code" element={<DiningCommonsEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/menuitem/list" element={<MenuItemIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/menuitem/create" element={<MenuItemCreatePage />} />
              <Route exact path="/menuitem/edit/:id" element={<MenuItemEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsborganization/list" element={<OrganizationIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsborganization/create" element={<OrganizationCreatePage />} />
              <Route exact path="/ucsborganization/edit/:code" element={<OrganizationEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/recommendation/list" element={<RecommendationIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/recommendation/create" element={<RecommendationCreatePage />} />
              <Route exact path="/recommendation/edit/:id" element={<RecommendationEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/review/list" element={<ReviewIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/review/create" element={<ReviewCreatePage />} />
              <Route exact path="/review/edit/:id" element={<ReviewEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/helprequest/list" element={<HelpRequestsIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/helprequest/create" element={<HelpRequestsCreatePage />} />
              <Route exact path="/helprequest/edit/:id" element={<HelpRequestsEditPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/article/list" element={<ArticleIndexPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/article/create" element={<ArticleCreatePage />} />
              <Route exact path="/article/edit/:id" element={<ArticleEditPage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
