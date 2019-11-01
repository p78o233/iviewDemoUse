<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
      <p class="space"></p>
      <Button type="primary" icon="md-add" @click="showPop()">新增工具</Button>
      <p class="space"></p>
      <Input v-model="searchName">
      <Select v-model="searchType" slot="prepend" style="width: 80px">
        <Option value="name">工具名称</Option>
        <Option value="storeName">店铺名称</Option>
        <Option value="categoryName">分类名称</Option>
        <Option value="province">省</Option>
        <Option value="city">市</Option>
        <Option value="area">区</Option>
      </Select>
      <Button slot="append" icon="ios-search" @click="searchByType()"></Button></Input>
      
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
          <span class="close-btn" @click="closePop()">×</span>
          <Form :model="formItem" :label-width="80">
            <FormItem label="公司名称">
              <Input v-model="formItem.companyName" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="手机号">
              <input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" type="text" placeholder="Enter something..." class="myInput"/>
            </FormItem>
            <FormItem label="选择分类">
              <Select v-model="formItem.cid" style="width:200px">
                <Option v-for="item in toolsCateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="省市区">
              <PCA ref="pca" @changeArea="changeArea" :pcaObject="pcaObject"></PCA>
            </FormItem>
            <FormItem label="图片">
              <Spin size="large" fix v-if="img_show"></Spin>
              <div class="avatar" v-show='formItem.img == ""' @click='tabInput'>
                <Icon type="md-images" />
              </div>
              <div class="image-box" v-show='formItem.img != ""'>
                <span @click="deleteAvatar">×</span>
                <img :src="formItem.img" class="avatar-img">
              </div>
              <input type="file" id="avatarInput" style="display: none;" accept="image/*" @change="uploadFile">
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
  import PCA from "../../components/PCA";
  export default {
    data() {
      return {
        table_data: {
          t_head: [
          { title: "ID", key: "id" },
          { title: "公司名称", key: "companyName" },
          { title: "手机号码", key: "mobile" },
          { title: "工具分类", key: "toolCategory" },
          { title: "省", key: "province" },
          { title: "市", key: "city" },
          { title: "区", key: "area" },
          ],
          t_body: []
        },
        window_show: false,
        spin_show: false,
        img_show: false,
        formItem: {
          companyName: "",
          mobile: "",
          img: "",
          cid: "",
        },
        searchName: "",
        currentPage: 1,
        totalPage: 0,
        edit_status: "add",

        searchType:'name',
        searchObject:{
          page:this.currentPage
        },
        toolsCateList:[],
        pcaObject:{
          province:'',
          city:'',
          area:''
        },
        percent:0
      };
    },
    components: {
      tableComp,
      PCA
    },
    mounted() {
      this.initData();
    },
    methods: {
      initData() {
        this.spin_show = true;
        this.api.tool(this.searchObject)
        .then(res => {
          this.table_data.t_body = res.data.list;
          this.totalPage = res.data.totalPage*10;
          for(let i of this.table_data.t_body){
            this.$set(i,'toolCategory',i.tool_category.name);
          }
        });

        this.api.tool_cate()
        .then(res => {
          this.toolsCateList = res.data;
          this.spin_show = false;
        });
      },
      //请空搜索条件并刷新
      refresh(){
        this.currentPage = 1;
        this.searchName = '';
        this.searchType = 'name';
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
        this.spin_show = true;
        if (this.edit_status == "add") {
          this.api.tool_add(this.formItem).then(res => {
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
          this.api.tool_edit(this.formItem).then(res => {
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
        this.formItem = item;
        this.formItem.cid = item.tool_category.id;
        this.edit_status = "edit";
        this.$refs.pca.triggByParent(item);
        this.window_show = true;
      },
      deleteItem(item) {
        console.log(item);
        this.$Modal.confirm({
          title: "警告",
          content: "<p>确定删除该项?</p>",
          onOk: () => {
            this.spin_show = true;
            this.api.tool_del({ id: item.id }).then(res => {
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
      changeArea(item){
        console.log(item);
        this.formItem.province = item.province;
        this.formItem.city = item.city;
        this.formItem.area = item.area;
      },
      deleteAvatar(){
        this.formItem.img = '';
      },
      //吊起input
      tabInput(){
        document.getElementById('avatarInput').click();
      },
      uploadFile(e){
        let file = e.target.files[0];
        if (file) {
          console.log(file)
          if (file.type.split('/')[0] !== 'image') {
            this.$Message.error('不支持该文件格式');
            document.getElementById('avatarInput').value = '';
            return;
          }else{
            this.img_show = true;
            this.api.common_upload().then(res => {
              console.log(res)
              let data = res.data;
              if (res.code == 1) {
                //创建oss对象
                let OSS = require('ali-oss');
                let client = new OSS({
                  region: data.endpoint,
                  accessKeyId: data.accessKeyId,
                  accessKeySecret: data.accessKeySecret,
                  bucket: data.bucket
                });
                
                let filename = new Date().getTime() + '';
                //使用put方法上传图片
                client.put(filename,file)
                .then(result => {
                  this.formItem.img = result.url;
                  this.img_show = false;
                })
                .catch(err => {
                  console.log(err)
                })
              }else {
                this.$Message.error(res.msg);
              }
            })
          }
        }
      }
    }
  };
</script>

