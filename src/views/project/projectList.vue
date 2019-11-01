<template>
    <div class="container">
        <div class="btn-nav">
            <Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
            <p class="space"></p>
            <Button type="primary" icon="md-add" @click="showPop()">新增项目</Button>
            <p class="space"></p>
            <Input v-model="searchName">
            <Select v-model="searchType" slot="prepend" style="width: 80px">
                <Option value="storeName">店铺名称</Option>
                <Option value="code">项目编号</Option>
                <Option value="brandId">品牌ID</Option>
                <Option value="levelId">等级ID</Option>
                <Option value="province">省</Option>
                <Option value="city">市</Option>
                <Option value="area">区</Option>
            </Select>
            <Button slot="append" icon="ios-search" @click="searchByType()"></Button>
            </Input>

        </div>
        <div class="table-container">
            <Spin size="large" fix v-if="spin_show"></Spin>
            <div class="table-scroll">
                <tableComp :tableData="table_data" @editItem="editItem" @deleteItem="deleteItem" @setItem="setItem"
                           @jumpUser="jumpUser"></tableComp>
            </div>
            <p class="space">&nbsp;</p>
            <!-- <div class="totalBox">
                <p class="totalNum">总条数：100 条</p> -->
            <Page :total="totalPage" @on-change="changePage"></Page>
            <!-- </div> -->
        </div>

        <!-- 新建项目弹窗 -->
        <transition name="bounce">
            <div class="pop-container" v-show="window_show">
                <div class="pop-content">
                    <Spin size="large" fix v-if="spin_show"></Spin>
                    <span class="close-btn" @click="closePop()">×</span>
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="店铺名称">
                            <Input v-model="formItem.storeName" placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="店主ID">
                            <Select
                                    v-model="formItem.storeUserId"
                                    filterable
                                    remote
                                    :remote-method="loadStore"
                                    :loading="loading">
                                <Option v-for="(store, index) in storeList" :value="store.id" :key="index">
                                    {{store.nickname}}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="品牌专员ID">
                            <!-- <Input v-model="formItem.commissionerId" placeholder="请输入..."></Input> -->
                            <Select v-model="brandSelectedCopy" style="width:50%" @on-change='loadUser'>
                                <Option v-for="brand in brandList" :value="brand.id" :key="brand.id">{{ brand.name }}
                                </Option>
                            </Select>
                            <Select v-model="formItem.commissionerId" style="width:50%">
                                <Option v-for="user in userList" :value="user.id" :key="user.id">{{ user.nickname }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择等级">
                            <Select v-model="brandSelected" style="width:50%" @on-change='loadLevel'>
                                <Option v-for="brand in brandList" :value="brand.id" :key="brand.id">{{ brand.name }}
                                </Option>
                            </Select>
                            <Select v-model="formItem.levelId" style="width:50%">
                                <Option v-for="level in levelList" :value="level.id" :key="level.id">{{ level.name }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="工程编号">
                            <Input v-model="formItem.code" placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="测量">
                            <RadioGroup v-model="formItem.needMeasure">
                                <Radio label="1">需要</Radio>
                                <Radio label="0">不需要</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem>
                            <Button @click="openMap()" type='success'>
                                <Icon type="md-paper-plane"/>
                                打开地图
                            </Button>
                        </FormItem>
                        <FormItem label="经度">
                            <Input v-model="formItem.longitude" readonly placeholder="地图定位获取"></Input>
                        </FormItem>
                        <FormItem label="纬度">
                            <Input v-model="formItem.latitude" readonly placeholder="地图定位获取"></Input>
                        </FormItem>
                        <FormItem label="省市区">
                            <Input v-model="formItem.province" readonly placeholder="地图定位获取"></Input>
                            <Input v-model="formItem.city" readonly placeholder="地图定位获取"></Input>
                            <Input v-model="formItem.area" readonly placeholder="地图定位获取"></Input>
                            <Input v-model="formItem.addressDetail" type="textarea" placeholder="详细地址"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="confirm()">
                                <Icon type="md-checkmark"/>
                                提交
                            </Button>
                            <Button style="margin-left: 8px" @click="closePop()">
                                <Icon type="md-close"/>
                                取消
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </transition>

        <!-- 地图组件弹窗 -->
        <transition name="bounce">
            <div class="pop-container" v-show="map_show">
                <div class="pop-content">
                    <span class="close-btn" @click="closeMap()">×</span>
                    <mapPoiPicker @confirmPOS="confirmPOS"></mapPoiPicker>
                </div>
            </div>
        </transition>


    </div>
</template>

<script>
    import tableComp from "../../components/table/tableComp";
    import mapPoiPicker from "../../components/mapPoiPicker";
    import {timestampToTime} from '../../common/common';

    export default {
        data() {
            return {
                table_data: {
                    t_head: [
                        {title: "ID", key: "id"},
                        {title: "店铺名称", key: "storeName"},
                        {title: "项目编号", key: "code"},
                        {title: "品牌", key: "brandName"},
                        {title: "级别", key: "levelName"},
                        {title: "省", key: "province"},
                        {title: "市", key: "city"},
                        {title: "区", key: "area"},
                        {title: "创建时间", key: "timeF"}
                    ],
                    t_body: [],
                    isSet: '工程节点',
                    isUser: '项目评价'
                },
                window_show: false,
                spin_show: false,
                map_show: false,
                formItem: {
                    storeName: "",
                    storeUserId: "",
                    levelId: "",
                    code: "",
                    longitude: "",
                    latitude: "",
                    commissionerId: "",
                    province: "",
                    city: "",
                    area: "",
                    addressDetail: "",
                    needMeasure: "1",
                },
                searchName: "",
                currentPage: 1,
                totalPage: 0,
                edit_status: "add",

                loading: false,
                brandSelected: "",
                brandSelectedCopy: "",
                brandList: [],
                levelList: [],
                userList: [],
                storeList: [],

                searchType: 'storeName',
                searchObject: {
                    page: this.currentPage
                },

                mapObject: null, //地图对象
            };
        },
        components: {
            tableComp,
            mapPoiPicker
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                this.spin_show = false;
                this.api.project(this.searchObject)
                    .then(res => {
                        console.log(res);
                        this.$Message.info(res.msg);
                        if (res.code == 1) {
                            this.table_data.t_body = res.data.list;
                            this.totalPage = res.data.totalPage * 10;
                            for (let i of this.table_data.t_body) {
                                this.$set(i, 'brandName', i.brand.name);
                                this.$set(i, 'levelName', i.level.name);
                                this.$set(i, 'timeF', timestampToTime(i.createtime));
                            }
                        }
                    });

                this.api.project_add_get().then(res => {
                    this.brandList = res.data.brand;
                    this.spin_show = false;
                });


            },
            //通过品牌ID加载对应等级列表
            loadLevel() {
                this.formItem.levelId = '';
                for (let i of this.brandList) {
                    if (i.id == this.brandSelected) {
                        this.levelList = i.level;
                        break;
                    }
                }
            },
            //通过品牌ID加载专员
            loadUser() {
                this.formItem.commissionerId = '';
                for (let i of this.brandList) {
                    if (i.id == this.brandSelectedCopy) {
                        this.userList = i.user;
                        break;
                    }
                }
            },
            loadStore() {
                this.api.get_brand_user({
                    name: this.formItem.storeUserId
                }).then(res => {
                    console.log(res)
                    this.storeList = res.data;
                })
            },
            //请空搜索条件并刷新
            refresh() {
                this.currentPage = 1;
                this.searchName = '';
                this.searchType = 'storeName';
                this.searchObject = {page: this.currentPage};
                this.initData();
            },
            //按searchType类型搜索
            searchByType() {
                this.currentPage = 1;
                this.searchObject = {page: this.currentPage};
                this.searchObject[this.searchType] = this.searchName;
                this.initData();
            },
            showPop() {
                this.window_show = true;
            },
            confirm() {
                console.log(this.formItem)
                this.spin_show = false;
                if (this.edit_status == "add") {
                    this.api.project_add(this.formItem).then(res => {
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
                    console.log(this.formItem);
                    this.api.project_edit(this.formItem).then(res => {
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
                    storeName: "",
                    storeUserId: "",
                    levelId: "",
                    code: "",
                    longitude: "",
                    latitude: "",
                    commissionerId: "",
                    province: "",
                    city: "",
                    area: "",
                    addressDetail: "",
                    needMeasure: "1"
                };
            },
            closeMap() {
                this.map_show = false;
            },
            //编辑
            editItem(item) {
                console.log(item);
                // 编辑的时候需要请求详情接口
                this.spin_show = false;
                this.api.project_detail({id: item.id}).then(res => {
                    console.log(res);
                    this.spin_show = false;
                    if (res.code == 1) {
                        let data = res.data;
                        let str = res.data.projectPoint;
                        let LngLat = str.slice(6, str.length - 1).split(' ');
                        this.formItem.storeUserId = data.store_user.nickname;
                        this.loadStore();
                        this.brandSelectedCopy = data.commissioner_user.brandId;
                        this.loadUser();
                        this.brandSelected = data.level.brandId;
                        this.loadLevel();
                        this.formItem = {
                            id: item.id,
                            storeName: data.storeName,
                            storeUserId: data.store_user.id,
                            levelId: data.level.id,
                            code: data.code,
                            longitude: LngLat[0],
                            latitude: LngLat[1],
                            commissionerId: data.commissioner_user.id,
                            province: data.province,
                            city: data.city,
                            area: data.area,
                            addressDetail: data.addressDetail,
                            needMeasure: data.needMeasure
                        }
                        console.log(this.formItem)
                    } else {
                        this.$Message.error(res.msg);
                    }
                    this.edit_status = "edit";
                    this.window_show = true;
                })
            },
            //查看工程节点
            setItem(item) {
                console.log(item)
                this.$router.push('/project/projectdetail');
                sessionStorage.setItem('projectId', item.id);
            },
            //查看评论
            jumpUser(item) {
                this.$router.push('/project/projectevaluation?projectId=' + item.id);
            },
            deleteItem(item) {
                console.log(item);
                this.$Modal.confirm({
                    title: "警告",
                    content: "<p>确定删除该项?</p>",
                    onOk: () => {
                        this.spin_show = false;
                        this.api.project_del({id: item.id}).then(res => {
                            console.log(res);
                            this.spin_show = false;
                            this.$Message.info(res.msg);
                            if (res.code == 1) {
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
                this.searchObject.page = page;
                this.initData();
            },
            openMap() {
                this.map_show = true;
            },
            //确定选取位置
            confirmPOS(item) {
                console.log(item);
                this.map_show = false;
                this.formItem.latitude = item.lat;
                this.formItem.longitude = item.lng;
                this.formItem.province = item.address.province;
                this.formItem.city = item.address.city;
                this.formItem.area = item.address.district;
            }
        }
    };
</script>

<style scoped>
    #mapCon {
        height: 60vh;
    }
</style>

