<template>
    <el-dialog class="common-dialog" title="订单打印预览" :visible="showDialog" width="380px" @close="cancel" append-to-body destroy-on-close>
        <div v-if="orderInfo.id">
            <receiptPaper paperId="printArea" :orderInfo="orderInfo" :storeInfo="storeInfo" :machineName="machineName"/>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="printSetting.printMode == 'silent'" type="primary" class="main-button" :loading="printing" @click="handleSilentPrint">打印</el-button>
            <el-button v-else type="primary" class="main-button" v-print="printObj" @click="handlePrint">打印</el-button>
            <el-button @click="cancel()">取消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import receiptPaper from "./receiptPaper";
import { buildPrintHtml, silentPrint } from "@/utils/printer";
import { getAllSettings, getSetting } from "@/utils/localSetting";
export default {
    components: { receiptPaper },
    props: {
      showDialog: {
        type:[Boolean],
        default:()=>false
      },
      orderInfo: {
        type:[Object],
        default:()=>{}
      },
      storeInfo: {
        type:[Object],
        default:()=>{}
      }
    },
    data(){
        return {
          printing: false,
          // 收银机名称
          machineName: getSetting('machineName'),
          // 打印相关本机设置
          printSetting: getAllSettings(),
          printObj: {
            id: "printArea",
            popTitle: '订单明细',
            extraCss: '',
            preview: false,
            previewTitle: '预览的标题',
            previewPrintBtnLabel: '预览结束，开始打印',
            extraHead: '',
            standard: 'loose'
          }
        }
    },
    methods: {
        handlePrint() {
           this.$emit('closeDialog', 'printOrder');
        },
        // 静默打印：直接输出到指定打印机，不弹系统打印窗口
        handleSilentPrint() {
           const app = this;
           const setting = getAllSettings();
           const el = document.getElementById('printArea');
           if (!el) {
              app.$alert('未获取到小票内容，请稍后重试');
              return false;
           }
           app.printing = true;
           const html = buildPrintHtml(el, setting.paperWidth);
           silentPrint({ html: html, deviceName: setting.printerName, copies: setting.printCopies }).then(response => {
              app.printing = false;
              if (response && response.success) {
                 app.$message({ message: '已发送到打印机：' + (setting.printerName ? setting.printerName : '默认打印机'), type: 'success' });
                 app.$emit('closeDialog', 'printOrder');
              } else {
                 app.$alert(response && response.message ? response.message : '打印失败，请检查打印机设置');
              }
           }).catch(() => {
              app.printing = false;
              app.$alert('打印失败，请检查打印机设置');
           });
        },
        cancel() {
           this.$emit('closeDialog', 'printOrder');
        }
    }
}
</script>
<style scoped lang="scss">
   .dialog-footer {
      text-align: center;
   }
</style>
