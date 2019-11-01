<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="initData()">刷新</Button>
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<div>
					<p class="label-title">店主信息</p>
					<Table :columns="rule1" :data="tableData1"></Table>
					<p class="space">&nbsp;</p>
				</div>
				<div>
					<p class="label-title">品牌信息</p>
					<Table :columns="rule2" :data="tableData2"></Table>
					<p class="space">&nbsp;</p>
				</div>
				<div>
					<p class="label-title">跟进人员</p>
					<Table :columns="rule3" :data="tableData3"></Table>
					<p class="space">&nbsp;</p>
				</div>
				<div class="step-box">
					<p class="label-title">工程进度</p>
					<Steps :current="current">
						<Step v-for="(item,index) in stepList" :key="index" :title="item.name" @click.native="showList(item,index,2)">
							<p class="space" style="margin-bottom: 5px;">&nbsp;</p>
						</Step>
					</Steps>
				</div>
				<div class="step-child-box">
					<label style="color: red;"><Icon type="md-fastforward" />{{projectTitle}}</label>
					<p class="space">&nbsp;</p>
					<Steps :current="current_child">
						<Step v-for="(item2,index2) in stepChildren" :key="index2" :title="item2.name" @click.native.stop="showChild(item2,index2)">
							<span>操作</span>
						</Step>
					</Steps>
				</div>
			</div>
		</div>

		<!-- 人员弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="member_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<Form :label-width="80">
						<FormItem label="分配人员">
							<Select v-model="designatePersonnel">
								<Option :value="item.id" v-for='item in memberList' :key="item.id">{{item.nickname}}</Option>
							</Select>
						</FormItem>
						<FormItem>
							<Button type="primary" @click="confirm(1)"><Icon type="md-checkmark" />提交</Button>
							<Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		</transition>

		<!-- 施工日志弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="constructionLog_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<span class="close-btn" @click="closePop()">×</span>
					<div class="pop-item" v-for='(item,i1) in logList' :key="i1">
						<p style="width:100%;color: #aaa;">{{item.timeF}}</p>
						<div class="image-box" v-for="(item,i2) in item.img" :key="i2">
							<img :src="item" class="avatar-img" @click='openImg(item)'>
						</div>
						<div class="link-item" v-for='(item) in item.file' :key='item.link'>
							<a :href="item.link" target="view_window">{{item.link}}</a>
						</div>
						<p v-if='item.img.length == 0 && item.file.length == 0' style="width:100%;color: #aaa;text-align: center;">没有该日期的记录</p>
						<p style="border-bottom: 1px dashed #ccc;width:100%;">&nbsp;</p>
					</div>
					<div style="display: flex;justify-content: center;">
						<Button type="warning" @click="addLog">
							<Icon type="md-add" />添加日志
						</Button>
						<p class="space"></p>
						<Button @click="closePop()">
							<Icon type="md-close"/>关闭
						</Button>
					</div>
				</div>
			</div>
		</transition>

		<!-- 上传资源弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="resource_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="img_show"></Spin>
					<label>上传图片</label>
					<div class="pop-item">
						<div class="image-box" v-for="(item,index) in imageList" :key="index">
							<span @click="deleteFile(1,index)">×</span>
							<img :src="item" class="avatar-img" @click='openImg(item)'>
						</div>
						<div class="avatar" @click='tabInput(1)'>
							<Icon type="md-images" />
						</div>
					</div>
					<label v-if="isLog">上传文件</label>
					<div class="pop-item" v-if="isLog">
						<div class="link-item" v-for='(item,index) in fileList' :key='index'>
							<a :href="item.link" target="view_window">{{item.link}}</a>
							<span @click='deleteFile(2,index)'>×</span>
						</div>
						<Button icon="md-cloud-upload" type="dashed" style='margin: 10px;' @click='tabInput(2)'>选择文件</Button>
					</div>
					<div>
						<Button type="primary" @click="confirm(2)"><Icon type="md-checkmark" />提交</Button>
						<Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
					</div>
					<input type="file" id="uploadInput" style="display: none;" @change="uploadFile">
				</div>
			</div>
		</transition>

		<!-- 审核弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="review_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<label v-if='label_show'>是否结束本流程</label>
					<label v-if='!label_show'>查看图片</label>
					<div class="pop-item">
						<div class="image-box" v-for="(item,index) in imageList" :key="index">
							<img :src="item" class="avatar-img" @click='openImg(item)'>
						</div>
					</div>
					<label v-if='!label_show'>查看文件</label>
					<div class="pop-item">
						<div class="link-item" v-for='(item,index) in fileList' :key='index'>
							<a :href="item.link" target="view_window">{{item.link}}</a>
						</div>
					</div>
					<div>
						<Button type="primary" @click="confirm(3)"><Icon type="md-checkmark" />提交</Button>
						<Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
					</div>
				</div>
			</div>
		</transition>

		<!-- 可以上传资源又可以分配人员弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="resource_mem_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="img_show"></Spin>
					<label>分配人员</label>
					<div class="pop-item">
						<Select v-model="designatePersonnel">
							<Option :value="item.id" v-for='item in memberList' :key="item.id">{{item.nickname}}</Option>
						</Select>
					</div>
					<label>上传图片</label>
					<div class="pop-item">
						<div class="image-box" v-for="(item,index) in imageList" :key="index">
							<span @click="deleteFile(1,index)">×</span>
							<img :src="item" class="avatar-img" @click='openImg(item)'>
						</div>
						<div class="avatar" @click='tabInput(1)'>
							<Icon type="md-images" />
						</div>
					</div>
					<label>上传文件</label>
					<div class="pop-item">
						<div class="link-item" v-for='(item,index) in fileList' :key='index'>
							<a :href="item.link" target="view_window">{{item.link}}</a>
							<span @click='deleteFile(2,index)'>×</span>
						</div>
						<Button icon="md-cloud-upload" type="dashed" style='margin: 10px;' @click='tabInput(2)'>选择文件</Button>
					</div>
					<div>
						<Button type="primary" @click="confirm(4)"><Icon type="md-checkmark" />提交</Button>
						<Button style="margin-left: 8px" @click="closePop()"><Icon type="md-close" />取消</Button>
					</div>
				</div>
			</div>
		</transition>

		<!-- 物流信息弹窗 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="logistics_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<span class="close-btn" @click="closePop()">×</span>
					<Tabs :value='activedTab' closable type="card" @on-tab-remove="handleTabRemove">
						<TabPane v-for="(item,index) in formItem" :key="index" :label="'订单'+(index+1)" :name="index+''">
							<Form :model="item" :label-width="80">
								<FormItem label="货物名称">
									<Input v-model="item.name" placeholder="请输入..." :readonly="dataItem.ruleId == '25'"></Input>
								</FormItem>
								<FormItem label="物流公司">
									<Input v-model="item.company" placeholder="请输入..." :readonly="dataItem.ruleId == '25'"></Input>
								</FormItem>
								<FormItem label="物流电话">
									<Input v-model="item.phone" placeholder="请输入..." :readonly="dataItem.ruleId == '25'"></Input>
								</FormItem>
								<FormItem label="单号">
									<Input v-model="item.orderNo" placeholder="请输入..." :readonly="dataItem.ruleId == '25'"></Input>
								</FormItem>
								<FormItem label="发货时间">
									<Input v-model="item.deliveryTime" placeholder="请输入..." :readonly="dataItem.ruleId == '25'"></Input>
								</FormItem>
								<FormItem label="收货时间" v-if='dataItem.ruleId == "25"'>
									<Input v-model="item.arrivalTime" placeholder="请输入..."></Input>
								</FormItem>
								<div v-if='dataItem.ruleId == "25"'>
									<p v-if="item.status === '1'" style="color: red;">订单已完成</p>
									<FormItem v-if="item.status === '0'">
										<Button type="primary" @click="checkOrder(item,index)">
											<Icon type="md-checkmark-circle-outline" />订单已收货
										</Button>
									</FormItem>
								</div>
							</Form>
						</TabPane>
					</Tabs>
					<div style="display: flex;justify-content: center;">
						<Button type="warning" @click="addForm" v-if='dataItem.ruleId == "24"'>
							<Icon type="md-add" />添加订单
						</Button>
						<p class="space"></p>
						<Button type="primary" @click="confirm(5)">
							<Icon type="md-checkmark"/>提交
						</Button>
						<p class="space"></p>
						<Button @click="closePop()">
							<Icon type="md-close"/>关闭
						</Button>
					</div>
				</div>
			</div>
		</transition>
		
		<!-- 图片窗口 -->
		<div class="pop-container" @click="popimg_show=false" v-show="popimg_show">
			<div class="pop-content">
				<span class="close-btn" @click="popimg_show=false">×</span>
				<img class="pop-img" :src="popImg">
			</div>
		</div>

	</div>
</template>

<script>
	import {timestampToTime,timestampToTimeUpload} from '../../common/common';
	export default{
		data(){
			return{
				tableData1:[],
				tableData2:[],
				tableData3:[],
				stepList:[],
				stepChildren:[],
				spin_show:false,
				img_show:false,
				popimg_show:false,
				member_show:false,
				resource_show:false,
				review_show:false,
				resource_mem_show:false,
				logistics_show:false,
				review_transfer_show:false,
				constructionLog_show:false,
				isLog:true,
				current:0,
				current_child:0,
				rule1:[
				{
					title: '店名',
					key: 'storeName'
				},
				{
					title: '店主姓名',
					key: 'storeUser'
				},
				{
					title: '编号',
					key: 'code'
				},
				{
					title: '联系电话',
					key: 'mobile'
				},
				{
					title: '详细地址',
					key: 'address'
				}
				],
				rule2:[
				{
					title: '品牌名称',
					key: 'brandName'
				},
				{
					title: '装修专员',
					key: 'commissionerUser'
				},
				{
					title: '联系电话',
					key: 'mobile'
				}
				],
				rule3:[
				{
					title: '岗位',
					key: 'positionName'
				},
				{
					title: '昵称',
					key: 'nickname'
				},
				{
					title: '联系电话',
					key: 'mobile'
				}
				],

				memberList:[], //人员列表
				projectId:'',
				ruleId:'',
				isfinish:'1',
				designatePersonnel:'',

				imageList:[],
				fileList:[],
				uploadType:0,
				projectTitle:'',

				logList:[],
				
				constructionLog:[],
				packagingLog:[],


				dataItem:{}, //要上传的数据对象
				nextStepIndex:0,  //当前父节点下一节点的下标
				
				//物流信息
				formItem:[
				{
					"name":"",
					"company":"",
					"phone":"",
					"orderNo":"",
					"deliveryTime":"",
					"arrivalTime":"",
					"status":"0" //0未完成,1已完成
				}
				],
				activedTab:'0',

				popImg:'',
				label_show:false,
			}
		},
		mounted(){
			this.initData();
		},
		methods:{
			initData(){
				let that = this;
				this.spin_show = true;
				//获取项目详情
				this.api.project_detail({id:sessionStorage.getItem('projectId')}).then(res => {
					this.spin_show = false;
					console.log(res);
					this.tableData1 = [];
					this.tableData2 = [];
					this.tableData3 = [];
					if (res.code == 1) {
						//封装表格数据
						let data = res.data;
						this.constructionLog = data.constructionLog;
						this.packagingLog = data.packagingLog;

						for(let i of this.constructionLog){
							this.$set(i,'timeF',timestampToTime(i.createtime));
						}
						for(let i of this.packagingLog){
							this.$set(i,'timeF',timestampToTime(i.createtime));
						}

						let obj1 = {};
						obj1.storeName = data.storeName;
						obj1.storeUser = data.store_user.nickname;
						obj1.code = data.code;
						obj1.mobile = data.store_user.mobile;
						obj1.address = `${data.province}${data.city}${data.area}${data.addressDetail}`;
						this.tableData1.push(obj1);

						let obj2 = {};
						obj2.brandName = data.brand.name;
						obj2.commissionerUser = data.commissioner_user.nickname;
						obj2.mobile = data.commissioner_user.mobile;
						this.tableData2.push(obj2);

						for(let i of data.userList){
							this.tableData3.push(i.user);
						}

						this.stepList = data.process;
						this.stepList.forEach((v,i) =>{
							that.$set(v,'showSec',false);
							if (v.canClick === true) {
								that.current = i;
								if (v.id == 30) {
									that.current++;
									that.projectTitle = '项目已完成'
								}
							}
						})
						//初始化数据时候刷新当前进度位置,
						if (this.current<=this.stepList.length-1) {
							this.showList(this.stepList[this.current],this.current,1);
						}
					}else{
						this.$Message.error(res.msg);
					}
				})
			},
			//显示单个详细进度,先全部设置隐藏,再把对应的item显示出来
			showList(item,i,type){
				console.log(item)
				this.nextStepIndex = i;
				if (!item.canClick) {
					this.$Message.info('工程进度尚未进行到该节点');
					return;
				}
				//如果是id为"16"或者"23"并且>>已完成的话,这里需要直接跳到下一父节点
				if (type == 1) {
					let step = this.stepList[i].rules;
					if ((item.id === 16 || item.id === 23) && step[step.length-1].process_log) {
						if (step[step.length-1].process_log.isfinish == '1') {
							item = this.stepList[this.current+1];
							this.current += 1;
						}
					}
					// if (item.id === 23 && step[step.length-1].process_log) {
					// 	if (step[step.length-1].process_log.isfinish == '1') {
					// 		item = this.stepList[this.current+1];
					// 		this.current += 1;
					// 	}
					// }
				}
				this.projectTitle = item.name;
				this.stepChildren = item.rules;
				this.current_child = -1;
				let len = this.stepChildren.length;
				this.stepChildren.forEach((v,i) => {
					if (v.process_log !== null) {
						this.current_child = i;
						if (v.process_log.isfinish == '1') {
							this.current_child = i + 1;
						}
					}
				})
				//判断如果当前子列表的最后一项的进度为结束,则所有进度打钩
				if (this.current_child === len-1) {
					if (this.stepChildren[this.current_child].process_log && this.stepChildren[this.current_child].process_log.isfinish == '1') {
						this.current_child += 1;
					}
				}
			},
			showChild(item,i){
				console.log(item)
				// this.nextStepIndex = i+1;
				// console.log(this.nextStepIndex)
				this.dataItem.ruleId = item.id;
				this.dataItem.projectId = sessionStorage.getItem('projectId');
				switch (item.id) {
					case 3:
					case 7:
					case 27:
					// ==>注意这里的ruleId并不是当前点击节点的ID,而是点击节点的下一节点的ID<==
					// ==>注意这里的ruleId并不是当前点击节点的ID,而是点击节点的下一节点的ID<==
					// ==>注意这里的ruleId并不是当前点击节点的ID,而是点击节点的下一节点的ID<==
					let ruleId = this.stepChildren[i+1].id;
					this.spin_show = true;
					this.loadMember(ruleId,1);
					break;

					case 4: //显示资源文件窗口
					case 8:
					case 13:
					// case 20:
					// case 21:
					case 29:
					let itemCopy = JSON.stringify(item);
					let log = JSON.parse(itemCopy).process_log;
					this.imageList = log.image;
					this.fileList = log.file;
					this.resource_show = true;
					break;

					case 22:
					console.log(this.packagingLog)
					this.logList = this.packagingLog;
					this.constructionLog_show = true;
					this.isLog = true;
					break;

					case 28:
					this.logList = this.constructionLog;
					this.constructionLog_show = true;
					this.isLog = false;
					break;
					/*
					这里是分配跨父级节点人员(因为该节点是>>本父节点>>最后一个节点),
					所以需要获取>>当前父节点的>>下一父节点的>>第一个子节点的>>Id
					*/
					case 5: 
					case 11:
					this.spin_show = true;
					console.log(this.stepList)
					console.log(this.nextStepIndex)
					let ruleIdNext = this.stepList[this.nextStepIndex+1].rules[0].id;
					this.loadMember(ruleIdNext,1);
					break;

					case 18: //加载分配人员列表
					case 20:
					this.spin_show = true;
					let ruleIdCopy = this.stepChildren[i+1].id;
					this.loadMember(ruleIdCopy,2);
					break;

					case 14: //这里是前端确认节点
					this.$Message.info('本节点需要前端人员操作')
					break;

					case 9:
					case 15: //审核窗口
					case 19: 
					case 21:
					
					this.loadPreFile(item,i);
					this.review_show = true;
					break;

					case 17:
					case 30: 
					this.label_show = true;
					this.review_show = true;
					break;

					case 24: //发货物流
					if (item.process_log !== null && item.process_log.extraJson !== '') {
						for(let i of this.formItem){
							delete i.arrivalTime;
						}
						this.formItem = JSON.parse(item.process_log.extraJson);
					}
					this.logistics_show = true;
					break;

					case 25: //收货回显物流信息
					let logisticsItem = this.stepChildren[i];
					if (item.process_log !== null && item.process_log.extraJson !== '') {
						this.formItem = JSON.parse(logisticsItem.process_log.extraJson);
					}else{
						this.formItem = [];
					}
					this.logistics_show = true;
					break;
				}
			},
			confirm(type){
				switch (type) {
					case 1://分配人员
					if (this.designatePersonnel == '') {
						this.$Message.error('请选择分配人员');
						return;
					}
					this.dataItem.designatePersonnel = this.designatePersonnel;
					this.postData();
					break;

					case 2://提交资源文件
					if (this.imageList.length == 0 && this.fileList.length == 0) {
						this.$Message.error('请选择图片或文件');
						return;
					}
					let imageCopy = [];
					for(let i of this.imageList){
						imageCopy.push(i.split('.com/')[1]);
					}
					let fileCopy = [];
					for(let i of this.fileList){
						let obj = {
							name:i.name,
							size:i.size,
							link:i.link.split('.com/')[1]
						}
						fileCopy.push(obj);
					}

					this.dataItem.image = imageCopy.join(',');
					this.dataItem.file = JSON.stringify(fileCopy);
					this.postData();
					break;

					case 3://提交进度
					this.$Modal.confirm({
						title: "警告",
						content: "<p>确定完成该进度?</p>",
						onOk: () => {
							this.dataItem.isfinish = '1';
							this.postData();
						},
						onCancel: () => {
							this.$Message.info("取消操作");
						}
					});
					break;

					case 4://这种情况为提交资源文件和分配人员
					if (this.designatePersonnel == '') {
						this.$Message.error('请选择分配人员');
						return;
					}
					this.dataItem.designatePersonnel = this.designatePersonnel;
					let imageCopyT = [];
					for(let i of this.imageList){
						imageCopyT.push(i.split('.com/')[1]);
					}
					let fileCopyT = [];
					for(let i of this.fileList){
						let obj = {
							name:i.name,
							size:i.size,
							link:i.link.split('.com/')[1]
						}
						fileCopyT.push(obj);
					}
					this.dataItem.image = imageCopyT.join(',');
					this.dataItem.file = JSON.stringify(fileCopyT);
					this.postData();
					break;
					
					case 5://这里需要判断ID为25的时候,点击事件是提交是否完成,否则提交物流信息
					if (this.dataItem.ruleId == '25') {
						let num = 0;
						for(let i of this.formItem){
							if (i.status === '1') {
								num++;
							}
						}
						if (num === this.formItem.length) {
							this.isfinish = '1';
						}else{
							this.isfinish = '0';
						}
						this.dataItem.isfinish = this.isfinish;
						this.dataItem.extraJson = JSON.stringify(this.formItem);
					}else{
						this.dataItem.extraJson = JSON.stringify(this.formItem);
					}
					this.postData();
					break;

					case 6:
					this.dataItem.extraJson = JSON.stringify(this.formItem);
					this.postData(1);
					break;
				}
			},
			//提交数据
			postData(type){
				this.api.hanld_process(this.dataItem)
				.then(res => {
					console.warn(res);
					this.$Message.info(res.msg);
					if (res.code == 1) {
						if (!type) {
							this.closePop();
						}
						this.initData();
						this.designatePersonnel = '';
						this.memberList = [];
					}
				})
			},
			//关闭所有弹窗
			closePop(){
				this.spin_show = false;
				this.member_show = false;
				this.resource_show = false;
				this.review_show = false;
				this.resource_mem_show = false;
				this.logistics_show = false;
				this.constructionLog_show = false;
				this.img_show = false;
				this.label_show = false;
				this.isLog = true;
				this.dataItem = {};
				this.imageList = [];
				this.fileList = [];
				this.designatePersonnel = '';
				this.isfinish = '1';
				this.activedTab = '0';
				this.formItem = [{
					"name":"",
					"company":"",
					"phone":"",
					"orderNo":"",
					"deliveryTime":"",
					"arrivalTime":"",
					"status":"0"
				}];
			},
			//吊起上传文件框,type为1是图片上传,type为2是其他文件格式上传
			tabInput(type){
				this.uploadType = type;
				document.getElementById('uploadInput').click();
			},
			//删除文件列表的指定文件
			deleteFile(type,i){
				if (type == 1) {
					this.imageList.splice(i,1);
				}else {
					this.fileList.splice(i,1);
				}
			},
			uploadFile(e){
				let file = e.target.files[0];
				if (file) {
					console.log(file)
					this.img_show = true;
					this.api.common_upload().then(res => {
						let fileType = file.type.split('/')[0];
						//判断文件格式是否正确
						if (fileType !== 'image' && this.uploadType == 1) {
							this.$Message.error('不支持该文件格式');
							document.getElementById('uploadInput').value = '';
							this.img_show = false;
							return;
						}else{
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
							let filename = "web/image/"+timestampToTimeUpload(new Date().getTime())+"/"+new Date().getTime();
							
							//使用put方法上传图片
							client.put(filename,file)
							.then(result => {
								if (this.uploadType == 1) {
									this.imageList.push(result.url);
								}else if (this.uploadType == 2) {
									let size_temp = '';
									if (file.size<=524288) {
										size_temp = '0.5M';
									}else {
										size_temp = (file.size/(1024*1024)).toFixed(2)+"M";
									}
									let obj = {
										name:file.name,
										link:result.url,
										size:size_temp
									}
									this.fileList.push(obj);
								}else{
									this
								}
								this.img_show = false;
								document.getElementById('uploadInput').value = '';
							})
							.catch(err => {
								console.log(err)
							})
						}else {
							this.$Message.error(res.msg);
						}
					}
				})
				}
			},
			//从接口加载人员列表
			loadMember(ruleId,type){
				this.api.get_user_by_rule({
					ruleId:ruleId
				}).then(mem => {
					console.log(mem)
					this.$Message.info(mem.msg);
					this.spin_show = false;
					if (mem.code == 1) {
						this.memberList = mem.data;
						//type为1显示<<人员弹窗>>,否则显示<<可以上传资源又可以分配人员弹窗>>
						if (type == 1) {
							this.member_show = true;
						}else{
							this.resource_mem_show = true;
						}
					}
				})
			},
			//显示上一步的文件图片回显功能
			loadPreFile(item,index){
				for(let i of this.stepList){
					if (i.id == item.pid) {
						let step = i.rules[index-1];
						console.log(step);
						this.imageList = step.process_log.image;
						this.fileList = step.process_log.file;
						break;
					}
				}
			},
			//添加一个物流订单信息
			addForm(){
				this.formItem.push(
				{
					"name":"",
					"company":"",
					"phone":"",
					"orderNo":"",
					"deliveryTime":"",
					"arrivalTime":"",
					"status":"0"
				}
				);
				if (this.formItem.length == 1) {
					this.activedTab = 0;
				}else{
					this.activedTab = this.formItem.length-1 + '';
				}
			},
			//添加一条施工日志
			addLog(){
				this.resource_show = true;
			},
			//确认单个订单收货情况
			checkOrder(item,i){
				if (item.arrivalTime === '') {
					this.$Message.error('请填写收货时间');
					return;
				}
				console.log(this.formItem)
				this.$Modal.confirm({
					title: "警告",
					content: "<p>确定订单已收货?</p>",
					onOk: () => {
						this.$set(this.formItem[i],'status','1');
						// this.confirm(6);
					},
					onCancel: () => {
						this.$Message.info("取消操作");
					}
				});
			},
			//删除单个订单
			handleTabRemove(i){
				this.$Modal.confirm({
					title: "警告",
					content: "<p>确定删除该订单</p>",
					onOk: () => {
						this.formItem.splice(parseInt(i),1);
					},
					onCancel: () => {
						this.$Message.info("取消操作");
					}
				});
			},
			//打开图片
			openImg(img){
				console.log(img);
				this.popImg = img;
				this.popimg_show = true;
			}
		}
	}
</script>

<style scoped>
.label-title{
	width: 100%;
	text-align: center;
	margin-bottom: 10px;
}
.step-box{
	margin-top: 20px;
}
.step-child-box{
	min-height:700px;
	/*margin-left: 80px;*/
}
.ivu-steps-head{
	margin-top: 50px;
}
.ivu-steps-item{
	padding-bottom: 50px;
}
.ivu-steps-item:hover{
	cursor: pointer;
	font-weight: bold;
}
.pop-item{
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 20px;
}
.image-box{
	margin: 10px;
}
.image-box span{
	height:28px;
	line-height: 28px;
}
.avatar{
	margin: 10px;
}
.link-item{
	width: 100%;
	margin:10px 10px;
	padding: 4px 10px;
	border: 1px dashed #ccc;
	display: flex;
	justify-content: space-between;
}
</style>