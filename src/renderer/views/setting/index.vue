<template>
  <div id="app" class="app-container">
    <div class="main">
      <div class="nav">
        <span class="title">欢迎使用{{ systemName }}</span>
        <span class="version" v-if="appVersion">当前版本：V{{ appVersion }}</span>
        <div class="action">
          <el-button size="mini" @click="target()">返回主页</el-button>
          <el-button size="mini" type="danger" @click="logout">退出登录</el-button>
        </div>
      </div>
      <div class="body">
        <div class="side">
          <div :class="'menu-item' + (active == item.key ? ' active' : '')" v-for="item in menuList" :key="item.key" @click="switchMenu(item.key)">
            <i :class="item.icon"></i><span class="text">{{ item.name }}</span>
          </div>
        </div>
        <div class="content">
          <!-- 门店账号 start-->
          <el-card class="box-card" v-show="active == 'store'" shadow="never">
            <div slot="header" class="card-header">门店账号</div>
            <div class="info-list">
              <div class="info-item"><span class="label">门店名称：</span>{{ storeInfo.name ? storeInfo.name : '-' }}</div>
              <div class="info-item"><span class="label">门店地址：</span>{{ storeInfo.address ? storeInfo.address : '-' }}</div>
              <div class="info-item"><span class="label">联系电话：</span>{{ storeInfo.phone ? storeInfo.phone : '-' }}</div>
              <div class="info-item"><span class="label">营业时间：</span>{{ storeInfo.businessHours ? storeInfo.businessHours : '-' }}</div>
              <div class="info-item"><span class="label">收银员：</span>{{ staffInfo ? staffInfo.name : '未绑定' }}</div>
              <div class="info-item"><span class="label">登录账号：</span>{{ accountInfo.accountName ? accountInfo.accountName : '-' }}</div>
              <div class="info-item"><span class="label">姓名：</span>{{ accountInfo.realName ? accountInfo.realName : '-' }}</div>
              <div class="info-item"><span class="label">收银机名称：</span>{{ form.machineName ? form.machineName : '未设置' }}</div>
            </div>
            <div class="tip">以上为门店级数据，收银端只读展示，如需修改请到管理后台操作。</div>
          </el-card>
          <!-- 门店账号 end-->

          <!-- 本机设置 start-->
          <el-card class="box-card" v-show="active == 'local'" shadow="never">
            <div slot="header" class="card-header">本机设置<span class="sub">（只作用于当前这台收银机）</span></div>
            <el-form :model="form" label-width="140px" size="mini">
              <el-form-item label="收银机名称">
                <el-input v-model="form.machineName" placeholder="用于区分多台收银机，如：1号收银台" style="width: 300px;"/>
              </el-form-item>
              <el-form-item label="默认支付方式">
                <el-radio-group v-model="form.defaultPayType">
                  <el-radio label="MICROPAY">微信支付</el-radio>
                  <el-radio label="ALISCAN">支付宝支付</el-radio>
                  <el-radio label="CASH">现金支付</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="商品展示模式">
                <el-radio-group v-model="form.goodsMode">
                  <el-radio label="small">小图</el-radio>
                  <el-radio label="big">大图</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="扫码枪结束符">
                <el-select v-model="form.scannerEndKey" style="width: 200px;">
                  <el-option label="回车 Enter" value="13"></el-option>
                  <el-option label="Tab" value="9"></el-option>
                  <el-option label="换行 LF" value="10"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="扫码字符间隔">
                <el-input-number v-model="form.scannerGapMs" :min="5" :max="200" :step="5"></el-input-number>
                <span class="tip-inline">毫秒，超过该间隔判定为一次新的扫码，扫码不完整时可适当调大</span>
              </el-form-item>
              <el-form-item label="扫码前缀剔除">
                <el-input v-model="form.scannerStripPrefix" placeholder="部分扫码枪自带前缀，如 ]C1，留空则不处理" style="width: 300px;"/>
              </el-form-item>
              <el-form-item label="自动锁屏">
                <el-select v-model="form.autoLockMinutes" style="width: 200px;">
                  <el-option label="不自动锁屏" :value="0"></el-option>
                  <el-option label="5分钟无操作" :value="5"></el-option>
                  <el-option label="10分钟无操作" :value="10"></el-option>
                  <el-option label="30分钟无操作" :value="30"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveLocalSetting">保存设置</el-button>
                <el-button @click="loadSetting">重新载入</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <!-- 本机设置 end-->

          <!-- 打印设置 start-->
          <el-card class="box-card" v-show="active == 'print'" shadow="never">
            <div slot="header" class="card-header">打印设置</div>
            <el-form :model="form" label-width="140px" size="mini">
              <el-form-item label="打印方式">
                <el-radio-group v-model="form.printMode">
                  <el-radio label="dialog">系统打印窗口（需手动确认）</el-radio>
                  <el-radio label="silent">静默打印（直接出票）</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="打印机" v-if="form.printMode == 'silent'">
                <el-select v-model="form.printerName" placeholder="请选择打印机" style="width: 300px;">
                  <el-option v-for="item in printerList" :key="item.name" :label="item.displayName" :value="item.name"></el-option>
                </el-select>
                <el-button style="margin-left: 10px;" @click="loadPrinterList">刷新列表</el-button>
                <div class="tip-inline" v-if="!inClient">静默打印仅支持桌面客户端，当前环境不可选</div>
              </el-form-item>
              <el-form-item label="纸张宽度">
                <el-radio-group v-model="form.paperWidth">
                  <el-radio :label="58">58mm</el-radio>
                  <el-radio :label="80">80mm</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="打印份数">
                <el-input-number v-model="form.printCopies" :min="1" :max="3"></el-input-number>
              </el-form-item>
              <el-form-item label="支付成功自动打印">
                <el-switch v-model="form.autoPrintAfterPay" active-value="Y" inactive-value="N"></el-switch>
                <span class="tip-inline">开启后，收款成功不再弹窗，直接打印小票</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveLocalSetting">保存设置</el-button>
                <el-button :loading="testing" @click="handleTestPrint">打印测试页</el-button>
              </el-form-item>
            </el-form>
            <!-- 测试小票内容（隐藏，仅用于静默打印取 DOM） -->
            <div v-show="false">
              <div id="testPrintArea">
                <div style="text-align: center; font-weight: bold; font-size: 16px;">打印测试</div>
                <div>****************************************</div>
                <div>收银机：{{ form.machineName ? form.machineName : '未命名' }}</div>
                <div>时间：{{ testTime }}</div>
                <div>****************************************</div>
                <div>能看到这张小票，说明打印机配置正确。</div>
              </div>
            </div>
          </el-card>
          <!-- 打印设置 end-->

          <!-- 业务参数 start-->
          <el-card class="box-card" v-show="active == 'business'" shadow="never">
            <div slot="header" class="card-header">业务参数<span class="sub">（只读，修改请到管理后台）</span></div>
            <div class="group" v-for="group in businessList" :key="group.name">
              <div class="group-name">{{ group.name }}</div>
              <div class="info-list" v-if="group.items.length > 0">
                <div class="info-item" v-for="item in group.items" :key="item.key">
                  <span class="label">{{ item.label }}：</span>{{ item.value }}
                </div>
              </div>
              <div class="tip-inline" v-else>暂无配置</div>
            </div>
            <div class="recharge">
              <div class="group-name">会员充值方案</div>
              <div class="info-list" v-if="rechargeList.length > 0">
                <div class="info-item" v-for="item in rechargeList" :key="item.key">
                  <span class="label">充值 ￥{{ item.rechargeAmount }}</span>赠送 ￥{{ item.giveAmount }}
                </div>
              </div>
              <div class="tip-inline" v-else>未配置充值方案</div>
            </div>
          </el-card>
          <!-- 业务参数 end-->

          <!-- 网络服务 start-->
          <el-card class="box-card" v-show="active == 'network'" shadow="never">
            <div slot="header" class="card-header">网络服务</div>
            <div class="info-list">
              <div class="info-item"><span class="label">接口服务地址：</span>{{ apiHost }}</div>
              <div class="info-item"><span class="label">连接状态：</span>
                <span :class="'status ' + networkStatus">{{ networkText }}</span>
                <el-button style="margin-left: 10px;" size="mini" :loading="testingNetwork" @click="handleTestNetwork">测试连接</el-button>
              </div>
            </div>
            <div class="tip">接口地址在客户端安装包中配置，如需更换请联系服务商。</div>
          </el-card>
          <!-- 网络服务 end-->

          <!-- 更新维护 start-->
          <el-card class="box-card" v-show="active == 'maintain'" shadow="never">
            <div slot="header" class="card-header">更新维护</div>
            <div class="info-list">
              <div class="info-item"><span class="label">客户端版本：</span>V{{ appVersion }}</div>
              <div class="info-item"><span class="label">系统名称：</span>{{ systemName }}</div>
            </div>
            <div class="op-list">
              <el-button type="primary" size="mini" v-if="inClient" @click="handleCheckUpdate">检查更新</el-button>
              <el-button size="mini" @click="handleClearCache">清理本地缓存</el-button>
              <el-button size="mini" @click="handleReload">重载界面</el-button>
              <el-button size="mini" type="danger" v-if="inClient" @click="handleRestart">重启客户端</el-button>
            </div>
            <div class="tip">清理缓存不会清除登录信息与本机设置。</div>
          </el-card>
          <!-- 更新维护 end-->

          <!-- 关于 start-->
          <el-card class="box-card" v-show="active == 'about'" shadow="never">
            <div slot="header" class="card-header">关于我们</div>
            <div class="about">
              <div class="name">{{ systemName }}</div>
              <div class="version">版本：V{{ appVersion }}</div>
              <div class="desc">桌面收银客户端，支持商品扫码、会员识别、多种支付方式收款与小票打印。</div>
              <div class="desc">技术支持：fuint</div>
            </div>
          </el-card>
          <!-- 关于 end-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";
import { Message } from "element-ui";
import { removeUserId, getUserId } from '@/utils/auth';
import { init, getRechargeSetting } from "@/api/cashier";
import { getMemberSetting } from "@/api/member";
import { getSettingInfo as getOrderSetting } from "@/api/order";
import { getSettingInfo as getPointSetting } from "@/api/point";
import { getInfo } from "@/api/login";
import { getAllSettings, saveAllSettings, clearCache } from "@/utils/localSetting";
import { isElectron, getPrinterList, getAppVersion, restartApp, checkUpdate, buildPrintHtml, silentPrint } from "@/utils/printer";

const { logOut } = useUserStore();

// 业务参数中文名称映射
const LABEL_MAP = {
    pointNeedConsume: '消费多少元得1积分',
    canUsedAsMoney: '多少积分抵1元',
    exchangeNeedPoint: '兑换所需积分',
    rechargePointSpeed: '充值送积分比例',
    getCouponNeedPhone: '领券需要手机号',
    submitOrderNeedPhone: '下单需要手机号',
    loginNeedPhone: '登录需要手机号',
    deliveryFee: '配送费',
    deliveryMinAmount: '起送金额',
    payOffLine: '支持货到付款',
    isClose: '是否关闭',
    status: '状态',
    remark: '充值说明'
};

export default {
  data() {
    return {
      // 系统名称
      systemName: process.env.userConfig.SYSTEM_NAME,
      // 接口地址（只读）
      apiHost: process.env.userConfig.API_HOST,
      // 左侧菜单
      menuList: [{ name: '门店账号', key: 'store', icon: 'el-icon-s-shop' },
                 { name: '本机设置', key: 'local', icon: 'el-icon-s-tools' },
                 { name: '打印设置', key: 'print', icon: 'el-icon-printer' },
                 { name: '业务参数', key: 'business', icon: 'el-icon-s-finance' },
                 { name: '网络服务', key: 'network', icon: 'el-icon-connection' },
                 { name: '更新维护', key: 'maintain', icon: 'el-icon-refresh' },
                 { name: '关于我们', key: 'about', icon: 'el-icon-info' }],
      active: 'store',
      // 本机设置表单
      form: getAllSettings(),
      // 门店、账号、员工
      storeInfo: {},
      accountInfo: {},
      staffInfo: null,
      // 打印机
      printerList: [],
      inClient: isElectron(),
      // 客户端版本
      appVersion: '',
      // 业务参数分组
      businessList: [{ name: '会员配置', items: [] },
                     { name: '交易配置', items: [] },
                     { name: '积分配置', items: [] }],
      // 充值方案
      rechargeList: [],
      // 网络测试
      networkStatus: 'unknown',
      networkText: '未测试',
      testingNetwork: false,
      testing: false,
      testTime: ''
    }
  },
  created() {
    this.loadStoreInfo();
    this.loadBusinessSetting();
    this.loadPrinterList();
    this.loadVersion();
  },
  methods: {
    switchMenu(key) {
      this.active = key;
    },
    // 读取本机设置
    loadSetting() {
      this.form = getAllSettings();
      Message({ message: "已重新载入本机设置", type: "success" });
    },
    // 保存本机设置
    saveLocalSetting() {
      saveAllSettings(this.form);
      this.form = getAllSettings();
      Message({ message: "保存成功", type: "success" });
    },
    // 门店账号信息
    loadStoreInfo() {
      const app = this;
      const userId = getUserId() ? getUserId() : 0;
      init(userId).then(response => {
        if (response.data) {
          app.storeInfo = response.data.storeInfo ? response.data.storeInfo : {};
          app.accountInfo = response.data.accountInfo ? response.data.accountInfo : {};
          app.staffInfo = response.data.staffInfo ? response.data.staffInfo : null;
        }
      }).catch(() => {
        // empty
      });
    },
    // 业务参数（只读）
    loadBusinessSetting() {
      const app = this;
      getMemberSetting().then(response => {
        app.businessList[0].items = app.parseSetting(response.data);
      }).catch(() => { /* empty */ });
      getOrderSetting().then(response => {
        app.businessList[1].items = app.parseSetting(response.data);
      }).catch(() => { /* empty */ });
      getPointSetting().then(response => {
        app.businessList[2].items = app.parseSetting(response.data);
      }).catch(() => { /* empty */ });
      getRechargeSetting().then(response => {
        if (response.data && response.data.ruleList) {
          app.rechargeList = response.data.ruleList.map((item, index) => {
            return { key: index, rechargeAmount: item.rechargeAmount, giveAmount: item.giveAmount };
          });
        }
      }).catch(() => { /* empty */ });
    },
    // 把接口返回的参数对象转成中文键值对
    parseSetting(data) {
      const app = this;
      const items = [];
      if (!data) {
        return items;
      }
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value === null || typeof value === 'object') {
          return;
        }
        const label = LABEL_MAP[key] ? LABEL_MAP[key] : key;
        items.push({ key: key, label: label, value: app.formatValue(key, value) });
      });
      return items;
    },
    formatValue(key, value) {
      if (value === true) { return '是'; }
      if (value === false) { return '否'; }
      let text = String(value);
      if (text == 'Y' || text == 'A' || text == 'on' || text == '1') { text = '是/启用'; }
      if (text == 'N' || text == 'D' || text == 'off' || text == '0') { text = '否/停用'; }
      return text;
    },
    // 打印机列表
    loadPrinterList() {
      const app = this;
      if (!app.inClient) {
        return false;
      }
      getPrinterList().then(list => {
        app.printerList = list;
        if (!app.form.printerName) {
          const defaultPrinter = list.filter(item => item.isDefault);
          if (defaultPrinter.length > 0) {
            app.form.printerName = defaultPrinter[0].name;
          }
        }
      });
    },
    // 打印测试页
    handleTestPrint() {
      const app = this;
      if (!app.inClient) {
        app.$alert('静默打印仅支持桌面客户端');
        return false;
      }
      if (app.form.printMode != 'silent') {
        app.$alert('请先把打印方式切换为「静默打印」');
        return false;
      }
      const el = document.getElementById('testPrintArea');
      if (!el) {
        return false;
      }
      app.testTime = new Date().toLocaleString();
      app.$nextTick(() => {
        app.testing = true;
        const html = buildPrintHtml(el, app.form.paperWidth);
        silentPrint({ html: html, deviceName: app.form.printerName, copies: app.form.printCopies }).then(response => {
          app.testing = false;
          if (response && response.success) {
            Message({ message: '测试页已发送到打印机', type: 'success' });
          } else {
            app.$alert(response && response.message ? response.message : '打印失败，请检查打印机设置');
          }
        }).catch(() => {
          app.testing = false;
          app.$alert('打印失败，请检查打印机设置');
        });
      });
    },
    // 测试接口连接
    handleTestNetwork() {
      const app = this;
      app.testingNetwork = true;
      app.networkStatus = 'unknown';
      app.networkText = '测试中...';
      const startTime = new Date().getTime();
      getInfo().then(() => {
        const useTime = new Date().getTime() - startTime;
        app.testingNetwork = false;
        app.networkStatus = 'success';
        app.networkText = '正常，耗时 ' + useTime + ' ms';
      }).catch(() => {
        app.testingNetwork = false;
        app.networkStatus = 'fail';
        app.networkText = '连接失败，请检查网络';
      });
    },
    // 客户端版本
    loadVersion() {
      const app = this;
      if (!app.inClient) {
        return false;
      }
      getAppVersion().then(version => {
        app.appVersion = version ? version : '';
      });
    },
    // 检查更新
    handleCheckUpdate() {
      checkUpdate().then(() => {
        Message({ message: "已触发检查更新，请留意提示", type: "success" });
      });
    },
    // 清理缓存
    handleClearCache() {
      const count = clearCache();
      Message({ message: "已清理 " + count + " 项本地缓存", type: "success" });
    },
    // 重载界面
    handleReload() {
      window.location.reload();
    },
    // 重启客户端
    handleRestart() {
      const app = this;
      app.$confirm('确定要重启客户端吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restartApp();
      }).catch(() => {});
    },
    // 退出登录
    logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logOut().then(() => {
          Message({ message: "退出成功", type: "success" });
          removeUserId();
          this.$router.push('/login');
        })
      }).catch(() => {});
    },
    target() {
       this.$router.push('/');
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
   .main {
      background: #f2f4f6;
      height: 100%;
      width: 100%;
      display: block;
     .nav {
       display: flex;
       align-items: center;
       height: 45px;
       width: 100%;
       background: #f5f5f5;
       border-bottom: #cccccc solid 1px;
       padding: 0px 20px 0px 40px;
       .title {
          font-size: 15px;
          color: #333333;
       }
       .version {
          margin-left: 15px;
          font-size: 12px;
          color: #999999;
       }
       .action {
          margin-left: auto;
       }
     }
     .body {
       display: flex;
       height: calc(100% - 45px);
       padding: 15px;
       .side {
          width: 180px;
          flex-shrink: 0;
          background: #ffffff;
          border-radius: 6px;
          padding: 10px 0px 10px 0px;
          height: 100%;
          overflow: auto;
          .menu-item {
             height: 40px;
             line-height: 40px;
             padding-left: 20px;
             cursor: pointer;
             color: #666666;
             font-size: 14px;
             i {
               margin-right: 6px;
             }
          }
          .menu-item:hover {
             background: #f2f8f8;
          }
          .active {
             background: #00acac;
             color: #ffffff;
          }
          .active:hover {
             background: #00acac;
          }
       }
       .content {
          flex: 1;
          margin-left: 15px;
          overflow: auto;
          .box-card {
             margin-bottom: 15px;
             .card-header {
                font-size: 15px;
                font-weight: bold;
                color: #333333;
                .sub {
                   font-size: 12px;
                   font-weight: normal;
                   color: #999999;
                   margin-left: 8px;
                }
             }
          }
          .info-list {
             display: flex;
             flex-wrap: wrap;
             .info-item {
                width: 45%;
                min-width: 260px;
                font-size: 13px;
                color: #666666;
                margin-bottom: 10px;
                .label {
                   color: #999999;
                }
                .status {
                   font-weight: bold;
                }
                .success {
                   color: #00acac;
                }
                .fail {
                   color: #ff5b57;
                }
                .unknown {
                   color: #999999;
                }
             }
          }
          .group {
             margin-bottom: 15px;
             .group-name {
                font-size: 14px;
                font-weight: bold;
                color: #333333;
                margin-bottom: 8px;
                padding-left: 8px;
                border-left: solid 3px #00acac;
             }
          }
          .recharge {
             margin-bottom: 15px;
             .group-name {
                font-size: 14px;
                font-weight: bold;
                color: #333333;
                margin-bottom: 8px;
                padding-left: 8px;
                border-left: solid 3px #00acac;
             }
          }
          .tip {
             font-size: 12px;
             color: #999999;
             margin-top: 5px;
          }
          .tip-inline {
             font-size: 12px;
             color: #999999;
             margin-left: 10px;
          }
          .op-list {
             margin-top: 15px;
             .el-button {
                margin-right: 10px;
             }
          }
          .about {
             text-align: center;
             padding: 20px 0px 20px 0px;
             .name {
                font-size: 20px;
                color: #333333;
                margin-bottom: 10px;
             }
             .version {
                font-size: 13px;
                color: #999999;
                margin-bottom: 20px;
             }
             .desc {
                font-size: 13px;
                color: #666666;
                margin-bottom: 5px;
             }
          }
       }
     }
   }
</style>
