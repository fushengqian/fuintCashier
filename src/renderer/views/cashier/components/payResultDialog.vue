<template>
    <el-dialog class="common-dialog" title="支付结果" :visible="showDialog" @close="submit" width="580px" destroy-on-close>
          <el-row>
            <el-col :span="24">
              <div class="main">
                <div class="success" v-if="payResult.isSuccess">
                  <svg t="1666918162017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1190" width="48" height="48"><path d="M511.2879 0C229.296245 0 0 229.296245 0 511.2879s229.296245 511.2879 511.2879 511.2879 511.2879-229.296245 511.2879-511.2879S793.279555 0 511.2879 0z m0 995.515994C244.962448 995.515994 28.484006 777.613352 28.484006 511.2879S244.962448 28.484006 511.2879 28.484006s482.803894 216.478442 482.803894 482.803894c1.4242 266.325452-216.478442 484.228095-482.803894 484.228094z m215.054242-655.132128l37.029207 37.029208-283.415855 327.566064-42.726009 49.847009-38.453407-49.847009-138.147427-182.297636 37.029207-37.029207 139.571627 105.39082L726.342142 340.383866z" p-id="1191" fill="#ff5b57"></path></svg>
                  <div class="txt">支付成功</div>
                </div>
                <div class="fail" v-if="!payResult.isSuccess && !payResult.isPaying">
                  <svg t="1666919015577" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2800" width="48" height="48"><path d="M1018.146525 511.98465c0.005117 278.510808-226.653315 503.751921-506.765642 503.603538-279.697876-0.148384-505.875341-226.023964-505.522291-504.84689C6.206526 232.639824 233.417559 7.992245 513.903403 8.416929 792.09186 8.836496 1018.141408 234.579044 1018.146525 511.98465zM512.890301 69.525369c-244.188158-0.281417-445.600919 199.555409-445.703253 442.223914-0.102333 241.634937 200.281977 442.055064 442.648598 442.730465 244.592375 0.680518 446.414471-198.414391 446.982421-440.939629C957.380902 270.56973 756.658892 69.806786 512.890301 69.525369z" p-id="2801" fill="#ff5b57"></path><path d="M769.491511 698.518123c-27.241173 24.841453-50.972308 46.484985-71.561805 65.258062-60.315355-81.416519-120.30836-162.398121-183.079718-247.135362-75.39931 80.541568-136.139349 161.528287-187.423775 251.719902-24.774936-20.44623-48.291171-39.853775-72.92284-60.182321 37.730355-42.309779 74.089442-83.759956 111.221146-124.498916 28.689192-31.477779 57.710968-62.709959 87.878879-92.760186 13.262419-13.211253 11.190166-21.633298-1.361035-33.109999C388.258352 399.295018 324.745076 340.269065 260.812232 281.186829c24.099535-30.817728 28.653375-33.544916 62.300625-9.30723 60.622355 43.675931 119.858092 89.362714 178.213761 136.031899 16.035657 12.822385 25.148454 13.681987 40.344976-0.271184 60.873073-55.899665 126.704202-105.101604 202.456563-143.640394 5.275291 9.12303 9.772848 16.895258 13.380103 23.137601-65.288762 58.033318-129.344406 114.976785-194.346635 172.759386C633.689862 541.46181 701.357877 619.716224 769.491511 698.518123z" p-id="2802" fill="#ff5b57"></path></svg>
                  <div class="txt">支付失败</div>
                </div>
                <div class="fail" v-if="!payResult.isSuccess && payResult.isPaying">
                  <svg t="1727329936552" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13383" width="48" height="48"><path d="M443.392 178.176m-178.176 0a178.176 178.176 0 1 0 356.352 0 178.176 178.176 0 1 0-356.352 0Z" fill="#ff4949" p-id="13384"></path><path d="M580.608 845.824m-178.176 0a178.176 178.176 0 1 0 356.352 0 178.176 178.176 0 1 0-356.352 0Z" fill="#ff4949" p-id="13385"></path><path d="M845.141333 440.661333m-178.176 0a178.176 178.176 0 1 0 356.352 0 178.176 178.176 0 1 0-356.352 0Z" fill="#ff4949" p-id="13386"></path><path d="M178.858667 583.338667m-178.176 0a178.176 178.176 0 1 0 356.352 0 178.176 178.176 0 1 0-356.352 0Z" fill="#ff4949" p-id="13387"></path></svg>
                  <div class="txt">正在支付中...</div>
                </div>
                <div class="amount-info">
                  <span>￥<span class="amount">{{ payResult.payAmount.toFixed(2) }}</span></span>
                </div>
              </div>
            </el-col>
          </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" class="do-button" @click="printOrder(payResult.orderId)">打印小票</el-button>
            <el-button type="primary" class="main-button" @click="submit()">确 认</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
      showDialog: {
        type:[Boolean],
        default:()=>false
      },
      payResult: {
        type:[Object],
        default:()=>{}
      }
    },
    data(){
      return {
        loading: false,
      }
    },
    methods: {
       submit() {
         this.$emit('closeDialog','payResultDialog');
       },
       printOrder(orderId) {
         this.$emit('closeDialog','payResultDialog');
         this.$emit('showOrderPrint', orderId);
       }
    }
}
</script>
<style lang="scss" scoped>
    .main {
       height: 140px;
       padding-top: 10px;
       text-align: center;
       font-size: 14px;
       .txt {
         margin-top: 8px;
         font-size: 24px;
         font-weight: bold;
       }
       .amount-info {
          margin-top: 6px;
          font-size: 28px;
       }
    }
</style>
