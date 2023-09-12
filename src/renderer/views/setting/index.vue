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
         <div class="content">
           <div class="name">{{ systemName }}</div>
           <div class="version">当前版本：V3.06</div>
           <div class="back" @click="target()">
             <el-button type="danger" size="mini">返回主页</el-button>
           </div>
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
    target() {
       this.$router.push( '/' );
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
     .content {
       width: 500px;
       height: 350px;
       margin: 0 auto;
       border: solid 1px #cccccc;
       border-radius: 5px;
       color: #666666;
       text-align: center;
       backdrop-filter: saturate(180%) blur(20px);
       background: #ffffff;
       border-radius: 10px;
       .name {
          color: #666666;
          margin-top: 100px;
          font-size: 20px;
          margin-bottom: 50px;
       }
       .back {
          margin-top: 50px;
       }
     }
   }
</style>
