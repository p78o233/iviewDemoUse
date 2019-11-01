<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if="spin_show"></Spin>
      <div class="table-scroll">
        <tableComp :tableData='table_data' @editItem='editItem' @deleteItem='deleteItem'></tableComp>
      </div>
      <p class="space">&nbsp;</p>
      <Page :total="totalPage" @on-change='changePage'></Page>
    </div>
    <transition name='bounce'>
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <span class="close-btn" @click='closePop()'>×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="权限组列表">
              <Select v-model="formItem.groupId" style="width:200px">
                <Option v-for="item in rulesArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="confirm()"><Icon type="md-checkmark" />提交</Button>
              <Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import tableComp from "../../components/table/tableComp";
  export default {
    data() {
      return {
        keyword: "",
        table_data:{
          t_head:[
          { title: "ID", key: "id" },
          { title: "用户名", key: "username" },
          { title: "昵称", key: "nickname" },
          { title: "手机号", key: "mobile" },
          { title: "用户类型", key: "userType" }
          ],
          t_body:[],
          isDel:'true'
        },
        window_show: false,
        spin_show: false,
        formItem: {
          userId:"",
          groupId:""
        },
        totalPage:0,
        currentPage: 1,
        rulesArr:[],
      };
    },
    components: {
      tableComp
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData(){
        this.spin_show = true;
        this.api.set_group({
          page:this.currentPage
        }).then(res => {
          this.$Message.info(res.msg);
          if (res.code == 1) {
            this.table_data.t_body = res.data.userList;
            this.rulesArr = res.data.userRules;
            this.totalPage = res.data.totalPage*10;
            this.spin_show = false;
          }
        })
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        this.spin_show = true;
        this.api.set_group_edit(this.formItem)
        .then(res => {
          this.$Message.info(res.msg);
          console.log(res)
          if (res.code == 1) {
            this.closePop();
          }
        })
      },
      closePop() {
        this.spin_show = false;
        this.window_show = false;
        this.formItem = {
          userId:"",
          groupId:""
        }
      },
      editItem(item) {
        console.log(item)
        this.formItem.userId = item.id;
        this.formItem.username = item.username;
        this.formItem.groupId = item.group_id;
        this.window_show = true;
      },
      deleteItem(index) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.$Message.info("已删除");
          },
          onCancel: () => {
            this.$Message.info("取消操作");
          }
        });
      },
      changePage(page){
        console.log(page);
        this.currentPage = page;
        this.initData();
      }
    }
  };
</script>

