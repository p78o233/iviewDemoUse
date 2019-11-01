<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="initData()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">新增品牌</Button>
    </div>
    <div class="table-container">
      <Spin size="large" fix v-if="spin_show"></Spin>
      <div class="table-scroll">
        <tableComp
          :tableData="table_data"
          @editItem="editItem"
          @deleteItem="deleteItem"
          @setItem="setItem"
          @setLevel="setLevel"
          @jumpUser="jumpUser"
        ></tableComp>
      </div>
      <p class="space">&nbsp;</p>
      <Page :total="totalPage" @on-change='changePage'></Page>
    </div>

    <!-- 编辑弹窗 -->
    <transition name="bounce">
      <div class="pop-container" v-show="window_show">
        <div class="pop-content">
          <span class="close-btn" @click="closePop()">×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="品牌名称">
              <Input v-model="formItem.name" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="权重">
              <Input v-model.number="formItem.weigh" type="number"></Input>
            </FormItem>
            <FormItem label="区域列表" v-show='formItem.area.length>0'>
              <div style="margin-left: 20px;color: #2d8cf0;">
                <ul>
                  <li v-for="area in formItem.area" :key="area.id">{{area.name}}</li>
                </ul>
              </div>
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

    <!-- 区域列表弹窗 -->
    <transition name="bounce">
      <div class="pop-container" v-show="window_area_show">
        <div class="pop-content">
          <span class="close-btn" @click="closePop()">×</span>
          <Form :model="formItem" :label-width="80">
            <p class="area-title">=> {{formItem.name}} <=</p>
            <Button
              type="primary"
              size="small"
              @click="area_show = true"
              style="margin-bottom: 10px;"
            >新增区域</Button>
            <Table height="500" :columns="table_rule" :data="formItem.area"></Table>
          </Form>
        </div>
      </div>
    </transition>

    <!-- 新增区域弹窗 -->
    <transition name="bounce">
      <div class="pop-container" v-show="area_show">
        <div class="pop-content">
          <Form :label-width="80">
            <FormItem label="区域名称">
              <Input v-model="new_area" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addArea()">
                <Icon type="md-checkmark"/>提交
              </Button>
              <Button style="margin-left: 8px" @click="closeArea()">
                <Icon type="md-close"/>取消
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </transition>

    <!-- 等级列表弹窗 -->
    <transition name="bounce">
      <div class="pop-container" v-show="window_level_show">
        <div class="pop-content">
          <Spin size="large" fix v-if="level_spin_show"></Spin>
          <span class="close-btn" @click="closePop()">×</span>
          <p class="area-title">=> {{brandItem.name}} <=</p>
          <Button
            type="primary"
            size="small"
            @click="level_show = true"
            style="margin-bottom: 10px;"
          >新增等级</Button>
          <Table height="500" :columns="table_level" :data="levelList"></Table>
          <Page :total="totalCount" size="small" @on-change="changeListPage"/>
        </div>
      </div>
    </transition>

    <!-- 新增等级弹窗 -->
    <transition name="bounce">
      <div class="pop-container" v-show="level_show">
        <div class="pop-content">
          <Form :label-width="80">
            <FormItem label="等级名称">
              <Input v-model="new_level" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="addLevel()">
                <Icon type="md-checkmark"/>提交
              </Button>
              <Button style="margin-left: 8px" @click="closeLevel()">
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
          { title: "品牌名称", key: "name" },
          { title: "权重", key: "weigh" }
        ],
        t_body: [],
        isSet: "编辑区域",
        isLevel: "等级列表",
        isUser: "查看用户"
      },
      table_rule: [
        //区域规则
        {
          title: "ID",
          key: "id"
        },
        {
          title: "区域名称",
          key: "name"
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editArea(params.row, params.index);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeArea(params.row, params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      table_level: [
        //等级规则
        {
          title: "ID",
          key: "id"
        },
        {
          title: "等级名称",
          key: "name"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editLevel(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.removeLevel(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      window_show: false,
      window_area_show: false,
      window_level_show: false,
      area_show: false,
      level_show: false,
      spin_show: false,
      level_spin_show: false,
      formItem: {
        id: "",
        name: "",
        weigh: 0,
        area: []
      },
      edit_status: "add",

      new_area: "",
      area_id_copy: "",
      edit_text_status: "add",
      edit_text_index: undefined,

      new_level: "",
      level_id_copy: "",

      brandItem: {},
      levelList: [],
      totalPage: 0,
      totalCount: 0,
      brandPage: 1,
      currentPage: 1,
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
      this.api.brand({
        page:this.brandPage
      }).then(res => {
        this.table_data.t_body = res.data.list;
        this.totalPage = res.data.totalPage*10;
        this.spin_show = false;
      });
    },
    changePage(page){
      this.brandPage = page;
      this.initData();
    },
    showPop() {
      this.window_show = true;
    },
    confirm() {
      if (this.formItem.name == "") {
        this.$Message.error("请输入标题");
        return;
      }
      this.spin_show = true;
      if (this.edit_status == "add") {
        this.api.brand_add(this.formItem).then(res => {
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
        this.api.brand_edit(this.formItem).then(res => {
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
      this.window_area_show = false;
      this.window_level_show = false;
      this.edit_status = "add";

      this.formItem = {
        id: "",
        weigh: 0,
        name: "",
        area: []
      };
    },

    //品牌管理功能=============>>
    editItem(item) {
      this.formItem = item;
      this.edit_status = "edit";
      this.window_show = true;
    },
    deleteItem(item) {
      this.$Modal.confirm({
        title: "警告",
        content: "<p>确定删除该项?</p>",
        onOk: () => {
          this.spin_show = true;
          this.api.rules_del({ id: item.id }).then(res => {
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
    setItem(item) {
      this.formItem = item;
      this.window_area_show = true;
    },
    //品牌管理功能<<=============

    //区域管理功能=============>>
    addArea() {
      if (this.new_area == "") {
        this.$Message.error("请输入区域名称");
        return;
      }
      if (this.edit_text_status == "add") {
        this.api
          .add_area({
            brandId: this.formItem.id,
            name: this.new_area
          })
          .then(res => {
            this.$Message.info(res.msg);
            if (res.code == 1) {
              let obj = {};
              obj.id = res.data.id;
              obj.name = res.data.name;
              this.formItem.area.push(obj);
              this.new_area = "";
              this.area_show = false;
            }
          });
        return;
      } else {
        this.api
          .edit_area({
            id: this.area_id_copy,
            brandId: this.formItem.id,
            name: this.new_area
          })
          .then(res => {
            this.$Message.info(res.msg);
            if (res.code == 1) {
              this.$set(
                this.formItem.area[this.edit_text_index],
                "name",
                this.new_area
              );
              this.new_area = "";
              this.area_id_copy = "";
              this.area_show = false;
            }
          });
        return;
      }
    },
    editArea(area, i) {
      this.edit_text_status = "edit";
      this.new_area = area.name;
      this.area_id_copy = area.id;
      this.area_show = true;
      this.edit_text_index = i;
    },
    removeArea(area, i) {
      let that = this;
      this.api.del_area({ id: area.id }).then(res => {
        that.$Message.info(res.msg);
        if (res.code == 1) {
          that.formItem.area.splice(i, 1);
        }
      });
    },
    closeArea() {
      this.area_show = false;
      this.new_area = "";
      this.edit_text_status = "add";
      this.edit_text_index = undefined;
    },
    //区域管理功能<<=============

    //等级管理功能=============>>
    setLevel(item) {
      this.brandItem = item;
      this.window_level_show = true;
      this.level_spin_show = true;
      this.loadLevel();
    },
    loadLevel() {
      this.api
        .get_level({ brandId: this.brandItem.id, page: this.currentPage })
        .then(res => {
          this.level_spin_show = false;
          if (res.code == 1) {
            this.levelList = res.data.list;
            this.totalCount = res.data.totalCount * 10;
          }
        });
    },
    closeLevel() {
      this.level_show = false;
      this.edit_text_status = "add";
      this.new_level = "";
      this.level_id_copy = "";
    },
    changeListPage(page) {
      this.currentPage = page;
      this.loadLevel();
    },
    addLevel() {
      if (this.new_level == "") {
        this.$Message.error("请输入等级名称");
        return;
      }
      if (this.edit_text_status == "add") {
        this.api
          .add_level({
            brandId: this.brandItem.id,
            name: this.new_level
          })
          .then(res => {
            this.$Message.info(res.msg);
            if (res.code == 1) {
              this.closeLevel();
              this.loadLevel();
            }
          });
      } else {
        this.api
          .edit_level({
            id: this.level_id_copy,
            brandId: this.brandItem.id,
            name: this.new_level
          })
          .then(res => {
            this.$Message.info(res.msg);
            if (res.code == 1) {
              this.closeLevel();
              this.loadLevel();
            }
          });
      }
    },
    editLevel(item) {
      this.edit_text_status = "edit";
      this.new_level = item.name;
      this.level_id_copy = item.id;
      this.level_show = true;
    },
    removeLevel(item) {
      this.api.del_level({ id: item.id }).then(res => {
        this.$Message.info(res.msg);
        if (res.code == 1) {
          this.loadLevel();
        }
      });
    },
    //等级管理功能<<=============

    //跳转用户界面
    jumpUser(item) {
      this.$router.push("/inner/brand/user?id=" + item.id);
      localStorage.setItem("brandItem", JSON.stringify(item));
      // localStorage.setItem('areaItem',JSON.stringify(this.formItem));
    }
  }
};
</script>

<style scoped>
.area-title {
  color: #2d8cf0;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}
.btn-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>