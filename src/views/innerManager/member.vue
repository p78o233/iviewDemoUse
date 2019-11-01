<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">添加内部人员</Button>
      <p class="space"></p>
      <Input v-model="searchName">
      <Select v-model="searchType" slot="prepend" style="width: 80px">
        <Option value="username">账号</Option>
        <Option value="nickname">姓名</Option>
        <Option value="mobile">手机号码</Option>
        <Option value="departmentId">部门ID</Option>
        <Option value="positionId">岗位ID</Option>
      </Select>
      <Button slot="append" icon="ios-search" @click="searchByType()">

      </Button></Input>
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
          <Spin size="large" fix v-if="spin_show"></Spin>
          <Form :model="formItem" :label-width="80">
            <FormItem label="账号" v-show='edit_status == "add"'>
              <Input v-model="formItem.username" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="姓名">
              <Input v-model="formItem.nickname" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
              <Checkbox v-model="passwordCheck" v-show="edit_status == 'edit'">修改密码</Checkbox>
            </FormItem>
            <FormItem label="密码" v-show="passwordCheck || edit_status == 'add'">
              <Input v-model="formItem.password" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="联系方式">
              <input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" type="text" placeholder="Enter something..." class="myInput"/>
            </FormItem>
            <FormItem label="部门">
              <Select v-model="formItem.departmentId" @on-change='changeDepart'>
                <Option :value="item.id" v-for='item in departmentList' :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="岗位">
              <Select v-model="formItem.positionId">
                <Option :value="item.id" v-for='item in positionList' :key="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="性别">
              <RadioGroup v-model="formItem.gender">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="状态">
              <RadioGroup v-model="formItem.status">
                <Radio label="normal">正常</Radio>
                <Radio label="hidden">冻结</Radio>
              </RadioGroup>
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
          { title: "账号", key: "username" },
          { title: "姓名", key: "nickname" },
          { title: "联系方式", key: "mobile" },
          { title: "部门", key: "departmentName" },
          { title: "岗位", key: "positionName" },
          { title: "状态", key: "statusText" }
          ],
          t_body:[]
        },
        window_show: false,
        spin_show: false,
        passwordCheck: false,
        formItem: {
          nickname: "",
          mobile: "",
          username: "",
          password: "",
          gender: "1",
          status: "normal",
          positionId: "",
          departmentId: "",
        },
        departmentList:[],
        positionList:[],
        edit_status: "add",
        totalPage:0,
        currentPage: 1,
        searchName: "",
        searchType:'username',
        searchObject:{
          page:this.currentPage
        },
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
        this.api.user(this.searchObject).then(res => {
          console.log(res)
          this.table_data.t_body = res.data.list;
          this.departmentList = res.data.departmentAndPosition;
          this.totalPage = res.data.totalPage*10;
          for(let i of this.table_data.t_body){
            this.$set(i,'departmentName',i.department.name);
            this.$set(i,'positionName',i.position.name);
            if (i.status == 'normal') {
              this.$set(i,'statusText','正常');
            }else {
              this.$set(i,'statusText','冻结');
            }
          }
          this.spin_show = false;
        })
      },
      //请空搜索条件并刷新
      refresh(){
        this.currentPage = 1;
        this.searchName = '';
        this.searchType = 'username';
        this.searchObject = {page:this.currentPage};
        this.initData();
      },
      //按searchType类型搜索
      searchByType(){
        this.currentPage = 1;
        this.searchObject = {page:this.currentPage};
        this.searchObject[this.searchType] = this.searchName;
        this.initData();
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        let verfyList = [
        this.formItem.username,
        this.formItem.nickname,
        this.formItem.mobile,
        this.formItem.positionId,
        this.formItem.departmentId
        ];
        if (verfyList.includes("")) {
          this.$Message.error("用户数据不完整");
          return;
        }

        this.spin_show = true;
        const md5 = require('md5-node');
        this.formItem.password = md5(this.formItem.password);
        if (this.edit_status == "add") {
          this.api.user_add(this.formItem).then(res => {
            this.spin_show = false;
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            } else {
              this.$Message.error(res.msg);
            }
          });
        } else {
          if (this.passwordCheck && this.formItem.password == "") {
            this.$Message.error("密码不能为空");
            return;
          }
          if (!this.passwordCheck) {
            this.formItem.password = '';
          }
          this.formItem.userId = this.formItem.id;
          delete this.formItem.departmentName;
          delete this.formItem.positionName;
          delete this.formItem.position;
          delete this.formItem.department;
          this.api.user_edit(this.formItem).then(res => {
            this.spin_show = false;
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            } else {
              this.$Message.error(res.msg);
            }
          });
        }
      },
      closePop() {
        this.window_show = false;
        this.formItem = {
          nickname: "",
          mobile: "",
          username: "",
          password: "",
          gender: "1",
          status: "normal",
          positionId: "",
          departmentId: "",
        };
        this.edit_status = 'add';
        this.passwordCheck = false;
      },
      editItem(item) {
        console.log(item)
        this.formItem = item;
        this.window_show = true;
        this.formItem.gender = item.gender+'';
        this.formItem.departmentId = item.department.id;
        this.formItem.positionId = item.position.id;
        this.changeDepart();
        this.edit_status = 'edit';
      },
      deleteItem(item) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.user_del({ id: item.id }).then(res => {
              console.log(res);
              this.spin_show = false;
              if (res.code == 1) {
                this.$Message.info(res.msg);
                this.initData();
              }
            });
          },
          onCancel: () => {
            this.$Message.info("取消操作");
          }
        });
      },
      changePage(page){
        this.currentPage = page;
        this.initData();
      },
      changeDepart(type){
        if (type == 1) {
          this.formItem.positionId = '';
        }
        for(let o of this.departmentList){
          if (o.id == this.formItem.departmentId) {
            this.positionList = o.position;
          }
        }
      }
    }
  };
</script>

