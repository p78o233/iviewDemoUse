import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import {findIndex} from  './utils';
export default new Vuex.Store({
  state: {
    user_name: localStorage.getItem('username'),
    view_router_list: [
      // {
      //   name:'projectList',
      //   path:'/project/projectlist',
      //   title:'工程列表',
      //   active:true
      // }
    ],
    message_unread:0
  },
  getters:{
    navTagName(state){
      return state.view_router_list.map((item) => {
        return item.name;
      })
    }
  },
  mutations: {
    //登录缓存
    LOGIN(state, user) {
      state.user_name = user.username;
      localStorage.setItem('username', user.username);
      localStorage.setItem('userid', user.id);
    },
    //动态缓存路由
    ADD_VIEW_ROUTER(state, view) {
      let index = findIndex(state.view_router_list,'path',view.path);
      for(let v of state.view_router_list){
        v.active = false;
      }
      if(index === -1){
        state.view_router_list.push({
          name:view.name,
          path:view.path,
          title:view.meta.title || 'no-title',
          active:true
        })
      }else{
        state.view_router_list[index].active = true;
      }
    },
    //删除路由
    DELETE_VIEW_ROUTER(state, index) {
      state.view_router_list.splice(index, 1);
    },
    //缓存未读信息条数
    CACHE_UNREAD(state,num){
      state.message_unread = num;
    }
  },
  actions: {
    addViewRouter({ commit }, view) {
      commit('ADD_VIEW_ROUTER', view);
    },
    deleteViewRouter({ commit }, view) {
      commit('DELETE_VIEW_ROUTER', view);
    },
    cache_unread({ commit },num){
      commit('CACHE_UNREAD',num);
    }
  }
})
