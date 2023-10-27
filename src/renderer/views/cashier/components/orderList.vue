<template>
  <div class="order-container">
    <el-form class="search-form" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="会员ID" prop="name">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入会员ID"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
            v-model="queryParams.mobile"
            placeholder="请输入会员手机号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderSn">
        <el-input
            v-model="queryParams.orderSn"
            placeholder="请输入订单号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单类型" prop="type">
        <el-select
            v-model="queryParams.type"
            clearable
            placeholder="订单类型"
        >
          <el-option v-for="orderType in typeList" :key="orderType.key" :label="orderType.name" :value="orderType.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属店铺" prop="storeIds">
        <el-select v-model="storeIds" multiple filterable clearable placeholder="请选择店铺" style="width: 100%;">
          <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="请选择订单状态"
            clearable
        >
          <el-option v-for="statusItem in statusList" :key="statusItem.key+''" :label="statusItem.name" :value="statusItem.key+''"/>
        </el-select>
      </el-form-item>
      <el-form-item label="支付状态" prop="payStatus">
        <el-select
            v-model="queryParams.payStatus"
            placeholder="支付状态"
            clearable
        >
          <el-option v-for="statusItem in payStatusList" :key="statusItem.key+''" :label="statusItem.name" :value="statusItem.key+''"/>
        </el-select>
      </el-form-item>
      <el-form-item label="配送方式">
        <el-select
            v-model="queryParams.orderMode"
            placeholder="配送方式"
            clearable
        >
          <el-option v-for="item in orderModeList" :key="item.key+''" :label="item.name" :value="item.key+''"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="main-button-middle" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" class="main-button-middle main-button-reset" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="tables" v-loading="loading" :data="list" border style="width: 100%;" fit height="100%" show-overflow-tooltip @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column label="ID" prop="id" width="80"/>
      <el-table-column label="订单号"  align="center" width="190" prop="orderSn">
        <template slot-scope="scope">
          <span @click="handleView(scope.row)" style="color: #00afff;cursor: pointer;">{{ scope.row.orderSn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员名称" align="center" prop="orderInfo.name">
        <template slot-scope="scope">
          <span v-if="scope.row.userInfo && scope.row.isVisitor == 'N'">
              <span>{{ scope.row.userInfo.name }}</span>
          </span>
          <span v-else>游客</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="typeName">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" align="center" width="140" prop="storeInfo.name">
        <template slot-scope="scope">
          <span v-if="scope.row.storeInfo">{{ scope.row.storeInfo.name }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" prop="amount">
        <template slot-scope="scope">
          <span v-if="true">{{ scope.row.amount.toFixed(2) }}</span>
          <span v-else>0.00</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center" width="80" prop="payStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.payStatus == 'B'" class="status-active">{{ getName(payStatusList, scope.row.payStatus) }}</span>
          <span v-else class="status-disabled">{{ getName(payStatusList, scope.row.payStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="80" prop="status">
        <template slot-scope="scope">
          <span class="status-normal">{{ getName(statusList, scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送方式" align="center" prop="orderMode">
        <template slot-scope="scope">
          <span>{{ getName(orderModeList, scope.row.orderMode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" align="center" width="130" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="payAmount">
        <template slot-scope="scope">
          <span v-if="true">{{ scope.row.payAmount.toFixed(2) }}</span>
          <span v-else>0.00</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠金额" align="center" prop="discount">
        <template slot-scope="scope">
          <span v-if="true">{{ scope.row.discount.toFixed(2) }}</span>
          <span v-else>0.00</span>
        </template>
      </el-table-column>
      <el-table-column label="积分金额" align="center" prop="pointAmount">
        <template slot-scope="scope">
          <span v-if="true">{{ scope.row.pointAmount.toFixed(2) }}</span>
          <span v-else>0.00</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="130" prop="updateTime">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="138" fixed='right'>
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              class="main-text"
              v-hasPermi="['order:edit']"
              @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
              v-if="scope.row.orderMode == 'express'"
              size="mini"
              type="text"
              class="main-text"
              v-hasPermi="['order:edit']"
              @click="handleExpress(scope.row)"
          >发货</el-button>
          <el-button
              v-if="scope.row.orderMode == 'oneself'"
              type="text"
              size="mini"
              class="main-text"
              :disabled="scope.row.isVerify == true"
              @click="handleVerify(scope.row)"
              v-hasPermi="['order:edit']"
          >核销</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['order:edit', 'order:delete']">
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleView" icon="el-icon-view" v-hasPermi="['order:index']">查看详情</el-dropdown-item>
              <el-dropdown-item command="handlePrint" icon="el-icon-printer" v-hasPermi="['order:index']">打印小票</el-dropdown-item>
              <el-dropdown-item command="handlePay" v-if="scope.row.payStatus != 'B'" icon="el-icon-wallet" v-hasPermi="['order:index']">发起支付</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.payStatus == 'B'" command="handleRefund" icon="el-icon-s-order" v-hasPermi="['order:index']">立即退款</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.payStatus != 'B'" command="handleDelete" icon="el-icon-remove" v-hasPermi="['order:delete']">删除订单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        class="pagination"
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 修改对话框 start-->
    <el-dialog :title="title" :visible.sync="open" class="common-dialog" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderSn">
              <el-input v-model="form.orderSn" placeholder="订单号" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.orderMode && form.orderMode.length > 0">
          <el-col :span="24">
            <el-form-item label="订单模式" prop="orderMode">
              <el-select v-model="form.orderMode" placeholder="订单模式">
                <el-option v-for="item in orderModeList" :key="item.key+''" :label="item.name" :value="item.key+''"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单总金额" prop="amount">
              <el-input v-model="form.amount" placeholder="请输入订单总金额" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="优惠金额" prop="discount">
              <el-input v-model="form.discount" placeholder="请输入优惠金额" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入订单备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单状态">
              <el-select v-model="form.status" placeholder="订单状态">
                <el-option v-for="statusItem in statusList" :key="statusItem.key+''" :label="statusItem.name" :value="statusItem.key+''"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="main-button" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 end-->

    <!-- 核销对话框 start-->
    <el-dialog title="核销订单" :visible.sync="openVerify" class="common-dialog" width="700px" append-to-body>
      <el-form ref="vForm" :model="vForm" :rules="vFormRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderSn">
              <el-input v-model="vForm.orderSn" placeholder="订单号" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="核销码" prop="verifyCode">
              <el-input v-model="vForm.verifyCode" placeholder="请输入订单核销码" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单备注" prop="remark">
              <el-input v-model="vForm.remark" type="textarea" placeholder="请输入订单备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="main-button" @click="submitVForm">确定核销</el-button>
        <el-button @click="cancelVForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 核销对话框 end-->

    <!-- 发货对话框 start-->
    <el-dialog title="填写物流信息" :visible.sync="openExpress" class="common-dialog" width="700px" append-to-body>
      <el-form ref="eForm" :model="eForm" :rules="eFormRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderSn">
              <el-input v-model="eForm.orderSn" placeholder="订单号" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="物流公司" prop="expressCompany">
              <el-input v-model="eForm.expressCompany" placeholder="请输入物流公司" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="物流单号" prop="expressNo">
              <el-input v-model="eForm.expressNo" placeholder="请输入物流单号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEForm">提交物流信息</el-button>
        <el-button @click="cancelEForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 核销对话框 end-->

    <!--打印订单对话框 start-->
    <orderPrintDialog :show-dialog="openOrderPrintDialog" :storeInfo="storeInfo" :orderInfo="orderInfo" @closeDialog="closePrintDialog"/>
    <!--打印订单对话框 end-->

    <!-- 退款对话框 start -->
    <el-dialog title="订单退款" :visible.sync="openRefundDialog" class="common-dialog" width="700px" append-to-body>
      <el-form ref="rForm" :model="rForm" :rules="rFormRules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="订单号" prop="orderSn" style="width:450px;">
              <el-input v-model="rForm.orderSn" placeholder="订单号" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="支付方式" prop="payType" style="width:450px;">
              <el-input v-model="rForm.payType" placeholder="支付方式" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="实付金额" prop="payAmount" style="width:450px;">
              <el-input v-model="'￥' + rForm.payAmount" placeholder="订单实付金额" disabled maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退款金额" prop="refundAmount" style="width:450px;">
              <el-input v-model="rForm.refundAmount" placeholder="请输入退款金额"></el-input>
              <div class="form-tips">( 提示：单位元 )</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退款备注" prop="remark">
              <el-input v-model="rForm.remark" type="textarea" placeholder="请输入退款备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="main-button" @click="submitRForm">确 定</el-button>
        <el-button @click="cancelRForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 退款对话框 end -->

    <!--订单详情对话框 start-->
    <orderDetail :show-dialog="openOrderDetailDialog" :order-id="orderInfo ? orderInfo.id+'' : 0" @closeDialog="closeOrderDialog"/>
    <!--订单详情对话框 end-->
  </div>
</template>

<script>
import { getName } from "@/utils/fuint";
import { getOrderList, updateOrderStatus, getOrderInfo, saveOrder, deleteOrder, verifyOrder, delivered } from "@/api/order";
import { doRefund } from "@/api/refund";
import orderPrintDialog from './orderPrintDialog';
import orderDetail from './orderDetail';
import {Message} from "element-ui";
export default {
  components: {
    orderPrintDialog,
    orderDetail
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 标题
      title: "",
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 店铺列表
      storeList: [],
      // 所属店铺
      storeIds: [],
      // 订单类型
      typeList: [],
      // 订单状态列表
      statusList: [],
      // 订单支付状态列表
      payStatusList: [],
      // 配送类型列表
      orderModeList: [],
      // 支付类型
      payTypeList: [],
      // 是否显示弹出层
      open: false,
      // 是否显示核销对话框
      openVerify: false,
      // 是否显示发货对话框
      openExpress: false,
      // 默认排序
      defaultSort: {prop: 'createTime', order: 'descending'},
      // 打印订单对话框
      openOrderPrintDialog: false,
      // 退款对话框
      openRefundDialog: false,
      // 订单详情对话框
      openOrderDetailDialog: false,
      storeInfo: {},
      orderInfo: {},
      // 表单参数
      form: { orderId: "", orderSn: 0, amount: "", orderMode: "oneself", discount: "", remark: "", status: "A" },
      vForm: { orderId: "", orderSn: "", remark: "", verifyCode: "" },
      eForm: { orderId: "", orderSn: "", expressCompany: "", expressNo: "" },
      rForm: { orderId: "", orderSn: "", payType: '', payAmount: "", refundAmount: "", remark: ""},
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        userId: '',
        mobile: '',
        status: '',
        payStatus: '',
        orderMode: '',
        orderSn: '',
        storeIds: ''
      },
      // 表单校验
      rules: {
        amount: [
          { required: true, message: "总金额不能为空", trigger: "blur" },
        ]
      },
      // 核销表单校验
      vFormRules: {
        verifyCode: [
          { required: true, message: "核销码不能为空", trigger: "blur" },
        ]
      },
      eFormRules: {
        expressCompany: [
          { required: true, message: "物流公司不能为空", trigger: "blur" },
        ],
        expressNo: [
          { required: true, message: "物流单号不能为空", trigger: "blur" },
        ]
      },
      rFormRules: {
        refundAmount: [
          { required: true, message: "退款金额不能为空", trigger: "blur" },
          { pattern: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/, message: `请输入正确的退款金额`, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询订单
    getList() {
      const app = this;
      app.loading = true;
      app.queryParams.storeIds = app.storeIds ? app.storeIds.join(",") : '';
      getOrderList(app.queryParams).then( response => {
            this.list = response.data.paginationResponse.content;
            this.total = response.data.paginationResponse.totalElements;
            this.typeList = response.data.typeList;
            this.statusList = response.data.statusList;
            this.payStatusList = response.data.payStatusList;
            this.orderModeList = response.data.orderModeList;
            this.payTypeList = response.data.payTypeList;
            this.storeList = response.data.storeList;
            this.loading = false;
          }
      ).catch(() => {
        // empty
      });
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.dateRange = [];
      this.queryParams.status = '';
      this.queryParams.mobile = '';
      this.queryParams.orderMode = '';
      this.queryParams.orderSn = '';
      this.queryParams.storeIds = '';
      this.storeIds = [];
      this.resetForm("queryForm");
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery();
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status == "A" ? "启用" : "禁用";
      this.$confirm('确认要' + text + '"' + row.orderSn + '"吗？').then(function() {
        return updateOrderStatus(row.id, row.status);
      }).then(() => {
        Message({
          message: text + "成功",
          type: "success"
        });
      }).catch(function() {
        row.status = row.status === "N" ? "A" : "N";
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    // 排序触发事件
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        orderId: "",
        orderSn: "",
        status: "A",
        amount: "",
        discount: "",
        remark: "",
        orderMode: "oneself",
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消核销按钮
    cancelVForm() {
      this.openVerify = false;
      this.vForm.orderId = '';
      this.vForm.orderSn = '';
      this.vForm.verifyCode = '';
    },
    // 提交核销按钮
    submitVForm: function() {
      this.$refs["vForm"].validate(valid => {
        if (valid) {
          verifyOrder(this.vForm).then(response => {
            Message({
              message: "提示：核销成功",
              type: "success"
            });
            this.cancelVForm();
            this.getList();
          }).catch(() => {
             // empty
          });
        }
      });
    },
    // 提交修改按钮
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          saveOrder(this.form).then(response => {
            Message({
              message: "提示：修改成功",
              type: "success"
            });
            this.open = false;
            this.getList();
          }).catch(() => {
             // empty
          });
        }
      });
    },
    // 查看详情按钮操作
    handleView(row) {
      this.orderInfo = row;
      this.openOrderDetailDialog = true;
      return true;
    },
    // 修改按钮操作
    handleUpdate(row) {
      const app = this;
      app.reset();
      const id = row.id || this.ids;
      getOrderInfo(id).then(response => {
        let orderInfo = response.data.orderInfo;
        if (orderInfo) {
            app.form.orderId = orderInfo.id;
            app.form.orderSn = orderInfo.orderSn;
            app.form.amount = orderInfo.amount;
            app.form.discount = orderInfo.discount;
            app.form.remark = orderInfo.remark;
            app.form.status = orderInfo.status;
            app.form.orderMode = orderInfo.orderMode+"";
        }
        this.open = true;
        this.title = "修改订单";
      }).catch(() => {
         // empty
      });
    },
    // 核销按钮操作
    handleVerify(row) {
      const app = this;
      const id = row.id || this.ids;
      getOrderInfo(id).then(response => {
        let orderInfo = response.data.orderInfo;
        if (orderInfo) {
          app.vForm.orderId = orderInfo.id;
          app.vForm.orderSn = orderInfo.orderSn;
          app.vForm.remark = orderInfo.remark;
        }
        app.openVerify = true;
      }).catch(() => {
         // empty
      });
    },
    // 发货按钮
    handleExpress(row) {
      const app = this;
      const id = row.id || this.ids;
      getOrderInfo(id).then(response => {
        let orderInfo = response.data.orderInfo;
        if (orderInfo) {
          app.eForm.orderId = orderInfo.id;
          app.eForm.orderSn = orderInfo.orderSn;
          app.eForm.expressNo = orderInfo.expressInfo ? orderInfo.expressInfo.expressNo : "";
          app.eForm.expressCompany = orderInfo.expressInfo? orderInfo.expressInfo.expressCompany : "";
        }
        app.openExpress = true;
      }).catch(() => {
         // empty
      });
    },
    // 取消发货按钮
    cancelEForm() {
      this.openExpress = false;
      this.eForm.orderId = '';
      this.eForm.orderSn = '';
      this.eForm.expressCompany = '';
      this.eForm.expressNo = '';
    },
    // 提交发货按钮
    submitEForm: function() {
      const app = this;
      if (app.loading) {
          app.$alert("请求处理中...");
      }
      app.$refs["eForm"].validate(valid => {
        if (valid) {
          app.loading = true;
          delivered(this.eForm).then(response => {
            Message({
              message: "提示：提交物流信息成功",
              type: "success"
            });
            app.cancelEForm();
            app.getList();
            app.loading = false;
          });
        }
      });
    },
    // 取消退款按钮
    cancelRForm() {
      this.openRefundDialog = false;
      this.rForm.orderId = '';
      this.rForm.orderSn = '';
      this.rForm.payAmount = '';
      this.rForm.payType = '';
      this.rForm.refundAmount = '';
      this.rForm.remark = '';
    },
    // 提交退款按钮
    submitRForm: function() {
      const app = this;
      if (app.loading) {
          app.$alert("请求处理中...");
      }
      if (parseFloat(app.rForm.refundAmount) > parseFloat(app.rForm.amount)) {
          app.$alert("退款金额不能大于订单总金额");
          return false;
      }
      app.$refs["rForm"].validate(valid => {
        if (valid) {
          app.loading = true;
          doRefund(app.rForm).then(response => {
            Message({
              message: "提示：提交退款成功",
              type: "success"
            });
            app.cancelRForm();
            app.getList();
            app.loading = false;
          });
        }
      });
    },
    // 删除按钮操作
    handleDelete(row) {
      const orderSn = row.orderSn;
      this.$confirm('是否确认删除订单号为"' + orderSn + '"的数据项？').then(function() {
        return deleteOrder(row.id);
      }).then(() => {
        this.getList();
        Message({
          message: "提示：删除成功",
          type: "success"
        });
      }).catch(() => {});
    },
    // 打印小票
    handlePrint(row) {
      const app = this;
      app.orderInfo = {};
      app.storeInfo = {};
      const id = row.id || this.ids;
      getOrderInfo(id).then(response => {
        let orderInfo = response.data.orderInfo;
        if (orderInfo) {
            app.orderInfo = orderInfo;
            app.storeInfo = orderInfo.storeInfo;
        }
        app.openOrderPrintDialog = true;
      }).catch(() => {
         // empty
      });
    },
    // 发起退款
    handleRefund(row) {
      const app = this;
      app.rForm.orderId = row.id;
      app.rForm.orderSn = row.orderSn;
      app.rForm.payAmount = row.payAmount;
      app.rForm.payType = getName(app.payTypeList, row.payType);
      app.openRefundDialog = true;
    },
    // 发起支付
    handlePay(orderInfo) {
      this.$emit('doPayOrder', orderInfo);
    },
    // 关掉打印对话框
    closePrintDialog() {
      this.openOrderPrintDialog = false;
    },
    // 关掉订单详情对话框
    closeOrderDialog() {
      this.openOrderDetailDialog = false;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDelete":
          this.handleDelete(row);
          break;
        case "handlePrint":
          this.handlePrint(row);
          break;
        case "handleRefund":
          this.handleRefund(row);
          break;
        case "handlePay":
          this.handlePay(row);
          break;
        default:
          this.handleView(row);
          break;
      }
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 12px;
  height: 12px;
  display: block;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #bfbfc0;
  border-radius: 5px;
}
::v-deep .el-table--scrollable-y .el-table__body-wrapper {
  overflow: overlay !important;
}
.order-container {
    position: absolute;
    top: 50px;
    left: 165px;
    right: 10px;
    height: 68%;
    .search-form {
       border: solid 1px #cccccc;
       margin-top: 0px;
       padding: 15px 10px 0px 10px;
       background: #f5f5f5;
       margin-bottom: 5px;
       border-radius: 3px;
    }
    .pagination {
      position: fixed;
      bottom: 10px;
      height: 50px;
      min-width: 730px;
      line-height: 50px;
      right: 150px;
      margin-top: 10px;
      display: block;
      background: #6c757d;
      color: #ffffff;
      border-radius: 5px;
      z-index: 99999;
    }
}
</style>
<style scoped>
::v-deep .el-pagination.is-background span {
  color: #fff;
}
</style>
