<template>
    <el-dialog class="common-dialog" title="订单打印预览" :visible="showDialog" width="380px" @close="cancel" append-to-body destroy-on-close>
        <div v-if="orderInfo.id" class="print-area" id="printArea">
            <div class="base-info">
                <div class="name" v-if="storeInfo">{{ storeInfo.name }}</div>
                <div class="no">NO：{{ orderInfo.orderSn }}</div>
            </div>
            <div>****************************************</div>
            <div class="goods-list" v-if="orderInfo.goods.length > 0">
              <div class="goods-item" v-for="(goodsInfo, index) in orderInfo.goods">
                <span class="item">{{ index+1 }}.{{ goodsInfo.name }}</span>
                <span class="item">x{{ goodsInfo.num }}</span>
                <span class="item">￥{{ goodsInfo.price }}</span>
              </div>
            </div>
            <div v-if="orderInfo.goods.length > 0">****************************************</div>
            <div class="member-info">
              <div class="item" v-if="orderInfo.isVisitor == 'N'"><span class="t">会员名称：</span>{{ orderInfo.userInfo.name }}</div>
              <div class="item" v-if="orderInfo.isVisitor == 'N'"><span class="t">会员号码：</span>{{ orderInfo.userInfo.userNo ? orderInfo.userInfo.userNo : '-' }}</div>
              <div class="item" v-if="orderInfo.isVisitor == 'Y'"><span class="t">会员信息：</span>无</div>
            </div>
            <div v-if="orderInfo.orderMode == 'express' && orderInfo.address">****************************************</div>
            <div class="address-info" v-if="orderInfo.orderMode == 'express' && orderInfo.address">
              <div class="item">收货人名：{{ orderInfo.address.name ? orderInfo.address.name : '-' }}</div>
              <div class="item">联系电话：{{ orderInfo.address.mobile ? orderInfo.address.mobile : '无' }}</div>
              <div class="item">详细地址：{{orderInfo.address.provinceName}}{{orderInfo.address.cityName}}{{orderInfo.address.regionName}}{{orderInfo.address.detail}}</div>
            </div>
            <div>****************************************</div>
            <div class="total-info">
              <div class="item">订单类型：{{ orderInfo.typeName }}</div>
              <div class="item">订单时间：{{ orderInfo.createTime }}</div>
              <div class="item">优惠金额：<span class="discount">￥{{ orderInfo.discount.toFixed(2) }}</span></div>
              <div class="item">应收金额：<span class="amount">￥{{ orderInfo.payAmount.toFixed(2) }}</span></div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" class="main-button" @click="handlePrint(printObj)" v-print="printObj">打印</el-button>
            <el-button @click="cancel()">取消</el-button>
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
        cancel() {
           this.$emit('closeDialog', 'printOrder');
        }
    }
}
</script>
<style scoped lang="scss">
   .print-area {
      font-size: 14px;
      border: solid 1px #ccc;
      padding: 30px 10px 30px 10px;
      overflow: scroll;
      width: 100%;
      .base-info {
          margin-bottom: 10px;
         .name {
           font-weight: bold;
           margin-bottom: 5px;
         }
      }
      .goods-list {
         margin-top: 10px;
         margin-bottom: 15px;
         .goods-item {
            margin-bottom: 10px;
         }
      }
      .member-info {
         margin-top: 10px;
         margin-bottom: 20px;
         .item {
            clear: both;
         }
      }
      .address-info {
         margin-top: 10px;
         margin-bottom: 20px;
      }
      .total-info {
         .item {
            margin-bottom: 2px;
           .amount {
             font-weight: bold;
             font-size: 28px;
           }
         }
      }
   }
</style>
<style media="print" lang="scss">
@page {
  size: auto;
  margin: 0mm;
}
@media print {
  html {
    height: auto;
    width: auto;
    margin: 0px;
  }
  body {
     border: solid 1px #ffffff;
  }
  #printArea {
     font-size: 14px;
     display: block;
     min-width: 320px;
     min-height: 420px;
     margin-top: 60px;
     .base-info {
       margin-bottom: 10px;
       .name {
          font-weight: bold;
          margin-bottom: 5px;
       }
     }
     .goods-list {
        margin-bottom: 20px;
        .goods-item {
           margin-bottom: 50px;
           .item {
              margin-right: 10px;
              margin-bottom: 10px;
           }
        }
     }
     .member-info {
       margin-top: 20px;
       margin-bottom: 20px;
       margin-top: 10px;
       margin-bottom: 20px;
       .item {
          clear: both;
       }
     }
     .total-info {
         margin-top: 20px;
         margin-bottom: 60px;
         .item {
           margin-bottom: 2px;
           .amount {
             font-weight: bold;
             font-size: 28px;
           }
         }
     }
  }
}
</style>
