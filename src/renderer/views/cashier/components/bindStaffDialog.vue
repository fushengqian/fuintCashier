<template>
    <el-dialog class="common-dialog" title="关联员工" :visible="showDialog" @close="close" width="750px" destroy-on-close>
      <div class="data-contain">
          <el-table ref="tables" v-loading="loading" :data="staffList" border style="width: 100%;">
            <el-table-column label="ID" prop="id" width="100"/>
            <el-table-column label="姓名" align="center" prop="realName" />
            <el-table-column label="手机号" align="center" prop="mobile"/>
            <el-table-column label="操作" align="center" width="138" fixed='right'>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="button"
                  class="danger"
                  icon="el-icon-user"
                  @click="doBindStaff(scope.row)"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            class="pagination"
            :page.sync="queryParams.page"
            :limit.sync="queryParams.pageSize"
            @pagination="getStaffList"
          />
      </div>
      <div slot="footer" class="dialog-footer">
         <el-button type="primary" class="main-button" @click="close()">关闭</el-button>
      </div>
    </el-dialog>
</template>
<script>
import { getStaffList } from "@/api/staff";
export default {
    props: {
      showDialog: {
        type:[Boolean],
        default:()=>false
      }
    },
    watch: {
      showDialog(value) {
        if (value) {
            this.getStaffList();
        }
      }
    },
    data(){
        return {
          loading: false,
          total: 0,
          staffList: [],
          // 查询参数
          queryParams: {
            page: 1,
            pageSize: 10,
            mobile: "",
            name: ""
          },
        }
    },
    methods: {
        // 绑定员工
        doBindStaff(staff) {
          this.$emit('doBindStaff', staff);
        },
        // 获取员工列表
        getStaffList() {
          const app = this;
          getStaffList(app.queryParams).then( response => {
            if (response.data.paginationResponse) {
                app.staffList = response.data.paginationResponse.content;
                app.total = response.data.paginationResponse.totalElements;
            }
          }).catch(() => {
             // empty
          });
        },
        // 关闭对话框
        close() {
           this.$emit('closeDialog','openBindStaffDialog');
        }
    }
}
</script>
<style lang="scss" scoped>
  .data-contain {
    height: 100%;
  }
</style>
