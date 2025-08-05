import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.tsx";
import BasicLayout from "../layouts/BasicLayout.tsx";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Forgot from "../pages/auth/Forgot.tsx";
import Search from "../pages/basic/Search.tsx";
import NewPost from "../pages/basic/NewPost.tsx";
import Message from "../pages/basic/Message.tsx";
import Profile from "../pages/basic/Profile.tsx";
import Notification from "../pages/basic/Notification.tsx";
import Settings from "../pages/basic/Settings.tsx";
import { ClientUrl } from "../constants/ClientUrl.ts";
import Home from "../pages/basic/Home.tsx";
import Admin from "../pages/admin/Admin.tsx";
import Index from "../pages/Index.tsx";
import ResetPassword from "../pages/auth/ResetPassword.tsx";
import SpecificMessage from "../pages/specific/SpecificMessage.tsx";
import SpecificPost from "../pages/specific/SpecificPost.tsx";
import Baik from "../pages/basic/baik.tsx";
import OthersProfile from "../pages/specific/OthersProfile.tsx";

const Router: React.FC = () => {
    return (
        <Routes>
            {/* 🔹 메인 경로 */}
            <Route element={<ProtectedRoute />}>
                <Route path={ClientUrl.INDEX} element={<Index />} />
            </Route>

            {/* 🔹 로그인 & 회원가입 관련 페이지 (보호 X) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path={ClientUrl.LOGIN} element={<Login />} />
                    <Route path={ClientUrl.REGISTER} element={<Register />} />
                    <Route path={ClientUrl.FORGOT} element={<Forgot />} />
                    <Route path={ClientUrl.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
            </Route>

            {/* 🔹 관리자 페이지 (관리자만 접근 가능) */}
            <Route element={<ProtectedRoute isAdminRoute />}>
                <Route element={<BasicLayout />}>
                    <Route path={ClientUrl.ADMIN} element={<Admin />} />
                </Route>
            </Route>

            {/* 🔹 로그인 후 접근 가능한 모든 페이지 (일반 사용자) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<BasicLayout />}>
                    <Route path={ClientUrl.HOME} element={<Home />} />
                    <Route path={ClientUrl.SEARCH} element={<Search />} />
                    <Route path={ClientUrl.PROFILE} element={<Profile />} />
                    <Route path={ClientUrl.BAIK} element={<Baik />} />

                    <Route path={ClientUrl.NOTIFICATION} element={<Notification />} />
                    <Route path={ClientUrl.SETTINGS} element={<Settings />} />
                    <Route path={ClientUrl.MESSAGE} element={<Message />} />
                    <Route path={ClientUrl.SPECIFICMESSAGE} element={<SpecificMessage />} />
                    <Route path={`${ClientUrl.OTHERSPROFILE}/:userId`} element={<OthersProfile />} />
                </Route>
                <Route path={ClientUrl.NEWPOST} element={<NewPost />} />
                <Route path={`${ClientUrl.SPECIFICPOST}/:postId`} element={<SpecificPost />} />
            </Route>
        </Routes>
    );
};

export default Router;
