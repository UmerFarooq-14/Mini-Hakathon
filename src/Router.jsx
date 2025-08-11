import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import ForgetPassword from "./pages/forgetPassword";
import MainPage from "./pages/mainPage";
import ProtectedRoutes from "./ProtectedRoutes";
import NoPage from "./pages/noPage"
import TaskListComp from "./pages/taskListComp";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="forgetPassword" element={<ForgetPassword />} />
        <Route path="mainPage" element={
          <ProtectedRoutes>
            <MainPage />
          </ProtectedRoutes>
        } />
        <Route path="taskListComp" element={
          <ProtectedRoutes>
            <TaskListComp />
          </ProtectedRoutes>
        } />
        <Route path="*" element={<NoPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default Router
