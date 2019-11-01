<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">新增工具分类</Button>
      
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if="spin_show"></Spin>
      <tableComp :tableData="table_data" @editItem="editItem" @deleteItem="deleteItem" @setItem="setItem"></tableComp>
    </div>
    <transition name="bounce">
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <span class="close-btn" @click="closePop()">×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="分类名称">
              <Input v-model="formItem.name" placeholder="请输入..."></Input>
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
        table_data: {
          t_head: [
          { title: "ID", key: "id" },
          { title: "分类名称", key: "name" }
          ],
          t_body: []
        },
        window_show: false,
        spin_show: false,
        formItem: {
          name: ""
        },
        searchName: "",
        edit_status: "add"
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
        this.api.tool_cate()
        .then(res => {
          this.table_data.t_body = res.data;
          this.totalPage = res.data.totalPage*10;
          this.spin_show = false;
        });
      },
      showPop() {
        this.window_show = true;
      },
      confirm() {
        this.spin_show = true;
        if (this.edit_status == "add") {
          this.api.tool_cate_add(this.formItem).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            } else {
              this.$Message.error(res.msg);
            }
            this.spin_show = false;
          });
        } else {
          this.api.tool_cate_edit(this.formItem).then(res => {
            if (res.code == 1) {
              this.$Message.success(res.msg);
              this.closePop();
              this.initData();
            } else {
              this.$Message.error(res.msg);
            }
            this.spin_show = false;
          });
        }
      },
      closePop() {
        this.window_show = false;
        this.edit_status = "add";

        this.formItem = {
          name: ""
        };
      },
      editItem(item) {
        console.log(item);
        this.formItem = item;
        this.edit_status = "edit";
        this.window_show = true;
      },
      deleteItem(item) {
        console.log(item);
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.tool_cate_del({ id: item.id }).then(res => {
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
      changePage(page) {
        this.currentPage = page;
        this.initData();
      },
      setItem(item){
        console.log(item)
        this
      }
    }
  };
</script>

