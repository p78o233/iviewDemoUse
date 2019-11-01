<template>
    <div class="container-home">
        <div class="sidebar">
            <Menu>
                <!--<Submenu name="1">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="ios-home"/>-->
                        <!--内部管理-->
                    <!--</template>-->
                    <!--<MenuItem name="1-1" @click.native="routeTo('innerManager',0)">人员管理</MenuItem>-->
                    <!--<MenuItem name="1-2" @click.native="routeTo('innerManager',1)">品牌管理</MenuItem>-->
                    <!--<MenuItem name="1-3" @click.native="routeTo('innerManager',2)">店主管理</MenuItem>-->
                    <!--<MenuItem name="1-4" @click.native="routeTo('innerManager',3)">机动人员管理</MenuItem>-->
                    <!--<MenuItem name="1-5" @click.native="routeTo('innerManager',4)">工种管理</MenuItem>-->
                    <!--<MenuItem name="1-6" @click.native="routeTo('innerManager',5)">工具分类管理</MenuItem>-->
                    <!--<MenuItem name="1-7" @click.native="routeTo('innerManager',6)">工具租赁管理</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="2">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-clipboard"/>-->
                        <!--工程管理-->
                    <!--</template>-->
                    <!--<MenuItem name="2-1" @click.native="routeTo('project',0)">人员定位</MenuItem>-->
                    <!--<MenuItem name="2-2" @click.native="routeTo('project',1)">地图模式</MenuItem>-->
                    <!--<MenuItem name="2-3" @click.native="routeTo('project',2)">工程列表</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="3">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-people"/>-->
                        <!--部门管理-->
                    <!--</template>-->
                    <!--<MenuItem name="3-1" @click.native="routeTo('depart',0)">部门列表</MenuItem>-->
                    <!--<MenuItem name="3-2" @click.native="routeTo('depart',1)">岗位列表</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="4">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="ios-stats"/>-->
                        <!--统计模块-->
                    <!--</template>-->
                    <!--<MenuItem name="4-1" @click.native="routeTo('statistics',0)">统计报表</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="7">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-git-network"/>-->
                        <!--资源共享-->
                    <!--</template>-->
                    <!--<MenuItem name="7-1" @click.native="routeTo('resource',0)">共享资料</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="5">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-apps"/>-->
                        <!--其他配置-->
                    <!--</template>-->
                    <!--<MenuItem name="5-1" @click.native="routeTo('other',0)">启动页设置</MenuItem>-->
                    <!--<MenuItem name="5-3" @click.native="routeTo('other',1)">关于我们</MenuItem>-->
                <!--</Submenu>-->
                <!--<Submenu name="6">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-unlock"/>-->
                        <!--权限管理-->
                    <!--</template>-->
                    <!--<MenuItem name="6-1" @click.native="routeTo('usergroup',0)">权限列表</MenuItem>-->
                    <!--<MenuItem name="6-2" @click.native="routeTo('usergroup',1)">用户权限群组</MenuItem>-->
                    <!--<MenuItem name="6-3" @click.native="routeTo('usergroup',2)">用户权限设置</MenuItem>-->
                <!--</Submenu>-->
                <Submenu name="11">
                    <template slot="title">
                        <Icon type="md-unlock"/>
                        通用功能
                    </template>
                    <MenuItem v-for="(item,index) in allDubboMenu" style="padding-left: 0px;" :key = "index" :name="index">
                        <Submenu >
                            <template slot="title">
                                <Icon type="md-unlock"/>
                                {{item.name}}
                            </template>
                            <MenuItem v-for="it in item.data" @click.native="routeToMgr('mgrgroup',0,item.name,it.ip_port)">{{it.ip_port}}</MenuItem>
                        </Submenu>
                    </MenuItem>
                </Submenu>
                <!--<Submenu name="8">-->
                    <!--<template slot="title">-->
                        <!--<Icon type="md-paper"/>-->
                        <!--操作日志-->
                    <!--</template>-->
                    <!--<MenuItem name="8-1" @click.native="routeTo('other',2)">节点日志</MenuItem>-->
                <!--</Submenu>-->
            </Menu>
        </div>
        <div class="content">
            <tagNav/>
            <keep-alive> <!-- :include="navTagName" -->
                <router-view v-if="!routeKeep"></router-view>
            </keep-alive>
            <router-view v-if="routeKeep"></router-view>
        </div>
    </div>
</template>

<script>
    import tableComp from "../components/table/tableComp";
    import tagNav from "../components/tagNav";

    export default {
        name: "home",
        data() {
            return {
                pathList: {
                    innerManager: [
                        "/inner/member",
                        "/inner/brand",
                        "/inner/shopkeeper",
                        "/inner/mobility",
                        "/inner/worktype",
                        "/inner/toolscate",
                        "/inner/tools"
                    ],
                    other: ["/other/startpage", "/other/about", "/other/log"],
                    resource: ["/other/share"],
                    statistics: ["/statistics/statistics"],
                    depart: ["/depart/department", "/depart/job"],
                    project: [
                        "/project/membermap",
                        "/project/projectmap",
                        "/project/projectlist",
                        "/project/projectevaluation"
                    ],
                    usergroup: [
                        "/usergroup/rules",
                        "/usergroup/usergrouplist",
                        "/usergroup/setgroup"
                    ],
                    mgrgroup:[
                        "/mgrDemo/mgrList"
                    ]
                },
                allDubboMenu:[]
            };
        },
        components: {
            tableComp,
            tagNav
        },
        computed: {
            viewRouterList() {
                return this.$store.state.view_router_list;
            },
            // ...mapGetters(['navTagName'])
            routeKeep() {
                if (this.$route.name === 'branduser' || this.$route.name === 'projectDetail' || this.$route.name === 'projectEvaluation') {
                    return true;
                }
            }
        },
        methods: {
            routeTo(key, index) {
                this.$router.push(this.pathList[key][index]);
            },
            routeToMgr(key, index,dubboName,ipPort) {
                this.$router.push(this.pathList[key][index]+"/"+dubboName+"/"+ipPort);
            },
            init(){
                this.api.getAllDubbo({

                }).then(res =>{
                    console.log('all',res);
                    this.allDubboMenu  = res.data.items;
                })
            }
        },
        mounted() {
            this.init();
        },
    };
</script>

<style lang="less" scoped>
    .container-home {
        display: flex;
        min-height: 90vh;
        .sidebar {
            border-right: 1px solid #cdcdcd;
            box-shadow: 1px 1px 8px #bdbdbd;
            max-height: 100%;
            overflow-x: hidden;
            padding-right: 6px;
            overflow-y: scroll;
            height: 90vh;
        }
        .content {
            width: 86%;
            height: 90vh;
            margin: 0 20px;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 6px;
        }
        .content:hover {
            box-shadow: 1px 1px 8px #bdbdbd;
            transition: all 0.2s ease-in-out;
        }
        .ivu-tabs-tabpane {
            height: 80vh;
        }
    }
</style>
