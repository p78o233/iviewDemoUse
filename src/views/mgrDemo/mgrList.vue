<template>
    <div>
        <Divider>全局操作</Divider>
        <div>
            <label style="margin-right: 50px;font-size: 14px;">本机ip端口：{{ipPort}}</label>
            <label style="margin-right: 100px;font-size: 14px;">本机dubbo名称：{{dubboName}}</label>
            <Button type="error" @click="deleteThisMachine()">删除本机服务</Button>
            <Modal
                    v-model="deleteFlag"
                    title="确认是否关闭服务"
                    @on-ok="deleteMachine()"
                    @on-cancel="noDeleteMachine()">
                <p>是否确认关闭本服务</p>
            </Modal>
        </div>
        <Button @click="init()">刷新本页面</Button>
        <label style="width: 130px;display: inline-block;margin-left: 20px;">缓存刷新范围：</label>
        <Select v-model="selectData" clearable style="width: 200px;" @on-clear="clearSelect()">
            <Option value="all" :key="all">全部</Option>
            <Option value="ip" :key="ip">当前ip</Option>
            <Option value="random" :key="random">随机</Option>
        </Select>
        <Divider>业务行为</Divider>
        <div v-for="(item,index) in dataNet">
            <div class="cardDivClass">
                <p slot="title">{{item.url}}</p>
                <!--<p>{{item.paramArray}}</p>-->
                <div v-for="cItem in item.paramArray" style="display: inline-block;margin-right: 10px;">
                    <label style="width: 100px;display: inline-block;">{{cItem.comment!=""?cItem.comment:cItem.paramName}}：</label>
                    <div v-if="cItem.limit == undefined || cItem.limit == null" style="display: inline-block;">
                        <Input v-model="cItem.dataMsg" class="inputClassMgr"
                               placeholder="Enter something..."
                               clearable />
                        <InputNumber v-if="cItem.paramClz == 'int'||cItem.paramClz == 'Long'" v-model="cItem.dataMsg" active-change=true class="inputClassMgr"
                                     ></InputNumber>
                    </div>
                    <div v-else-if="cItem.limit.length == 0" style="display: inline-block;">
                        <Input v-if="cItem.paramClz == 'String'" v-model="cItem.dataMsg"
                               placeholder="Enter something..."
                               clearable class="inputClassMgr"/>
                        <Input v-if="cItem.paramClz == 'int'||cItem.paramClz == 'Long'" v-model="cItem.dataMsg"
                               placeholder="Enter something..."
                               clearable class="inputClassMgr"/>
                        <!--<InputNumber v-if="cItem.paramClz == 'int'" v-model="cItem.dataMsg" active-change=true-->
                                     <!--class="inputClassMgr"></InputNumber>-->
                    </div>
                    <div v-else style="display: inline-block;">
                        <Select v-model="cItem.dataMsg" clearable style="width: 200px;display: inline-block;">
                            <Option v-for="lim in cItem.limit" :value="lim">{{lim}}</Option>
                        </Select>
                    </div>
                </div>
                <Button type="primary" @click="submit(index)">提交</Button>
            </div>
        </div>
        <Divider>返回结果</Divider>
        <vue-json-editor v-model="jsonStr" :showBtns="true"></vue-json-editor>
    </div>
</template>

<script>
    // import {actionCallback, allAction,delApp} from '@/api/mgrDemo'
    import vueJsonEditor from 'vue-json-editor'

    export default {
        //注入vueJsonEditor组件
        components: {
            vueJsonEditor
        },
        name: "mgrDemo",
        data() {
            return {
                dataNet: {},//业务对象
                selectData: "",//刷缓存范围
                jsonStr: {},//返回值json
                idTime: "",//当前页面创建的时间
                dubboName: "",//当前dubbo名称
                ipPort: "",//当前ip端口号
                deleteFlag: false,//确认关闭提示模态框
            }
        },
        methods: {
            noDeleteMachine() {
                // 取消关闭服务按钮
                this.deleteFlag = false;
            },
            deleteMachine() {
                // 确认关闭服务按钮
                var ip_prot_arr = new Array;
                ip_prot_arr = this.ipPort.split("-")
                let ip = ip_prot_arr[0];
                let prot = ip_prot_arr[1];
                let sendData = {
                    "ip": ip,
                    "dubboPort": prot,
                    "dubboName": this.dubboName
                }
                this.api.delApp(sendData).then(res => {
                    console.log('删除服务器接口:', res)

                    this.jsonStr = res;
                })


                this.deleteFlag = false;
            },
            deleteThisMachine() {
                // 删除服务按钮点击事件
                this.deleteFlag = true;
            },
            clearSelect() {
                // 清空缓存范围下拉框
                this.selectData = ""
            },
            submit(index) {
                // 提交按钮
                // 检查数据是否已经提交完成
                if (this.selectData == undefined || this.selectData == "") {
                    this.$Message.error('请选择刷新范围');
                    return;
                }
                var sendData = this.dataNet[index];
                var ip_prot = this.ipPort;
                var ip_prot_arr = new Array;
                ip_prot_arr = ip_prot.split(":")
                var ip = ip_prot_arr[0]
                var port = ip_prot_arr[1]
                sendData.callType = this.selectData;
                sendData.ip = ip;
                sendData.port = port;
                for(let i=0;i<sendData.paramArray.length;i++){
                    sendData.paramArray[i].paramName = sendData.paramArray[i].dataMsg
                }
                this.api.actionCallback(
                    sendData
                ).then(res => {
                    console.log('行为调用:', res)
                    this.jsonStr = res;
                })
            },
            init() {
                // 初始化全部的数据
                this.selectData = "";
                this.jsonStr = {}
                // 根据dubbo名获取所有业务行为
                var arr = new Array;
                arr = this.$route.path.split("/")
                this.dubboName = arr[3];
                this.ipPort = arr[4];
                this.api.allAction({
                    "dubboName": this.dubboName
                }).then(res => {
                    console.log('根据dubbo名获取所有业务行为:', res)
                    this.dataNet = res.data;
                    for(let i=0;i<this.dataNet.length;i++){
                        for(let j=0;j<this.dataNet[i].paramArray.length;j++){
                            if(this.dataNet[i].paramArray[j].paramClz != 'int'||this.dataNet[i].paramArray[j].paramClz!= 'Long') {
                                this.dataNet[i].paramArray[j].dataMsg = ""
                            }else{
                                this.dataNet[i].paramArray[j].dataMsg = 0
                            }
                        }
                    }
                })
            },
        },
        mounted() {
            this.init();
        },
        watch: {
            '$route'(to, from) {
                //刷新参数放到这里里面去触发就可以刷新相同界面了
                this.init();
            }
        }
    }
</script>

<style>
    .cardDivClass {
        margin-bottom: 10px;
        border: 1px solid gainsboro;
        padding: 10px;
    }

    /*json控件样式*/
    .json-save-btn {
        visibility: hidden !important;
    }
    /*input输入框样式*/
    .inputClassMgr{
        width: 200px;
        display: inline-block;
        margin-bottom: 5px;
    }
</style>
