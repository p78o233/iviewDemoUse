<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">添加区域用户</Button>
      <p class="space"></p>
      <Input search enter-button placeholder="请输入搜索内容" v-model="keyword" on-click="searchKeyword()" />
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if="spin_show"></Spin>
      <div class="table-scroll">
        <tableComp :tableData="table_data" @editItem="editItem" @deleteItem="deleteItem"></tableComp>
      </div>
      <p class="space">&nbsp;</p>
      <Page :total="totalPage" @on-change="changePage"></Page>
    </div>
    <transition name="bounce">
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <Spin size="large" fix v-if="spin_show"></Spin>
          <Form :model="formItem" :label-width="80">
            <FormItem label="用户名" v-show='edit_status == "add"'>
              <Input v-model="formItem.username" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="昵称">
              <Input v-model="formItem.nickname" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem>
              <Checkbox v-model="passwordCheck" v-show="edit_status == 'edit'">修改密码</Checkbox>
            </FormItem>
            <FormItem label="密码" v-show="passwordCheck || edit_status == 'add'">
              <Input v-model="formItem.passwordCopy" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="联系方式">
              <input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" type="text" placeholder="Enter something..." class="myInput"/>
            </FormItem>
            <FormItem label="性别">
              <RadioGroup v-model="formItem.gender+''">
                <Radio label="1">男</Radio>
                <Radio label="2">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="是否主管">
              <RadioGroup v-model="formItem.isMaster" @on-change='chooseIsMaster()'>
                <Radio label="0">否</Radio>
                <Radio label="1">是</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="状态">
              <RadioGroup v-model="formItem.status">
                <Radio label="normal">正常</Radio>
                <Radio label="hidden">冻结</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="区域列表" v-show='formItem.isMaster == "0"'>
              <CheckboxGroup v-model="selecArea">
                <Checkbox :label="item.id+''" v-for="item in areaList" :key="item.id">
                  <span>{{item.name}}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="confirm()">
                <Icon type="md-checkmark"/>提交
              </Button>
              <Button style="margin-left: 8px" @click="closePop()">
                <Icon type="md-close"/>取消
              </Button>
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
        table_data: {
          t_head: [
          { title: "ID", key: "id" },
          { title: "用户名", key: "username" },
          { title: "昵称", key: "nickname" },
          { title: "性别", key: "genderText" },
          { title: "是否主管", key: "Master" },
          { title: "状态", key: "status" }
          ],
          t_body: []
        },
        window_show: false,
        spin_show: false,
        passwordCheck: false,
        formItem: {
          nickname: "",
          gender: "1", //1男2女
          brandId: "",
          areaIds: [],
          isMaster: "0",
          passwordCopy: "",
          password: "",
          username: "",
          status: "normal",
          mobile: ""
        },
        totalPage: 0,
        currentPage: 1,

        brandItem: {},
        areaItem: {},

        areaList: [],
        selecArea: [],

        edit_status: "add",     //数据提交类型,用来判断是新增操作还是修改操作

        searchType: [
        {
          value: "",
          label: ""
        }
        ]
      };
    },
    components: {
      tableComp
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.spin_show = true;
        this.brandItem = JSON.parse(localStorage.getItem("brandItem"));

        this.api.get_user({
          brandId: this.brandItem.id,
          page: this.currentPage,
          page: 1
        }).then(res => {
          this.table_data.t_body = res.data.list;
          this.totalPage = res.data.totalPage * 10;
          this.areaList = res.data.areaList;

          this.table_data.t_body.forEach((v)=>{
            if (v.gender == 1) {
              this.$set(v,'genderText','男')
            }else{
              this.$set(v,'genderText','女')
            }
            if (v.isMaster == '1') {
              this.$set(v,'Master','是')
            }else{
              this.$set(v,'Master','否')
            }
            if (v.status == 'normal') {
              this.$set(v,'statusText','正常')
            }else{
              this.$set(v,'statusText','冻结')
            }
          })

          this.spin_show = false;
        });
      },
      showPop() {
        this.window_show = true;
      },
      searchKeyword() {},

      confirm() {
        let verfyList = [
        this.formItem.username,
        this.formItem.nickname,
        this.formItem.mobile
        ];
        if (verfyList.includes("")) {
          this.$Message.error("用户数据不完整");
          return;
        }
        if (this.selecArea.length == 0 && this.formItem.isMaster == '0') {
          this.$Message.error("请选择区域");
          return;
        }

        this.formItem.brandId = this.brandItem.id;
        this.formItem.areaIds = JSON.stringify(this.selecArea);
        this.formItem.userId = this.formItem.id;

        this.spin_show = true;
        const md5 = require('md5-node');
        this.formItem.password = md5(this.formItem.passwordCopy);
        if (this.edit_status == "add") {
          this.api.add_user(this.formItem).then(res => {
            console.log(res)
            this.$Message.info(res.msg);
            this.spin_show = false;
            if (res.code == 1) {
              this.closePop();
              this.initData();
            }
          });
        } else {
          if (this.passwordCheck && this.formItem.passwordCopy == "") {
            this.$Message.error("密码不能为空");
            return;
          }
          if (!this.passwordCheck) {
            this.formItem.password = '';
          }
          delete this.formItem.user_brand;
          this.api.edit_user(this.formItem).then(res => {
            this.$Message.info(res.msg);
            this.spin_show = false;
            if (res.code == 1) {
              this.closePop();
              this.initData();
            }
          });
        }
      },
      closePop() {
        this.window_show = false;
        this.formItem = {
          nickname: "",
          gender: "1",
          brandId: "",
          areaIds: [],
          isMaster: "0",
          mobile: "",
          passwordCopy: "",
          password: "",
          username: ""
        };
        this.selecArea = [];
        this.edit_status = "add";
        this.passwordCheck = false;
      },
      editItem(item) {
        console.log(item);
        this.formItem = item;
        this.selecArea = [];

        for (let i of item.user_brand) {
          this.selecArea.push(i.areaId + "");
        }
        this.window_show = true;
        this.edit_status = "edit";
      },
      deleteItem(item) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.api.del_user({ id: item.id }).then(res => {
              this.$Message.info(res.msg);
              this.initData();
            });
          },
          onCancel: () => {
            this.$Message.info("取消操作");
          }
        });
      },
      changePage(page) {
        this.currentPage = page;
        this.initData();
      },
      chooseIsMaster(){
        this.selecArea = [];
      }
    }
  };
</script>

