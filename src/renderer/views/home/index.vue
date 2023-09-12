<template>
  <div id="app" class="app-container">
    <el-drawer
        :withHeader="false"
        :visible.sync="isOpen"
        direction="ttb"
        size="100%"
        :show-close="false">
      <div class="main">
         <div class="nav">欢迎使用{{ systemName }}</div>
         <div class="tool">
           <div class="item" @click="target('/cashier')"><i class="el-icon-user"></i>进入收银</div>
           <div class="item" @click="target('/setting')"><i class="el-icon-setting"></i>系统设置</div>
           <div class="item logout" @click="logout"><i class="icon el-icon-switch-button"></i>退出</div>
         </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";
import { Message } from "element-ui";
const { logOut } = useUserStore();
export default {
  data() {
    return {
      // 系统名称
      systemName: process.env.userConfig.SYSTEM_NAME,
      isOpen: true,
    }
  },
  methods: {
    target(url) {
       this.$router.push( url );
    },
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logOut().then(() => {
          Message({
            message: "退出成功",
            type: "success"
          });
          this.$router.push( '/login' );
        })
      }).catch(() => {});
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
   .main {
      background: #00acac;
      height: 100%;
      width: 100%;
      display: block;
     .nav {
       display: block;
       clear: both;
       height: 45px;
       width: 100%;
       background: #f5f5f5;
       border-bottom: #cccccc solid 1px;
       padding: 10px 0px 0px 40px;
       margin-bottom: 12%;
     }
     .tool {
       width: 1000px;
       height: 300px;
       margin: 0 auto;
       border: solid 1px #cccccc;
       border-radius: 10px;
       color: #ffffff;
       text-align: center;
       padding-top: 92px;
       padding-left: 125px;
       backdrop-filter: saturate(180%) blur(20px);
       background: rgba(0, 0, 0, .65);
       border-radius: 10px;
       box-shadow: 0 0.4px 0.6px rgba(0, 0, 0, 0.141),
       0 1px 1.3px rgba(0, 0, 0, 0.202), 0 1.9px 2.5px rgba(0, 0, 0, 0.25),
       0 3.4px 4.5px rgba(0, 0, 0, 0.298), 0 6.3px 8.4px rgba(0, 0, 0, 0.359),
       0 15px 20px rgba(0, 0, 0, .26);
       .item {
          float: left;
          width: 300px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          border: solid 3px #ffffff;
          color: #ffffff;
          cursor: pointer;
          font-weight: bold;
          margin-left: 50px;
          border-radius: 6px;
       }
       .item:hover {
         border: #00acac 3px solid;
       }
       .logout {
          border: none;
          width: 50px;
          height: 50px;
          border: #ffffff 2px solid;
          border-radius: 5px;
          line-height: 50px;
          margin-top: 36px;
          margin-left: 60px;
          font-weight: normal;
          font-size: 10px;
          color: #ffffff;
          background: #e03e2d;
          i {
            margin-right: 1px;
            font-size: 12px;
            font-weight: bold;
          }
       }
     }
   }
</style>
