<template>
  <div class="login-container">
    <div class="login-from-box">
      <el-form class="login-form" ref="loginForm" autocomplete="on" :model="loginForm" :rules="loginRules" label-position="left">
        <h3 class="title">{{ systemName }}</h3>
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" clearable v-model="loginForm.username" autocomplete="on" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" clearable @keyup.enter.native="handleLogin()" v-model="loginForm.password"
            autocomplete="on" placeholder="密码"></el-input>
          <span class="show-pwd" @click="showPwd()">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="captchaCode">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="eye"></svg-icon>
          </span>
          <el-input
              v-model="loginForm.captchaCode"
              auto-complete="off"
              placeholder="请输入验证码"
              style="width: 63%"
              clearable
              @keyup.enter.native="handleLogin"
          >
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
        <div class="login-btn">
          <button type="button" class="btn" @click="handleLogin()">立即登录</button>
        </div>
        <div class="tips">
          <span>Copyright © 2020-2023 <a target="_blank" href="https://www.fuint.cn">fuint.cn</a> 延禾技术 All Rights Reserved.</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";
import { useRouter } from "@/hooks/use-router";
import { getCodeImg } from "@/api/login";
const { login } = useUserStore();
const router = useRouter();
export default {
  data: () => {
    return {
       systemName: process.env.userConfig.SYSTEM_NAME,
       loading: false,
       loginForm: { uuid : '', username: "fuint", password: "123456", captchaCode: '' },
       codeUrl: '',
       pwdType: 'password',
       loginRules: {
          username: [
            { required: true, trigger: "blur", message: "请输入您的账号" }
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入您的密码" }
          ],
          captchaCode: [{ required: true, trigger: "change", message: "请输入验证码" }, { min: 4, max: 6, message: '请输入正确验证码', trigger: 'blur' }]
       }
    }
  },
  created() {
    this.getCode();
  },
  methods: {
    getCode() {
      const app = this;
      getCodeImg().then(res => {
          app.codeUrl = res.data.captcha;
          app.loginForm.uuid = res.data.uuid;
      })
    },
    showPwd() {
      if (this.pwdType === "password") {
          this.pwdType = "";
      } else {
          this.pwdType = "password";
      }
    },
    handleLogin() {
      const app = this;
      app.$refs.loginForm.validate(valid => {
        if (valid) {
           app.loading = true;
           login(app.loginForm).then(() => {
               app.loading = false;
               console.log('登录成功了!');
               app.$router.push({ path: "/" }).catch(()=>{});
               router.push({ path: "/" }).catch((err) => {
                   console.log('跳转失败...', err);
               });
               console.log('登录成功了...');
           }).catch(() => {
               app.loading = false;
           })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #eee;
$dark_gray: #889aa4;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-image: url("../../assets/images/bg.png");
  background-position: center;
  color: #ffffff;

  ::v-deep .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  ::v-deep .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .login-from-box {
    position: relative;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 150px auto;
      align-items: center;
      color: white;
      backdrop-filter: saturate(180%) blur(20px);
      background: rgba(0, 0, 0, .65);
      border-radius: 10px;
      box-shadow: 0 0.4px 0.6px rgba(0, 0, 0, 0.141),
        0 1px 1.3px rgba(0, 0, 0, 0.202), 0 1.9px 2.5px rgba(0, 0, 0, 0.25),
        0 3.4px 4.5px rgba(0, 0, 0, 0.298), 0 6.3px 8.4px rgba(0, 0, 0, 0.359),
        0 15px 20px rgba(0, 0, 0, .26);
      .login-btn {
        .btn {
          position: relative;
          width: 100%;
          padding: 6px 0;
          margin: 10px 0 36px 0;
          font-size: 1.2em;
          color: white;
          background: transparent;
          border: 2px solid #ffffff;
          outline: none;
          cursor: pointer;
          overflow: hidden;
          transition: 0.5s;

          &::before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(120deg,
                transparent,
                hsla(204, 70%, 53%, 0.5),
                transparent);
            transform: translateX(-100%);
            transition: 0.5s;
          }

          &:hover {
            box-shadow: 0 0 20px 10px hsla(204, 70%, 53%, 0.5);
          }

          &:hover::before {
            transform: translateX(100%);
          }
        }
      }
      .login-code {
          width: 100px;
          height: 48px;
          float: right;
          img {
            cursor: pointer;
            vertical-align: middle;
            height: 48px;
            border-radius: 1px;
          }
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      text-align: center;
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }

    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
