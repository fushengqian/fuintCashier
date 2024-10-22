<template>
  <el-dialog title="订单详情" :visible.sync="showDialog" class="common-dialog" width="80%" @close="cancel" destroy-on-close append-to-body>
      <div class="order-detail-container">
         <div class="main-panel" v-if="orderInfo.id">
        <div class="panel">
            <div class="title">基础信息</div>
            <div class="content">
                <el-row class="row">
                    <el-col :span="8">
                        <span class="head">订单号：</span>
                        <span class="control-label">{{ orderInfo.orderSn }}</span>
                    </el-col>
                    <el-col :span="8">
                      <span class="head">总金额：</span>
                      <span class="control-label">￥{{ orderInfo.amount }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">订单状态：</span>
                        <span class="control-label normal-status">{{ orderInfo.statusText }}</span>
                    </el-col>
                </el-row>
                <el-row class="row">
                    <el-col :span="8">
                      <span class="head">订单类型：</span>
                      <span class="control-label">{{ orderInfo.typeName }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">订单时间：</span>
                        <span class="control-label">{{ orderInfo.createTime }}</span>
                    </el-col>
                    <el-col :span="8">
                        <span class="head">备注信息：</span>
                        <span class="control-text">{{ orderInfo.remark ? orderInfo.remark : '暂无'}}</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="panel">
          <div class="title">支付信息</div>
          <div class="content">
            <el-row class="row">
              <el-col :span="8">
                <span class="head">支付金额：</span>
                <span class="control-label">￥{{ orderInfo.payAmount.toFixed(2) }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">支付状态：</span>
                <span class="control-label payed-status" v-if="orderInfo.payStatus == 'B'">{{ getName(payStatusList, orderInfo.payStatus) }}</span>
                <span class="control-label normal-status" v-else>{{ getName(payStatusList, orderInfo.payStatus) }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">减免金额：</span>
                <span class="control-label">￥{{ orderInfo.discount.toFixed(2) }}</span>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8">
                <span class="head">支付方式：</span>
                <span class="control-label">{{ getName(payTypeList, orderInfo.payType) }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">支付时间：</span>
                <span class="control-label">{{ orderInfo.payTime ? orderInfo.payTime : '--' }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">使用卡券：</span>
                <span class="control-label">{{ orderInfo.couponInfo ? '￥' + orderInfo.couponInfo.amount + '（' + orderInfo.couponInfo.name + '）' : '--' }}</span>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="8">
                <span class="head">使用积分：</span>
                <span class="control-label">{{ orderInfo.usePoint ? orderInfo.usePoint : 0 }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">积分金额：</span>
                <span class="control-label">￥{{ orderInfo.pointAmount.toFixed(2) }}</span>
              </el-col>
              <el-col :span="8">
                <span class="head">配送费用：</span>
                <span class="control-label">￥{{ orderInfo.deliveryFee.toFixed(2) }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="panel">
          <div class="title">会员信息</div>
          <div class="content">
            <el-row class="row">
              <el-col :span="8">
                <span class="head">会员ID：</span>
                <span class="control-label" v-if="orderInfo.userInfo && orderInfo.isVisitor == 'N'">{{ orderInfo.userInfo.id }}</span>
                <span class="control-label" v-else>游客</span>
              </el-col>
              <el-col :span="8">
                <span class="head">会员名称：</span>
                <span class="control-label" v-if="orderInfo.userInfo && orderInfo.isVisitor == 'N'">{{ orderInfo.userInfo.name }}</span>
                <span class="control-label" v-else>游客<span v-if="orderInfo.userInfo">（管理员{{ orderInfo.userInfo.name }}代下单）</span></span>
              </el-col>
              <el-col :span="8">
                <span class="head">手机号：</span>
                <span class="control-label">{{ orderInfo.userInfo.mobile ? orderInfo.userInfo.mobile : '无' }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="panel">
            <div class="title">商品信息</div>
            <div class="content">
              <el-table ref="tables" v-loading="loading" :data="orderInfo.goods">
                  <el-table-column label="商品ID" prop="id" width="66"/>
                  <el-table-column label="图片" align="center" prop="name">
                    <template slot-scope="scope">
                      <img class="goods-logo" :src="scope.row.image"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称" align="left" prop="name">
                     <template slot-scope="scope">
                        <span class="goods-name">{{ scope.row.name }}</span>
                     </template>
                  </el-table-column>
                  <el-table-column label="规格" align="center">
                    <template slot-scope="scope">
                       <span v-if="scope.row.specList">
                          <span class="spec-item" v-for="spec in scope.row.specList">{{ spec.specValue }}</span>
                       </span>
                       <span v-else>--</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" align="center" prop="price" />
                  <el-table-column label="优惠金额" align="center" prop="discount" />
                  <el-table-column label="数量" align="center" prop="num" />
              </el-table>
            </div>
        </div>

        <div class="panel" v-if="orderInfo.type=='goods'">
          <div class="title">配送信息</div>
          <div class="content">
            <el-row class="row">
              <el-col :span="8">
                <span class="head">配送方式：</span>
                <span class="control-label" v-if="orderInfo.orderMode == 'oneself'">门店自提</span>
                <span class="control-label" v-else>物流配送</span>
              </el-col>
              <el-col :span="16" v-if="orderInfo.orderMode == 'oneself'">
                <span class="head">自提地址：</span>
                <span class="control-label">{{orderInfo.storeInfo.name}} {{orderInfo.storeInfo.phone}} {{orderInfo.storeInfo.address}}</span>
              </el-col>
              <el-col :span="8" v-if="orderInfo.orderMode == 'express' && orderInfo.address">
                <span class="head">收货人：</span>
                <span class="control-label">{{ orderInfo.address.name ? orderInfo.address.name : '--' }}</span>
              </el-col>
              <el-col :span="8" v-if="orderInfo.orderMode == 'express' && orderInfo.address">
                <span class="head">联系电话：</span>
                <span class="control-label">{{ orderInfo.address.mobile ? orderInfo.address.mobile : '无' }}</span>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col :span="24" v-if="orderInfo.orderMode == 'express' && orderInfo.address">
                <span class="head">详细地址：</span>
                <span class="control-label">{{orderInfo.address.provinceName}}{{orderInfo.address.cityName}}{{orderInfo.address.regionName}}{{orderInfo.address.detail}}</span>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="panel" v-if="orderInfo.expressInfo">
          <div class="title">物流信息</div>
          <div class="content">
            <el-row class="row">
              <el-col :span="8">
                <span class="head">物流公司：</span>
                <span class="control-label" v-if="orderInfo.expressInfo.expressCompany">{{ orderInfo.expressInfo.expressCompany }}</span>
                <span class="control-label" v-else>--</span>
              </el-col>
              <el-col :span="8">
                <span class="head">物流单号：</span>
                <span class="control-label" v-if="orderInfo.expressInfo.expressNo">{{ orderInfo.expressInfo.expressNo }}</span>
                <span class="control-label" v-else>--</span>
              </el-col>
              <el-col :span="8">
                <span class="head">发货时间：</span>
                <span class="control-label">{{orderInfo.expressInfo.expressTime}}</span>
              </el-col>
            </el-row>
          </div>
        </div>

    </div>
      </div>
  </el-dialog>
</template>

<script>
import { getOrderInfo } from "@/api/order";
export default {
  name: "orderDetail",
  props: {
    showDialog:{
      type:[Boolean],
      default:()=>false
    },
    orderId:{
      type:[String],
      default:()=> ''
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      payTypeList: [],
      payStatusList: [],
      orderInfo: { payAmount: 0, discount: 0, pointAmount: 0, userInfo: {} }
    };
  },
  watch: {
    showDialog(value) {
      if (value) {
          this.getOrderInfo(this.orderId);
      }
    }
  },
  methods: {
    // 查询配置
    getOrderInfo(orderId) {
      this.loading = true;
      getOrderInfo(orderId).then(response => {
          this.loading = false;
          this.orderInfo = response.data.orderInfo;
          this.payTypeList = response.data.payTypeList;
          this.payStatusList = response.data.payStatusList;
        }
      ).catch(() => {
         // empty
      });
    },
    // 取消按钮
    cancel() {
      this.$emit('closeDialog');
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
    .main-panel {
         margin: 0px;
         padding: 5px;
        .panel {
            border: solid 1px #cccccc;
            min-height: 100px;
            border-radius: 2px;
            margin-top: 10px;
            .title {
               font-weight: bold;
               margin-top: 10px;
               margin-left: 5px;
               padding-left: 5px;
               color: #333333;
               border-left: 5px solid rgb(254,106,0);
            }
           .content {
              padding: 20px;
              .goods-logo {
                 width: 45px;
                 height: 45px;
                 border: solid 1px #cccccc;
              }
             .spec-item {
                 color: #666666;
                 background: #ffffff;
                 border: #666666 solid 1px;
                 border-radius: 20px;
                 padding: 2px 8px 2px 8px;
                 margin-right: 5px;
             }
              .row {
                min-height: 40px;
                verticle-align: middle;
                display: flex;
                line-height: 40px;
                .payed-status {
                    color: #52c41a;
                    background: #f6ffed;
                    border: #b7eb8f solid 1px;
                    border-radius: 20px;
                    padding: 5px 8px 2px 8px;
                    font-size: 90%;
                }
                .normal-status {
                    color: #666666;
                    background: #ffffff;
                    border: #666666 solid 1px;
                    border-radius: 20px;
                    padding: 5px 8px 2px 8px;
                    font-size: 90%;
                }
              }
              .head {
                 color: rgb(164,164,164);
                 min-width: 120px;
                 text-align: right;
                 display: block;
                 float: left;
              }
             .control-text {
               display: block;
               background: #f5f5f5;
               border-radius: 10px;
               margin-left: 120px;
               margin-top: 5px;
               line-height: 22px;
               padding: 5px 10px 5px 10px;
             }
           }
        }
    }
</style>
