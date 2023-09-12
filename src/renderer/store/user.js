import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { usePermissionStore } from './permission'
import { login, getInfo } from '@/api/login'

const TokenKey = 'Access-Token'
const store = () => {
    return {
        token: JSON.parse(localStorage.getItem(TokenKey)),
        name: JSON.parse(localStorage.getItem('name')),
        roles: JSON.parse(localStorage.getItem('roles'))
    }
}

export const useUserStore = defineStore({
    id: 'user',
    store,
    actions: {
        login(data) {
            return new Promise((resolve, reject) => {
                const { username } = data;
                const { password } = data;
                const { captchaCode } = data;
                const { uuid } = data;

                login(username, password, captchaCode, uuid).then(res => {
                    console.log('登录返回信息：', res.data);
                    localStorage.setItem(TokenKey, res.data.token);
                    this.token = res.data.token;
                    localStorage.setItem("roles", JSON.stringify(["admin"]));
                    localStorage.setItem("name", "Super Admin");
                    this.name = "Super Admin";
                    this.roles = ["admin"];

                    resolve()
                }).catch(error => {
                    reject(error);
                })
            })

        },
        logOut() {
            return new Promise((resolve, reject) => {
                const { ResetRoutes } = usePermissionStore()
                localStorage.setItem(TokenKey, "");
                localStorage.setItem("roles", JSON.stringify([]));
                localStorage.setItem("name", "");
                this.token = "";
                this.name = "";
                this.roles = [];
                ResetRoutes();
                resetRouter();
                resolve();
            })
        },
        GetUserInfo() {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    const user = res.data.accountInfo;
                    localStorage.setItem("name", user.accountName);
                    localStorage.setItem("permissions", JSON.stringify(res.data.permissions));
                    localStorage.setItem("roles", JSON.stringify(res.data.roles));
                    this.name = user.accountName;
                    this.roles = res.data.roles;
                    resolve(this.roles);
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})
