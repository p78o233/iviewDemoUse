<template>
  <div id="app">
  	<Header v-show='header_show'></Header>
    <router-view/>
  </div>
</template>

<script>
	import Header from './components/header/header';
	export default{
		components:{
			Header
		},
    data(){
      return{
        header_show:true
      }
    },
    watch:{
      $route:function(to,from){
        (to.path === '/login') ? this.header_show = false : this.header_show = true;
      }
    }
	}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
}
</style>
