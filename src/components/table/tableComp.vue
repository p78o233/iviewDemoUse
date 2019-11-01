<template>
  <div class="table-con">
    <table id="hor-minimalist-b">
      <thead>
        <tr>
          <th v-for="(th,i1) in tableData.t_head" :key='i1'>{{th.title}}</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tb,i2) in tableData.t_body" :key='i2'>
          <td v-for='(tk,i3) in tableData.t_head' :key='tk.key'><div class="td_div">{{tb[tk.key]}}</div></td>
          <td>
            <span class="edit-btn" @click='editItem(tb)'><Icon type="md-create" />编辑</span>
            <label v-if='!tableData.isDel'>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
            
            <span class="set-btn" @click='setItem(tb)' v-if='tableData.isSet'><Icon type="md-build" />{{tableData.isSet}}</span>
            <label v-if='tableData.isSet'>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
            
            <span class="level-btn" @click='setLevel(tb)' v-if='tableData.isLevel'><Icon type="md-stats" />{{tableData.isLevel}}</span>
            <label v-if='tableData.isLevel'>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
            
            <span class="user-btn" @click='jumpUser(tb)' v-if='tableData.isUser'><Icon type="md-person" />{{tableData.isUser}}</span>
            <label v-if='tableData.isUser'>&nbsp;&nbsp;|&nbsp;&nbsp;</label>

            <span class="delete-btn" @click='deleteItem(tb)' v-if='!tableData.isDel'><Icon type="md-trash" />删除</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p style="text-align: center;width: 100%;margin-top: 50px;" v-show='tableData.t_body.length == 0'>暂无数据</p>
  </div>
</template>

<script>
  export default {
    props:{
      tableData:{}
    },
    mounted(){

    },
    methods:{
      editItem(item){
        this.$emit('editItem',item);
      },
      deleteItem(item){
        this.$emit('deleteItem',item);
      },
      setItem(item){
        this.$emit('setItem',item);
      },
      setLevel(item){
        this.$emit('setLevel',item);
      },
      jumpUser(item){
        this.$emit('jumpUser',item);
      },
    }
  }
</script>


<style scoped>
@import '../../assets/css/table.less';
</style>

