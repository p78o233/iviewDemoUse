<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">新增群组</Button>
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if='spin_show'></Spin>
      <tableComp :tableData='table_data' @editItem='editItem' @deleteItem='deleteItem'></tableComp>
      <p class="space">&nbsp;</p>
    </div>
    <transition name='bounce'>
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <span class="close-btn" @click='closePop()'>×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="组别名称">
              <Input v-model="formItem.name" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="权限列表">
              <CheckboxGroup v-model="selectRule">
                <Checkbox :label="item.id+''" v-for="item in rulesArr" :key="item.id">
                  <span>{{item.title}}</span>
                </Checkbox>
              </CheckboxGroup>
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
        table_data:{
          t_head:[
          { title: "ID", key: "id" },
          { title: "组别名称", key: "name" }
          ],
          t_body:[]
        },
        window_show: false,
        spin_show: false,
        formItem: {
          name: "",
          rules:""
        },
        rulesArr:[],
        selectRule:[],
        edit_status:'add',
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
        this.api.user_group().then(res => {
          this.$Message.info(res.msg);
          if (res.code == 1) {
            this.table_data.t_body = res.data;
          }
        })

        this.api.rules().then(res => {
          this.$Message.info(res.msg);
          if (res.code == 1) {
            this.rulesArr = res.data;
            this.spin_show = false;
          }
        })
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        if (this.formItem.name == "" || this.selectRule.length == 0) {
          this.$Message.error('提交数据不完整');
          return;
        }
        this.spin_show = true;
        this.formItem.rules = this.selectRule.join(',');
        if (this.edit_status == 'add') {
          this.api.user_group_add(this.formItem).then(res => {
            this.spin_show = false;
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            }else{
              this.$Message.error(res.msg);
            }
          })
        }else{
          this.api.user_group_edit(this.formItem).then(res => {
            this.spin_show = false;
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            }else{
              this.$Message.error(res.msg);
            }
          })
        }
      },
      closePop() {
        this.window_show = false;
        this.edit_status = "add";

        this.formItem = {
          name: "",
          rules:""
        };
      },
      editItem(item) {
        console.log(item)
        this.formItem = item;
        this.selectRule = item.rules.split(',');
        this.edit_status = 'edit';
        this.window_show = true;
      },
      deleteItem(item) {
        console.log(item)
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.user_group_del({id:item.id})
            .then(res => {
              console.log(res)
              this.spin_show = false;
              if (res.code == 1) {
                this.$Message.info(res.msg);
                this.initData();
              }
            })
          },
          onCancel: () => {
            this.$Message.info("取消操作");
          }
        });
      }
    }
  };
</script>

