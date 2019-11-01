<template>
  <div class="tag-scroll" id="nav">
    <div
    :class="item.active?'tagitemActived fadeitem':'tagitem fadeitem'"
    v-for="(item,index) in viewRouterList"
    :key="item.path"
     @click="activeTag(item.path)"
    >
    <label>{{item.title}}</label>
    <Icon type="md-close-circle" @click='closeTag(index)' v-if='item.name !== "projectList"'/>
  </div>
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {};
    },
    mounted() {
      this.addViewRouter(this.$route)
      let nav = document.getElementById("nav");
      nav.addEventListener("mousewheel",e => {
        let v = -e.wheelDelta / 2;
        nav.scrollLeft += v;
        //阻止浏览器默认方法
        e.preventDefault();
      },false);
    },
    methods: {
      activeTag(path) {
        this.$router.push(path);
      },
      closeTag(i) {
        let domArr = document.getElementsByClassName('fadeitem');
        domArr[i].style.opacity = 0;
        setTimeout(()=>{
          if (this.viewRouterList[i].active) {
            if (this.viewRouterList[i+1]) {
              this.activeTag(this.viewRouterList[i+1].path)
            }else if (this.viewRouterList[i-1]) {
              this.activeTag(this.viewRouterList[i-1].path)
            }else{
              this.$router.push('/')
            }
          }
          this.$store.dispatch("deleteViewRouter", i);
        },300)
        
      },
      addViewRouter(view) {
        if (this.$route.name) {
          const route = this.$route;
          this.$store.dispatch("addViewRouter", route);
          console.log(this.navTagName)
        }
      }
    },
    computed: {
      viewRouterList() {
        return this.$store.state.view_router_list;
      },
      ...mapGetters(['navTagName'])
    },
    watch: {
      '$route' (to, from) {
        this.addViewRouter(to);
      }
    }
  };
</script>

<style>
.tag-scroll {
  width: 100%;
  overflow-x: scroll;
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  margin-top: -10px;
  border-bottom: 1px dashed #ccc;
}
.tagitem {
  height: 36px;
  line-height: 36px;
  padding: 0 8px;
  word-break: keep-all;
  border: 1px solid #ccc;
  font-size: 14px;
  border-radius: 3px;
}
.tagitemActived{
  height: 36px;
  line-height: 36px;
  padding: 0 8px;
  word-break: keep-all;
  border: 1px solid #ccc;
  font-size: 14px;
  border-radius: 3px;
  box-shadow: 0 0 8px #ccc;
  background: #5cadff;
  color: #fff;
}
.tagitem:hover{
  box-shadow: 0 0 8px #ccc;
  background: #5cadff;
  color: #fff;
}
.tagitem > i{
  margin-left: 4px;
}
.tagitem > i:hover,.tagitemActived > i:hover{
  cursor: pointer;
  font-size: 18px;
}
.fadeitem{
  opacity: 1;
  transition: all 0.3s;
  -webkit-transition: all 0.3s; /* Safari */
}
</style>
