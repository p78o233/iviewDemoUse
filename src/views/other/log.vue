<template>
  <div class="container">
    <div class="btn-nav">
      <Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
      <p class="space"></p>
      <Input v-model="searchName">
      <Button slot="append" icon="ios-search" @click="initData()"></Button>
    </Input>
    
  </div>
  <div class="table-container">
    <Spin size="large" fix v-if="spin_show"></Spin>
    <div class="table-scroll">
      <Table :columns="columns" :data="table_data"></Table>
    </div>
    <p class="space">&nbsp;</p>
    <Page :total="totalPage" @on-change="changePage"></Page>
  </div>
</div>
</template>

<script>
  import tableComp from "../../components/table/tableComp";
  import {timestampToTime} from "../../common/common";
  export default {
    data() {
      return {
        spin_show: false,
        searchName: "",
        currentPage: 1,
        totalPage: 0,
        table_data: [],
        columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '操作人',
          key: 'user_name'
        },
        {
          title: '项目名称',
          key: 'project_name'
        },
        {
          title: '节点名称',
          key: 'rule_name'
        },
        {
          title: '操作时间',
          key: 'timeT'
        },
        ],
      };
    },
    components: {
      tableComp
    },
    mounted() {
      this.initData();
    },
    methods: {
      refresh(){
        this.searchName = '';
        this.currentPage = 1;
        this.initData();
      },
      initData() {
        this.spin_show = true;
        this.api.process_handle_log({
          storeName: this.searchName,
          page: this.currentPage
        }).then(res => {
          console.log(res)
          if (res.code == 1) {
            this.table_data = res.data.list;
            for(let i of this.table_data){
              this.$set(i,'user_name',i.user.nickname);
              this.$set(i,'rule_name',i.rule.name);
              this.$set(i,'project_name',i.project.storeName);
              this.$set(i,'timeT',timestampToTime(i.createtime));
            }
            this.totalPage = res.data.totalPage*10;
            this.spin_show = false;
          }else{
            this.$Message.error(res.msg);
          }
        });
      },
      changePage(page) {
        this.currentPage = page;
        this.initData();
      }
    }
  };
</script>

