import {LoginDto} from "../types/LoginDto.ts";
import apiHandler from "../utils/ApiHandler.ts";
import Cookies from "js-cookie";
import {UserEntity} from "../types/UserEntity.ts";

export const AuthService = {
       async login(loginDTO: LoginDto) {
         // assume your backend now returns { token: string, userInfo: {...} }
             const { data } = await apiHandler.post("/user_log/login", loginDTO);
             const { token, userInfo } = data;

             // 1️⃣ store the JWT in a cookie so ApiHandler will pick it up
             Cookies.set("token", token, {
                 expires: 1,                    // 1 day
                 secure: process.env.NODE_ENV === "production",
                 sameSite: "None",              // allow cross-site
             });

             // 2️⃣ you can still store userInfo separately if you use it
             Cookies.set("info", JSON.stringify(userInfo), { expires: 1 });

             return userInfo;
       },

    async register(registerDTO: UserEntity) {
        await apiHandler.post('/user_log/register', registerDTO)
    },

    async duplicate(userId: string) {
        const response = await apiHandler.get(`/user_log/duplicate/${userId}`);

        return response.data;
    },

    async findUserId(email: string) {
        await apiHandler.post(`/user_log/findid/${email}`);
    },

    async findPassword(email: string) {
        await apiHandler.post(`/user_log/resetpassword/${email}`);
    },

    async resetPassword(token: string, newPassword: string) {
        await apiHandler.put('/user_log/savenewpassword', {
            token,
            newPassword
        });
    },

    logout() {
        Cookies.remove('info');
        Cookies.remove('token');
    }
};