<template>
    <div :id="paperId" class="print-area">
        <div class="base-info">
            <div class="name" v-if="storeInfo">{{ storeInfo.name }}</div>
            <div class="no">NO：{{ orderInfo.orderSn }}</div>
        </div>
        <div>****************************************</div>
        <div class="goods-list" v-if="orderInfo.goods && orderInfo.goods.length > 0">
          <div class="goods-item" v-for="(goodsInfo, index) in orderInfo.goods">
            <span class="item">{{ index+1 }}）{{ goodsInfo.name }}</span>
            <span class="item">x{{ goodsInfo.num }}</span>
            <span class="item">￥{{ goodsInfo.price }}</span>
            <div class="spec" v-if="goodsInfo.specList">
              <span class="spec" v-for="spec in goodsInfo.specList">{{ spec.specValue }}；</span>
            </div>
          </div>
        </div>
        <div v-if="orderInfo.goods && orderInfo.goods.length > 0">****************************************</div>
        <div class="member-info">
          <div class="item" v-if="orderInfo.isVisitor == 'N'"><span class="t">会员名称：</span>{{ orderInfo.userInfo ? orderInfo.userInfo.name : '-' }}</div>
          <div class="item" v-if="orderInfo.isVisitor == 'N'"><span class="t">会员号码：</span>{{ orderInfo.userInfo && orderInfo.userInfo.userNo ? orderInfo.userInfo.userNo : '-' }}</div>
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
          <div class="item" v-if="machineName">收银机：{{ machineName }}</div>
          <div class="item">备注信息：<span class="remark">{{ orderInfo.remark ? orderInfo.remark : '无' }}</span></div>
          <div class="item">优惠金额：<span class="discount">￥{{ orderInfo.discount ? orderInfo.discount.toFixed(2) : '0.00' }}</span></div>
          <div class="item">应收金额：<span class="amount">￥{{ orderInfo.payAmount ? orderInfo.payAmount.toFixed(2) : '0.00' }}</span></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
      paperId: {
        type: [String],
        default: () => 'printArea'
      },
      orderInfo: {
        type: [Object],
        default: () => {}
      },
      storeInfo: {
        type: [Object],
        default: () => {}
      },
      machineName: {
        type: [String],
        default: () => ''
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
          text-align: center;
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
            .item {
               margin-right: 10px;
            }
            .spec {
               margin-right: 10px;
               margin-left: 5px;
               font-size: 12px;
            }
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
            .discount {
               font-weight: bold;
            }
           .amount {
             font-weight: bold;
             font-size: 28px;
           }
         }
      }
   }
</style>
