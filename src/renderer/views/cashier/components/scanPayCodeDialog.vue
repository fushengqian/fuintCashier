<template>
    <el-dialog class="common-dialog" title="扫码收款中..." :visible="showDialog" @close="submit" width="580px" destroy-on-close>
          <el-row>
            <el-col :span="24">
              <div class="main">
                <svg t="1666919356080" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3143" width="60" height="60" data-spm-anchor-id="a313x.7781069.0.i25"><path d="M212.924 434.56h-60.881V71.908h60.881V434.56z m149.56-362.652h-86.03V434.56h86.03V71.908z m111.842 0H431.31V434.56h43.015l0.001-362.652z m151.544 0H525.28V434.56h100.59V71.908z m88.676 0h-25.148V434.56h25.148V71.908z m70.148 0h-33.089V434.56h33.089V71.908z m91.326 0h-64.854V434.56h64.854V71.908z m-6.285 394.083h-58.569V638.8h58.569V465.991z m121.27-31.431h-86.91v31.433h86.91V434.56zM211.77 461.949h-58.572v172.808h58.57V461.949h0.002z m-89.866-27.389H34.995v31.433h86.909V434.56z m600.584 126.252v34.613a270.753 270.753 0 0 1-48.906 155.214L600.72 854.782v93.31H419.4v-93.31l-72.862-104.143a270.76 270.76 0 0 1-48.906-155.214v-34.613c0-37.384 30.305-67.69 67.691-67.69h289.474c37.385 0.002 67.691 30.309 67.691 67.69z m-106.356 20.384H395.72c21.622 38.569 62.84 64.677 110.205 64.677s88.584-26.104 110.207-64.677z" p-id="3144" fill="#707070" data-spm-anchor-id="a313x.7781069.0.i28" class="selected"></path></svg>
                <div class="amount-info">
                  <span class="amount">￥{{ payAmount.toFixed(2) }}</span>
                </div>
                <div class="tips">请使用扫码枪，扫描会员付款码！</div>
              </div>
            </el-col>
          </el-row>
        <div slot="footer" class="dialog-footer">
           <el-button type="primary" class="main-button" @click="submit()">扫码完成</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { doPay } from "@/api/cashier";
export default {
    props: {
      showDialog: {
        type:[Boolean],
        default:()=>false
      },
      payAmount: {
        type:[Number],
        default:()=>0
      },
      orderId: {
        type:[Number],
        default:()=>0
      },
      payType: {
        type:[String],
        default:()=>'MICROPAY'
      }
    },
    data(){
        return {
          loading: false
        }
    },
    methods: {
       submit(code) {
         const app = this;
         if (code == undefined) {
             app.$emit('closeDialog','scanPayCodeDialog');
         } else {
             doPay({ orderId: app.orderId, authCode: code, payType: app.payType }).then( response => {
                if (response.data.payment) {
                    app.$emit('closeDialog', 'scanPayCodeDialog');
                    app.$emit('showPayResult', { isSuccess: true, payAmount: app.payAmount, orderId: app.orderId });
                } else {
                    app.$emit('closeDialog', 'scanPayCodeDialog');
                    app.$emit('showPayResult', { isSuccess: false, isPaying: response.data.isPaying, payAmount: app.payAmount, orderId: app.orderId });
                }
             }).catch(() => {
                // empty
             });
         }
       }
    }
}
</script>
<style lang="scss" scoped>
    .main {
       height: 140px;
       padding-top: 2px;
       text-align: center;
       font-size: 16px;
       .amount-info {
          margin-bottom: 20px;
         .amount {
           font-size: 28px;
         }
       }
       .tips {
          font-size: 14px;
          color: #888888;
       }
    }
</style>
