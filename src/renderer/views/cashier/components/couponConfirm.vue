<template>
  <div class="coupon-container">
    <div class="main-panel">
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item class="form-item" label="核销码" prop="code">
                <el-input class="input-item" v-model="form.code" clearable placeholder="请使用扫码枪扫描卡券二维码，或手工输入核销码" maxlength="100" />
            </el-form-item>
            <el-form-item class="none" label="卡券ID" prop="id">
              <el-input class="input-item" v-model="form.id" clearable placeholder="请输入卡券ID"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="action">
        <el-button type="primary" class="confirm-button" @click="submitConfirm">确定核销</el-button>
      </div>
    </div>

    <!--核销对话框 start-->
    <el-dialog title="核销卡券" :visible.sync="open" class="common-dialog" width="700px" append-to-body>
      <el-form ref="confirmForm" :model="confirmForm" :rules="confirmRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="卡券类型：">
              <span class="coupon-type">{{ getName(typeList, couponInfo.type) }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="卡券名称：">
              <el-input style="width: 420px;" v-model="couponInfo.name" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="userInfo">
          <el-col :span="24">
            <el-form-item label="会员名称：">
              <el-input style="width: 420px;" v-model="userInfo.name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="有效期：">
              <el-input style="width: 420px;" v-model="couponInfo.effectiveDate" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="couponInfo.amount">
          <el-col :span="24">
            <el-form-item label="卡券面额：">
              <el-input style="width: 200px;" v-model="couponInfo.amount.toFixed(2)" disabled></el-input>
              <span class="unit">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="couponInfo.type=='P'">
          <el-col :span="24">
            <el-form-item label="卡券余额：" prop="balance">
              <el-input v-model="couponInfo.balance.toFixed(2)" style="width: 200px;" disabled></el-input>
              <span class="unit">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="couponInfo.type=='P'">
          <el-col :span="24">
            <el-form-item label="核销金额：" prop="amount">
              <el-input v-model="confirmForm.amount" style="width: 200px;" placeholder="请输入核销金额"></el-input>
              <span class="unit">元</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="couponInfo.type=='T'">
          <el-col :span="24">
            <el-form-item label="核销次数：" prop="useRule">
              <span class="info">总共<b style="color:green;">{{ couponInfo.useRule }}</b>次，已核销<b style="color:red;"> {{ couponInfo.confirmCount }}</b>次</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="核销备注：">
              <el-input v-model="confirmForm.remark" type="textarea" rows="2" placeholder="请输入核销备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="卡券说明：">
              <el-input v-model="couponInfo.description" type="textarea" rows="3" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmitConfirm">确定核销</el-button>
        <el-button @click="cancelConfirm">取 消</el-button>
      </div>
    </el-dialog>
    <!--核销对话框 end-->
  </div>
</template>

<script>
import { getConfirmInfo, doConfirm } from "@/api/coupon";
import {Message} from "element-ui";
export default {
  name: "ConfirmIndex",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 核销弹框
      open: false,
      form: { id: '', code: '' },
      confirmForm: { userCouponId: '', amount: '', remark: '' },
      couponInfo: {},
      userInfo: {},
      typeList: [],
      // 表单校验
      rules: {
        code: [
          { required: true, message: "核销码不能为空", trigger: "blur" },
          { min: 2, max: 100, message: '核销码长度必须介于2和100之间', trigger: 'blur' }
        ]
      },
      confirmRules: {
        amount: [
          { required: true, message: "核销金额不能为空", trigger: "blur" },
        ]
      }
    };
  },
  created() {
    this.form.code = this.$route.query.code
  },
  activated () {
    this.form.code = this.$route.query.code
  },
  methods: {
    // 取消按钮
    cancel() {
      return false;
    },
    // 确定核销
    submitConfirm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            getConfirmInfo(this.form).then(response => {
               this.couponInfo = response.data.couponInfo;
               this.confirmForm.userCouponId = this.couponInfo.id
               this.userInfo = response.data.userInfo ? response.data.userInfo : null;
               this.typeList = response.data.typeList;
               this.open = true
            }).catch(() => {
               // empty
            });
        }
      });
    },
    // 执行核销
    doSubmitConfirm: function() {
      this.$refs["confirmForm"].validate(valid => {
        if (valid) {
            doConfirm(this.confirmForm).then(response => {
              if (response.data) {
                this.open = false
                Message({
                  message: "卡券核销成功",
                  type: "success"
                });
                this.confirmForm.remark = ''
              }
            }).catch(() => {
               // empty
            });
        }
      });
    },
    cancelConfirm: function() {
       this.open = false
    }
  }
};
</script>
<style scoped>
.coupon-container {
  position: absolute;
  top: 30px;
  left: 165px;
  right: 10px;
}
.main-panel {
  margin-top: 20px;
  display: flex;
  border: solid 1px #cccccc;
  padding: 60px 0px 40px 0px;
  border-radius: 2px;
  width: 100%;
  background: #f5f5f5;
}

.main-panel .action {
  margin-left: 10px;
  min-width: 200px;
}

.main-panel .el-input {
  min-width: 580px;
}

.input-item >>> .el-input__inner {
  border: #00acac solid 2px;
  line-height: 50px;
  height: 50px;
}

.form-item >>> .el-form-item__label {
  line-height: 50px;
  height: 50px;
}

.coupon-type {
  font-weight: bold;
  color: #ff5b57;
}

.unit {
  margin-left: 5px;
}
.confirm-button {
  background: #00acac;
  line-height: 50px;
  padding: 0px 25px 0px 25px;
  height: 50px;
}
.none {
  display: none;
}
</style>
