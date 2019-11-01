import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            // redirect: '/project/projectlist',
            children: [
                {
                    path: '/inner/member',
                    name: 'member',
                    component: () => import('./views/innerManager/member'),
                    meta: {
                        title: "人员管理"
                    }
                },
                {
                    path: '/inner/brand',
                    name: 'brand',
                    component: () => import('./views/innerManager/brand'),
                    meta: {
                        title: "品牌管理"
                    }
                },
                {
                    path: '/inner/brand/user',
                    name: 'branduser',
                    component: () => import('./views/innerManager/areaUser'),
                    meta: {
                        title: "品牌用户管理"
                    }
                },
                {
                    path: '/inner/mobility',
                    name: 'mobility',
                    component: () => import('./views/innerManager/mobility'),
                    meta: {
                        title: "机动人员管理"
                    }
                },
                {
                    path: '/inner/toolscate',
                    name: 'toolsCate',
                    component: () => import('./views/innerManager/toolsCate'),
                    meta: {
                        title: "工具分类管理"
                    }
                },
                {
                    path: '/inner/tools',
                    name: 'tools',
                    component: () => import('./views/innerManager/tools'),
                    meta: {
                        title: "工具租赁管理"
                    }
                },
                {
                    path: '/inner/shopkeeper',
                    name: 'shopkeeper',
                    component: () => import('./views/innerManager/shopkeeper'),
                    meta: {
                        title: "店主管理"
                    }
                },
                {
                    path: '/inner/worktype',
                    name: 'worktype',
                    component: () => import('./views/innerManager/workType'),
                    meta: {
                        title: "工种管理"
                    }
                },
                {
                    path: '/other/about',
                    name: 'about',
                    component: () => import('./views/other/about'),
                    meta: {
                        title: "关于我们"
                    }
                },
                {
                    path: '/other/share',
                    name: 'share',
                    component: () => import('./views/other/share'),
                    meta: {
                        title: "共享资料"
                    }
                },
                {
                    path: '/other/startpage',
                    name: 'startpage',
                    component: () => import('./views/other/startPage'),
                    meta: {
                        title: "启动页设置"
                    }
                },
                {
                    path: '/other/log',
                    name: 'log',
                    component: () => import('./views/other/log'),
                    meta: {
                        title: "操作日志"
                    }
                },
                {
                    path: '/statistics/statistics',
                    name: 'statistics',
                    component: () => import('./views/statistics/statistics'),
                    meta: {
                        title: "统计报表"
                    }
                },
                {
                    path: '/depart/department',
                    name: 'department',
                    component: () => import('./views/depart/department'),
                    meta: {
                        title: "部门列表"
                    }
                },
                {
                    path: '/depart/job',
                    name: 'job',
                    component: () => import('./views/depart/job'),
                    meta: {
                        title: "岗位列表"
                    }
                },
                {
                    path: '/project/projectlist',
                    name: 'projectList',
                    component: () => import('./views/project/projectList'),
                    meta: {
                        title: "工程列表"
                    }
                },
                {
                    path: '/project/projectdetail',
                    name: 'projectDetail',
                    component: () => import('./views/project/projectDetail'),
                    meta: {
                        title: "工程详情"
                    }
                },
                {
                    path: '/project/projectevaluation',
                    name: 'projectEvaluation',
                    component: () => import('./views/project/projectEvaluation'),
                    meta: {
                        title: "项目评价"
                    }
                },
                {
                    path: '/project/membermap',
                    name: 'memberMap',
                    component: () => import('./views/project/memberMap'),
                    meta: {
                        title: "人员定位"
                    }
                },
                {
                    path: '/project/projectmap',
                    name: 'projectMap',
                    component: () => import('./views/project/projectMap'),
                    meta: {
                        title: "地图模式"
                    }
                },
                {
                    path: '/usergroup/rules',
                    name: 'rules',
                    component: () => import('./views/usergroup/rules'),
                    meta: {
                        title: "权限列表"
                    }
                },
                {
                    path: '/usergroup/usergrouplist',
                    name: 'usergrouplist',
                    component: () => import('./views/usergroup/userGroupList'),
                    meta: {
                        title: "用户权限群组"
                    }
                },
                {
                    path: '/usergroup/setgroup',
                    name: 'setgroup',
                    component: () => import('./views/usergroup/setGroup'),
                    meta: {
                        title: "用户权限设置"
                    }
                },
                {
                    path: '/mgrDemo/mgrList/:dubboName/:ipPort',
                    // name: 'mgrList',
                    component: () => import('./views/mgrDemo/mgrList'),
                    meta: {
                        title: "通用功能"
                    }
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./views/user/login')
        }
    ]
})
