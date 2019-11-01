<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">新增部门</Button>
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if='spin_show'></Spin>
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
          <Spin size="large" fix v-if='spin_show'></Spin>
          <Form :model="formItem" :label-width="80">
            <FormItem label="部门名称">
              <Input v-model="formItem.name" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="权重">
              <Input v-model.number="formItem.weigh" type="number" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="岗位列表">
              <CheckboxGroup v-model="selecJob">
                <Checkbox :label="item.id+''" v-for="item in jobList" :key="item.id">
                  <span>{{item.name}}</span>
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
        keyword: "",
        table_data:{
          t_head:[
          { title: "ID", key: "id" },
          { title: "部门名称", key: "name" },
          { title: "权重", key: "weigh" },
          ],
          t_body:[]
        },
        window_show: false,
        spin_show: false,
        formItem: {
          name: "",
          weigh: 0,
        },
        totalPage:0,

        jobList:[],
        selecJob:[],
        edit_status:'add',

        page:1,
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
        this.api.department({page:this.page}).then(res => {
          this.table_data.t_body = res.data.list;
          this.totalPage = res.data.totalPage*10;
          this.spin_show = false;
        })
        if (this.page == 1) {
          this.api.get_all_position().then(res => {
            this.jobList = res.data;
          })
        }
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        if (this.formItem.name == "" || this.selecJob.length == 0) {
          this.$Message.error('提交数据不完整');
          return;
        }
        this.spin_show = true;
        this.formItem.positionIds = this.selecJob.join(',');
        if (this.edit_status == 'add') {
          this.api.department_add(this.formItem).then(res => {
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
          this.api.department_edit(this.formItem).then(res => {
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
        this.selecJob = [];
        this.edit_status = "add";
        this.formItem = {
          name: "",
          weigh: 0
        }
      },
      editItem(item) {
        this.formItem = item;
        this.selecJob = [];
        if (item.position.length>0) {
          for(let p of item.position){
            this.selecJob.push(p.id+'');
          }
        }
        console.log(this.selecJob)
        this.window_show = true;
        this.edit_status = 'edit';
      },
      deleteItem(item) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.department_del({id:item.id})
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
      },
      changePage(page){
        this.page = page;
        this.initData();
      }
    }
  };
</script>

