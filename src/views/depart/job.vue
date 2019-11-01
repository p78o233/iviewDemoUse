<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="initData()">刷新</Button>
			<p class="space"></p>
			<Button type="primary" icon="md-add" @click="showPop()">新增岗位</Button>
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if='spin_show'></Spin>
      <div class="table-scroll">
        <tableComp :tableData='table_data' @editItem='editItem' @deleteItem='deleteItem' @setItem='setItem'></tableComp>
      </div>
      <p class="space">&nbsp;</p>
      <Page :total="totalPage" @on-change='changePage'></Page>
    </div>
    <transition name='bounce'>
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <span class="close-btn" @click='closePop()'>×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="岗位名称">
             <Input v-model="formItem.name" placeholder="请输入..."></Input>
           </FormItem>
           <FormItem label="权重">
             <Input v-model.number="formItem.weigh" type="number"></Input>
           </FormItem>
           <FormItem>
             <Button type="primary" @click="confirm()"><Icon type="md-checkmark" />提交</Button>
             <Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
           </FormItem>
         </Form>
       </div>
     </div>
   </transition>

   <transition name='bounce'>
     <div class="pop-container" v-show="window_show_set">
      <div class="pop-content">
        <span class="close-btn" @click='closePop()'>×</span>
        <Form :model="formItem" :label-width="80">
          <FormItem label="岗位名称">
            <Input v-model="formItem.name" readonly></Input>
          </FormItem>
          <FormItem label="分配权限">
           <div v-for='(per,index) in permissonList' :key='index' class="check-title">
            <p>{{per.name}}</p>
            <div v-for="valCheck in per.rules" style="display: flex;justify-content: space-between;padding:0 50px;">
             <Checkbox v-model='valCheck.checkStatus'>{{valCheck.name}}</Checkbox>
             <div style="margin-left: 50px;display: flex;" v-show="valCheck.checkStatus">
              <RadioGroup v-model="valCheck.readOnly">
               <Radio label='1'>只读</Radio>
               <Radio label='0'>可编辑</Radio></RadioGroup>
             </div></div></div>
           </FormItem>
           <FormItem>
             <Button type="primary" @click="setPermission()"><Icon type="md-checkmark" />提交</Button>
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
          { title: "岗位名称", key: "name" },
          { title: "权重", key: "weigh" }
          ],
          t_body:[],
          isSet:"设置权限"
        },
        window_show: false,
        window_show_set: false,
        spin_show: false,
        formItem: {
          name: "",
          weigh: 0
        },
        edit_status:'add',

        permissonList:[],
        selectPermiss:[],

        totalPage:0,
        currentPage:1
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
        this.api.position({
          page:this.currentPage
        }).then(res => {
          this.table_data.t_body = res.data.list;
          this.totalPage = res.data.totalPage*10;
        })

        this.api.position_rule().then(res => {
          this.permissonList = res.data;
          this.spin_show = false;
          for(let p of this.permissonList){
            for(let i of p.rules){
              this.$set(i,'readOnly','0');
              this.$set(i,'checkStatus',false);
            }
          }
        })
      },
      changePage(page){
        this.currentPage = page;
        this.initData();
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        this.spin_show = true;
        if (this.edit_status == 'add') {
          this.api.position_add(this.formItem).then(res => {
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
          this.api.position_edit(this.formItem).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            }else{
              this.$Message.error(res.msg);
            }
            this.spin_show = false;
          })
        }
      },
      closePop() {
        this.window_show = false;
        this.window_show_set = false;
        this.edit_status = "add";

        this.formItem = {
          name: "",
          weigh: 0
        };
      },
      editItem(item) {
        this.formItem = item;
        this.edit_status = 'edit';
        this.window_show = true;
      },
      deleteItem(item) {
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.position_del({id:item.id})
            .then(res => {
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
      setItem(item){
        let that = this;
        this.window_show_set = true;
        this.formItem = item;
        for(let i of item.position_rule){
          // 后台的大佬在这里留了点料,
          // 如果pid不为0的话则用pid来判断,
          // 如果pid为0则用id来判断
          if (i.pid != 0) {
            for(let p of that.permissonList){
              if (p.id == i.pid) {
                for(let child of p.rules){
                  if (child.id == i.id) {
                    this.$set(child,"checkStatus",true);
                    this.$set(child,"readOnly",i.pivot.readOnly);
                  }
                }
              }
            }
          }else{
            for(let p of that.permissonList){
              if (p.id == i.id) {
                for(let child of p.rules){
                  if (child.id == i.id) {
                    this.$set(child,"checkStatus",true);
                    this.$set(child,"readOnly",i.pivot.readOnly);
                  }
                }
              }
            }
          }
        }
      },
      setPermission(){
        let rulesJson = [];
        for(let p of this.permissonList){
          for(let i of p.rules){
            if (i.checkStatus === true) {
              let obj = {};
              obj.ruleId = i.id;
              obj.readOnly = parseInt(i.readOnly);
              obj.id = p.id;
              rulesJson.push(obj);
            }
          }
        }
        if (rulesJson.length == 0) {
          this.$Message.error('请选择分配权限');
          return;
        }
        this.api.set_rule({positionId:this.formItem.id,rulesJson:JSON.stringify(rulesJson)})
        .then(res => {
          this.$Message.success(res.msg);
          if (res.code == 1) {
            this.closePop();
            this.initData();
          }
        })
      }
    }
  };
</script>

<style scoped>
.check-title{
  padding-top: 20px;
}
</style>
