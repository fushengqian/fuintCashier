<template>
    <el-dialog class="common-dialog" title="支付结算" :visible="showDialog" width="1100px" @close="cancel" destroy-on-close>
        <el-dialog class="common-dialog" width="800px" title="选择卡券" :visible.sync="showCouponDialog" append-to-body destroy-on-close>
          <div class="coupon-list">
            <div class="none" v-if="!memberInfo || !myCouponList || myCouponList.length < 1">暂无可用卡券</div>
            <div class="row" v-for="couponList in myCouponList">
                <div class="item active" v-for="coupon in couponList">
                  <div @click="useThisCoupon(coupon)">
                    <div class="left">
                       <div class="amount">￥{{ coupon.amount }}</div>
                       <div class="tips">{{ coupon.description }}</div>
                    </div>
                    <div class="right">
                        <div class="name">{{ coupon.name }}</div>
                        <div class="time">{{ coupon.effectiveDate }}</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </el-dialog>
        <el-form ref="form" label-width="0px">
          <div class="settlement">
            <div class="left">
                <div class="title">请选择支付方式</div>
                <div class="content">
                   <div :class="'pay-item' + (payType == 'CASH' ? ' active' : '')" @click="selectPayType('CASH')">
                      <svg t="1656296356619" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10192" width="32" height="32"><path d="M2.323 512C2.323 230.513 230.513 2.323 512 2.323S1021.677 230.513 1021.677 512 793.487 1021.677 512 1021.677 2.323 793.487 2.323 512L2.323 512zM664.053 441.296c-102.278-0.011-185.336 83.036-185.402 185.369-0.055 102.377 83.201 185.567 185.677 185.523 101.981-0.044 185.072-83.135 185.226-185.237C849.697 524.552 766.518 441.306 664.053 441.296zM689.881 615.395c9.786 0 19.572 0.11 29.357-0.055 3.112-0.055 4.002 0.99 3.892 3.991-0.209 5.619-0.055 11.237-0.055 17.296l-49.237 0 0 27.488 48.918 0 0 21.155L673.74 685.27c-0.088 1.792-0.209 3.211-0.209 4.629-0.011 10.896-0.099 21.804 0.044 32.7 0.044 3.068-0.913 4.035-3.958 3.936-6.234-0.209-12.48-0.209-18.714 0-3.013 0.099-4.002-0.792-3.947-3.892 0.176-10.896 0.066-21.804 0.066-32.7l0-4.431-51.315 0 0-21.188 51.084 0L646.791 636.78l-51.37 0c0-6.784-0.11-13.117 0.154-19.44 0.033-0.693 2.232-1.836 3.442-1.847 11.743-0.143 23.486-0.088 35.229-0.088 1.33 0 2.65 0 4.772 0-17.933-30.831-35.526-61.09-53.492-91.975 1.924-0.121 3.178-0.275 4.442-0.275 6.85-0.022 13.7 0.176 20.55-0.088 3.365-0.132 5.212 0.957 6.784 3.991 14.228 27.323 28.61 54.559 42.958 81.827 0.11 0.209 0.286 0.385 0.253 0.341 14.822-27.554 29.665-55.053 44.377-82.651 1.418-2.661 3.035-3.573 5.959-3.486 6.597 0.209 13.205 0.055 19.813 0.077 1.177 0 2.353 0.11 4.211 0.209-18.098 30.809-35.889 61.101-54.053 92.03C684.35 615.395 687.121 615.395 689.881 615.395zM300.198 231.253c4.937 3.573 9.984 7.642 15.118 12.205 5.146 4.563 9.775 9.819 13.887 15.778 2.056 3.178 4.53 6.751 7.411 10.72 2.881 3.969 5.553 7.939 8.027 11.908 2.881 4.365 5.762 8.928 8.642 13.689L481.07 295.553c2.881-3.969 5.553-8.136 8.027-12.502 2.056-3.573 4.321-7.147 6.795-10.72 2.463-3.573 4.728-6.751 6.795-9.522 4.112-5.553 8.235-10.819 12.348-15.778 4.112-4.959 10.083-9.819 17.9-14.58 3.299-1.99 6.069-4.563 8.334-7.741 2.265-3.178 3.705-6.344 4.321-9.522 0.616-3.178 0.209-6.256-1.231-9.225-1.44-2.98-4.211-5.256-8.334-6.839-3.705-1.188-6.894-1.583-9.566-1.188-2.672 0.396-5.355 1.089-8.027 2.089-2.672 0.99-5.454 2.089-8.334 3.277-2.881 1.188-6.377 1.781-10.5 1.781-4.112 0-7.51-0.693-10.182-2.089-2.672-1.385-5.146-3.079-7.411-5.058-2.265-1.979-4.629-4.068-7.103-6.256-2.463-2.188-5.762-3.87-9.874-5.058-8.224-3.178-14.811-3.771-19.747-1.781-4.937 1.99-9.874 5.157-14.822 9.522-4.112 3.969-7.411 6.751-9.874 8.334-1.231 0.792-2.265 1.187-3.09 1.187-2.474-1.187-4.728-2.573-6.795-4.167-2.056-1.198-4.013-2.485-5.861-3.87-1.847-1.385-3.595-3.068-5.245-5.058-3.288-3.178-8.224-5.256-14.811-6.256-6.586-0.99-12.546 0.099-17.9 3.277-6.993 4.365-11.93 8.038-14.811 11.017-2.881 2.98-7.202 5.058-12.963 6.245-3.288 0.792-6.894 0.594-10.797-0.594-3.903-1.187-7.917-2.375-12.04-3.573-4.112-1.188-8.027-1.979-11.732-2.386-3.727-0.418-7.015 0.385-9.896 2.364-5.762 4.365-7.609 9.621-5.553 15.778C291.148 222.809 294.854 227.679 300.198 231.253zM591.682 424.451c-0.352-0.385-0.682-0.814-1.034-1.198-10.489-11.314-20.682-21.133-30.556-29.467-11.93-9.522-22.43-18.56-31.479-27.092-9.06-8.532-16.669-16.174-22.837-22.925-7.411-7.543-13.579-14.481-18.516-20.836l-138.914 0c-5.355 6.751-11.523 13.887-18.516 21.43-5.762 6.751-12.963 14.195-21.606 22.331-8.642 8.136-18.318 16.768-29.017 25.894-12.348 10.325-23.761 22.024-34.261 35.13-10.5 13.106-19.242 27.488-26.235 43.167s-11.831 32.447-14.503 50.314c-2.672 17.856-2.166 36.515 1.539 55.966 3.299 17.461 10.083 35.031 20.374 52.689s24.179 33.635 41.672 47.928c17.493 14.283 38.791 25.905 63.893 34.833 25.102 8.928 53.91 13.392 86.423 13.392 19.033 0 36.691-1.572 53.272-4.365-14.184-28.687-22.353-60.848-22.342-94.977C449.106 533.414 508.679 454.215 591.682 424.451z" p-id="10193" fill="#ff5b57"></path></svg>
                      <div class="name">现金支付</div>
                   </div>
                   <div :class="'pay-item' + (payType == 'BALANCE' ? ' active' : '')" @click="selectPayType('BALANCE')">
                      <svg t="1656295559018" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6471" width="32" height="32"><path d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m286.4896 668.16a78.2336 78.2336 0 0 1-78.208 78.208H303.1808A78.2336 78.2336 0 0 1 224.9728 668.16V355.3536a78.1312 78.1312 0 0 1 78.1568-78.2336h417.1008a78.2336 78.2336 0 0 1 78.208 78.2336v91.1616h-208.5632a65.2032 65.2032 0 1 0 0 130.4064h208.6144z m-143.36-156.3904a39.1168 39.1168 0 1 1-39.1168-39.0912 39.1168 39.1168 0 0 1 39.0656 39.1936z" fill="#00acac" p-id="6472"></path></svg>
                      <div class="name">余额支付</div>
                   </div>
                  <div :class="'pay-item' + (payType == 'MICROPAY' ? ' active' : '')" @click="selectPayType('MICROPAY')">
                    <svg t="1649925318920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2605" width="32" height="32"><path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#28C445" p-id="2606"></path><path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#28C445" p-id="2607"></path></svg>
                    <div class="name">微信支付</div>
                  </div>
                  <div :class="'pay-item' + (payType == 'ALISCAN' ? ' active' : '')" @click="selectPayType('ALISCAN')">
                    <svg t="1681287790288" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2581" width="32" height="32"><path d="M230.404 576.536c-12.087 9.728-25.043 23.93-28.805 41.984-5.12 24.666-1.069 55.541 22.728 79.761 28.828 29.362 72.637 37.398 91.56 38.779 51.4 3.717 106.184-21.772 147.477-50.844 16.184-11.42 43.899-34.349 70.39-69.721-59.37-30.653-133.477-64.557-212.703-61.24-40.47 1.692-69.454 10.084-90.647 21.281z m752.859 135.545C1009.463 650.574 1024 582.968 1024 512 1024 229.688 794.335 0 512 0 229.665 0 0 229.688 0 512c0 282.335 229.665 512 512 512 170.385 0 321.491-83.723 414.631-212.124-87.997-43.742-233.027-115.734-322.36-159.299-42.63 48.596-105.65 97.303-176.84 118.495-44.722 13.29-85.037 18.365-127.199 9.75-41.739-8.548-72.481-28.093-90.401-47.683-9.127-9.995-19.612-22.706-27.203-37.82a71.25 71.25 0 0 0 1.202 3.049s-4.363-7.524-7.702-19.5a85.994 85.994 0 0 1-3.34-18.143 93.517 93.517 0 0 1-0.2-13.045c-0.378-7.702-0.066-15.783 1.67-24.064 4.185-20.235 12.822-43.81 35.172-65.692 49.063-48.039 114.777-50.621 148.814-50.42 50.421 0.289 138.04 22.35 211.812 48.439 20.436-43.52 33.547-90.068 42.007-121.1H305.308v-33.168h157.518v-66.337H272.139v-33.169h190.687v-66.315c0-9.105 1.803-16.584 16.584-16.584h74.619v82.899h207.293v33.169H554.029v66.337h165.82s-16.65 92.828-68.719 184.32c115.557 41.272 278.128 104.849 332.133 126.086z" fill="#1296DB" p-id="2582"></path></svg>
                    <div class="name">支付宝支付</div>
                  </div>
                </div>
            </div>
            <div class="main">
                <div class="title">结算信息</div>
                <div class="content">
                    <div class="coupon-info">
                      <div>可用卡券：<span class="num">({{ memberInfo ? couponList.length : 0 }})</span></div>
                      <el-form-item class="form-item" prop="couponName">
                        <el-input class="input-item" style="width: 450px" @focus="selectCoupon()" v-model="couponName" placeholder="请选择卡券" clearable/>
                      </el-form-item>
                    </div>
                    <div class="remark-info">
                      <div>备注信息：</div>
                      <el-form-item class="form-item" prop="remark">
                        <el-input type="textarea" v-model="remark" ref="remark" placeholder="请输入备注信息" clearable/>
                      </el-form-item>
                    </div>
                    <div class="discount-info">
                      <el-row>
                        <el-col :span="12">
                          <div>折扣:（折）</div>
                          <el-form-item class="form-item" prop="discount">
                            <el-input type="text" v-model="discountAmount" style="width: 200px" placeholder="请输入折扣" clearable/>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <div>立减:（元）</div>
                          <el-form-item class="form-item" prop="reduce">
                            <el-input type="text" v-model="reduceAmount" style="width: 200px" placeholder="请输入立减金额" clearable/>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="amount-info">
                       <span class="discount-amount">优惠金额：￥<span class="value">{{ discountPrice.toFixed(2) }}</span></span>
                       <span class="pay-amount">应付金额：￥<span class="value">{{ newTotalPrice.toFixed(2) }}</span></span>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="title">会员信息</div>
                <div class="content">
                  <div class="member-info" v-if="memberInfo">
                      <div class="base">
                         <img class="avatar" v-if="memberInfo.avatar" :src="memberInfo.avatar"/>
                         <img class="avatar" v-if="!memberInfo.avatar" src="@/assets/images/avatar.png"/>
                         <span class="name">{{ memberInfo.name }}</span>
                        <div class="gender">
                          <b v-if="memberInfo.sex" class="el-icon-male"></b>
                          <b v-if="!memberInfo.sex" class="el-icon-female"></b>
                        </div>
                      </div>
                      <div class="item"><div class="head">手机号：</div><div class="value">{{ memberInfo.mobile ? memberInfo.mobile : '暂无' }}</div></div>
                      <div class="item"><div class="head">会员号：</div><div class="value">{{ memberInfo.userNo ? memberInfo.userNo : '暂无' }}</div></div>
                      <div class="item"><div class="head">可用余额：</div><div class="value">{{ memberInfo.balance ? memberInfo.balance.toFixed(2) : 0.00 }}（元）</div></div>
                      <div class="item"><div class="head">可用积分：</div><div class="value">{{ memberInfo.point ? memberInfo.point : '0' }}</div></div>
                      <div class="re-select"><el-button calss="do-action" size="mini" type="danger" icon="el-icon-user" @click="bindToMember()">重新选择</el-button></div>
                  </div>
                  <div class="guest" v-if="!memberInfo">
                       <el-empty description="当前为游客" :image-size="30"></el-empty>
                       <el-button calss="do-action" size="mini" type="danger" icon="el-icon-user" @click="bindToMember()">关联会员</el-button>
                  </div>
                  <div class="staff">
                    <el-button v-if="staffInfo" calss="do-action" size="mini" type="primary" icon="el-icon-user" @click="bindToStaff()">已关联（{{ staffInfo.realName }}）</el-button>
                    <el-button v-if="!staffInfo" calss="do-action" size="mini" type="primary" icon="el-icon-user" @click="bindToStaff()">关联员工</el-button>
                  </div>
                </div>
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" class="main-button" @click="submit()">确定收款</el-button>
            <el-button @click="cancel()">取 消</el-button>
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
      memberInfo: {
        type:[Object],
        default:()=>{}
      },
      staffInfo: {
        type:[Object],
        default:()=>{}
      },
      orderInfo: {
        type:[Object],
        default:()=>{}
      },
      couponList: {
        type:[Array],
        default:()=> []
      },
      totalPrice: {
        type:[Number],
        default:()=>'0'
      },
      remarks: {
        type:[String],
        default:()=>''
      }
    },
    watch: {
      showDialog(value) {
         const app = this;
         if (value) {
            if (app.orderInfo.id) {
                app.totalPrice = app.orderInfo.payAmount;
            }
            app.discountAmount = '';
            app.reduceAmount = '';
            app.myCouponList = [];
            app.couponName = '';
            app.userCouponId = 0;
            app.remark = app.remarks;
            app.computerPrice(app.discountAmount, app.reduceAmount);
            if (app.memberInfo) {
                for (let i = 0, len = app.couponList.length; i < len; i += 2) {
                     app.myCouponList.push(app.couponList.slice(i, i + 2));
                }
            }
         }
      },
      discountAmount(value) {
        const reg = /^[0-9](.)*$/;
        if (value < 0 || value > 10 || !reg.test(value)) {
            this.discountAmount = '';
            value = '';
        }
        this.computerPrice(value, this.reduceAmount);
      },
      reduceAmount(value) {
         const reg = /^[0-9](.)*$/;
         if (value > this.totalPrice || value < 0 || !reg.test(value)) {
             this.reduceAmount = '';
             value = '';
         }
         this.computerPrice(this.discountAmount, value);
      }
    },
    data(){
      return {
          loading: false,
          discountPrice: 0,
          payType: '',
          userCouponId: 0,
          couponName: '',
          remark: '',
          discountAmount: '',
          reduceAmount: '',
          newTotalPrice: 0,
          showCouponDialog: false,
          myCouponList: []
      }
    },
    methods: {
        // 选择支付方式
        selectPayType(type) {
          const app = this;
          if (type == 'BALANCE' && !app.memberInfo) {
              app.$alert("余额支付需关联会员信息！");
              return false;
          }
          this.payType = type;
        },
        // 选择卡券
        selectCoupon() {
          const app = this;
          if (!app.memberInfo) {
              app.$alert("请先关联会员信息！");
              app.$refs.remark.focus();
              return false;
          } else {
              app.myCouponList = [];
              app.couponName = '';
              app.userCouponId = 0;
              app.computerPrice(app.discountAmount, app.reduceAmount);
              if (app.memberInfo) {
                  for (let i = 0, len = app.couponList.length; i < len; i += 2) {
                       app.myCouponList.push(app.couponList.slice(i, i + 2));
                  }
              }
              app.showCouponDialog = true;
          }
        },
        // 使用该卡券
        useThisCoupon(coupon) {
          const app = this;
          app.$confirm('确定使用该卡券吗？').then(function() {
              app.$emit('useThisCoupon', coupon);
              app.couponName = coupon.name;
              app.userCouponId = coupon.userCouponId;
              app.showCouponDialog = false;
          }).then(() => {
              // empty
          }).catch(function() {
              // empty
          });
        },
        // 提交结算
        submit() {
          const app = this;
          if (app.payType == '') {
              app.$alert("请先选择支付方式！");
              return false;
          }
          app.$emit('submit', { payType: this.payType, totalPrice: this.newTotalPrice, remark: this.remark, discountPrice: this.discountPrice, userCouponId: app.userCouponId });
          app.payType = '';
        },
        cancel() {
           this.$emit('closeDialog','settlementDialog');
           this.payType = '';
        },
        computerPrice(discountAmount, reduceAmount) {
            if (this.orderInfo.id) {
                this.totalPrice = this.orderInfo.amount;
            }
            let discountPrice = 0.0;
            if (discountAmount.length > 0) {
                discountPrice = this.totalPrice - (this.totalPrice * (discountAmount / 10));
            }
            if (reduceAmount.length > 0) {
                discountPrice = discountPrice + parseFloat(reduceAmount);
            }
            if (isNaN(discountPrice)) {
                this.discountAmount = '';
                this.reduceAmount = '';
                discountPrice = 0;
            }
            this.discountPrice = discountPrice;
            this.newTotalPrice = this.totalPrice - this.discountPrice;
            if (this.newTotalPrice < 0) {
                this.newTotalPrice = 0;
            }
        },
        // 关联会员
        bindToMember() {
           this.$emit('switchMember');
        },
        // 关联员工
        bindToStaff() {
          this.$emit('bindStaff');
        }
    }
}
</script>
<style lang="scss" scoped>
   .coupon-list {
     text-align: center;
     .none {
        color: #666666;
     }
     .row {
        height: 80px;
        margin-bottom: 15px;
        .item {
            float: left;
            width: 45%;
            margin-left: 10px;
            height: 83px;
            border: solid 2px #00acac;
            cursor: pointer;
            border-radius: 2px;
            .left {
                width: 30%;
                height: 80px;
                float: left;
                background: #00acac;
                color: #FFFFFF;
                .amount {
                   font-size: 24px;
                   margin-top: 10px;
                   font-weight: bold;
                }
              .tips {
                 font-size: 12px;
                 margin-top: 3px;
              }
            }
            .right {
                width: 70%;
                float: left;
                margin-top: 10px;
                text-align: left;
                padding-left: 10px;
                height: 80px;
                .time {
                  margin-top: 3px;
                  font-size: 12px;
                }
            }
        }
     }
   }
   .settlement {
     border: solid 1px #ccc;
     border-radius: 2px;
     min-height: 350px;
     margin: 0 auto;
     .left {
        width: 200px;
        float: left;
        height: 350px;
        padding: 10px;
        border-right: solid 1px #ccc;
        .title {
          margin-bottom: 10px;
          font-weight: bold;
        }
        .pay-item {
           height: 65px;
           line-height: 65px;
           border-radius: 2px;
           text-align: center;
           margin-bottom: 10px;
           border: solid 2px #cccccc;
           text-align: center;
           padding-left: 35px;
           cursor: pointer;
           .icon {
             margin-top: 15px;
             float: left;
           }
           .name {
              margin-left: 2px;
              font-size: 14px;
              color: #888888;
              float: left;
           }
        }
        .active {
           border: 3px solid #00acac;
           background: #FDF5E6;
           color: #FFFFFF;
        }
     }
     .main {
        float: left;
        padding: 10px;
        width: 598px;
        height: 348px;
        position: relative;
        .title {
          margin-bottom: 10px;
          font-weight: bold;
        }
        .content {
          width: 100%;
          .coupon-info {
             margin-top: 20px;
             .num {
                color: #ff5b57;
                font-weight: bold;
             }
          }
          .discount-info {
             height: 40px;
          }
          .amount-info {
             text-align: right;
             position: absolute;
             width: 580px;
             bottom: 10px;
             font-size: 16px;
             .discount-amount {
                margin-right: 50px;
                 .value {
                   font-size: 20px;
                 }
             }
            .pay-amount {
                .value {
                  font-weight: bold;
                  color: #ff5b57;
                  font-size: 20px;
                }
            }
          }
        }
     }
     .right {
       float: right;
       padding: 10px;
       width: 200px;
       height: 350px;
       border-left: solid 1px #ccc;
       .title {
          margin-bottom: 10px;
          font-weight: bold;
       }
       .content {
          .member-info {
             .base {
               height: 50px;
               .avatar {
                 width: 50px;
                 height: 50px;
                 border-radius: 25px;
                 border: solid 2px #cccccc;
                 float: left;
               }
               .name {
                 font-weight: bold;
                 font-size: 14px;
               }
               .gender {
                 margin-left: 52px;
                 .el-icon-male {
                   font-size: 16px;
                   color: #2b2f3a;
                 }
                 .el-icon-female {
                   font-size: 16px;
                   color: deeppink;
                 }
               }
             }
             .item {
                margin-top: 5px;
                border: dashed 1px #CCCCCC;
                padding: 5px;
                .head {
                   float: left;
                }
                .value {
                   margin-top: 1px;
                   text-align: left;
                }
             }
            .re-select {
              margin: 10px auto;
              text-align: center;
            }
          }
          .guest {
             margin-top: 20px;
             text-align: center;
             .do-action {
                height: 8px;
                line-height: 8px;
             }
          }
         .staff {
           margin-top: 10px;
           text-align: center;
           .do-action {
             height: 8px;
             line-height: 8px;
           }
         }
       }
     }
   }
</style>
