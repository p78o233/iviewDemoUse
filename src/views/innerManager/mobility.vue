<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
			<p class="space"></p>
			<Button type="primary" icon="md-add" @click="showPop()">新增机动人员</Button>
			<p class="space"></p>
			<Input v-model="searchName">
			<Select v-model="searchType" slot="prepend" style="width: 80px">
				<Option value="name">人员名称</Option>
				<Option value="mobile">手机号码</Option>
				<Option value="province">省</Option>
				<Option value="city">市</Option>
				<Option value="area">区</Option>
			</Select>
			<Button slot="append" icon="ios-search" @click="searchByType()"></Button></Input>
			
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<table id="hor-minimalist-b">
					<thead>
						<tr>
							<th>ID</th>
							<th>人员名称</th>
							<th>头像</th>
							<th>手机号码</th>
							<th>身份证号码</th>
							<th>省</th>
							<th>市</th>
							<th>区</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(tb,i2) in table_data.t_body" :key='i2'>
							<td><div class="td_div">{{tb.id}}</div></td>
							<td><div class="td_div">{{tb.name}}</div></td>
							<td><img class="td_img" :src="tb.avatar" @click='openImg(tb.avatar)'></td>
							<td><div class="td_div">{{tb.mobile}}</div></td>
							<td><div class="td_div">{{tb.idCard}}</div></td>
							<td><div class="td_div">{{tb.province}}</div></td>
							<td><div class="td_div">{{tb.city}}</div></td>
							<td><div class="td_div">{{tb.area}}</div></td>
							<td>
								<span class="edit-btn" @click='editItem(tb)'><Icon type="md-create" />编辑</span>
								<label>&nbsp;&nbsp;|&nbsp;&nbsp;</label>
								<span class="delete-btn" @click='deleteItem(tb)'><Icon type="md-trash" />删除</span>
							</td>
						</tr>
					</tbody>
				</table>
				<p style="text-align: center;width: 100%;margin-top: 50px;" v-show='table_data.t_body.length == 0'>暂无数据</p>
			</div>
			<p class="space">&nbsp;</p>
			<Page :total="totalPage" @on-change="changePage"></Page>
		</div>
		<transition name="bounce">
			<div class="pop-container" v-show="window_show">
				<div class="pop-content">
					<span class="close-btn" @click="closePop()">×</span>
					<Spin size="large" fix v-if="spin_show"></Spin>
					<Form :model="formItem" :label-width="80">
						<FormItem label="姓名">
							<Input v-model="formItem.name" placeholder="请输入..."></Input>
						</FormItem>
						<FormItem label="手机号">
							<input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" type="text" placeholder="Enter something..." class="myInput"/>
						</FormItem>
						<FormItem label="选择工种">
							<Select v-model="formItem.workerTypeId" style="width:200px">
								<Option v-for="item in workerTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<FormItem label="身份证">
							<input v-model="formItem.idCard" class="myInput" placeholder="请输入..."></input>
						</FormItem>
						<FormItem label="省市区">
							<PCA ref="pca" @changeArea="changeArea" :pcaObject="pcaObject"></PCA>
						</FormItem>
						<FormItem label="头像">
							<Spin size="large" fix v-if="img_show"></Spin>
							<div class="avatar" v-show='formItem.avatar == ""' @click='tabInput'>
								<Icon type="md-images" />
							</div>
							<div class="image-box" v-show='formItem.avatar != ""'>
								<span @click="deleteAvatar">×</span>
								<img :src="formItem.avatar" class="avatar-img">
							</div>
							<input type="file" id="avatarInput" style="display: none;" accept="image/*" @change="uploadFile">
						</FormItem>
						<FormItem>
							<Button type="primary" @click="confirm()">
								<Icon type="md-checkmark"/>提交
							</Button>
							<Button style="margin-left: 8px" @click="closePop()">
								<Icon type="md-close"/>取消
							</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		</transition>

		<!-- 图片窗口 -->
		<div class="pop-container" @click="popimg_show=false" v-show="popimg_show">
			<div class="pop-content">
				<span class="close-btn" @click="popimg_show=false">×</span>
				<img id="zoomImg" class="pop-img" :src="popImg">
			</div>
		</div>

	</div>
</template>

<script>
	import tableComp from "../../components/table/tableComp";
	import PCA from "../../components/PCA";
	import {timestampToTimeUpload} from '../../common/common';
	
	export default {
		data() {
			return {
				table_data: {
					t_body: []
				},
				window_show: false,
				spin_show: false,
				img_show: false,
				popimg_show: false,
				popImg: '',
				formItem: {
					name: "",
					avatar:"",
					mobile:"",
					idCard:"",
					workerTypeId:"",
					province:"",
					city:"",
					area:""
				},
				searchName: "",
				currentPage: 1,
				totalPage: 0,
				edit_status: "add",

				pcaObject:{
					province:'',
					city:'',
					area:''
				},

				workerTypeList:[],

				searchType:'name',
				searchObject:{
					page:this.currentPage
				},
			};
		},
		components: {
			tableComp,
			PCA
		},
		mounted() {
			this.initData();
		},
		methods: {
			initData() {
				this.spin_show = true;
				this.api.worker_mobility(this.searchObject)
				.then(res => {
					if (res.code == 1) {
						this.table_data.t_body = res.data.list;
						this.totalPage = res.data.totalPage*10;
					}
				});

				this.api.worker_mobility_edit_get().then(res => {
					console.log(res)
					this.$Message.info(res.msg);
					this.spin_show = false;
					if (res.code == 1) {
						this.workerTypeList = res.data;
					}
				})
			},
			//请空搜索条件并刷新
			refresh(){
				this.currentPage = 1;
				this.searchName = '';
				this.searchType = 'name';
				this.searchObject = {page:this.currentPage};
				this.initData();
			},
			//按searchType类型搜索
			searchByType(){
				this.currentPage = 1;
				this.searchObject = {page:this.currentPage};
				this.searchObject[this.searchType] = this.searchName;
				this.initData();
			},
			showPop() {
				this.window_show = true;
			},
			confirm() {
				this.spin_show = true;
				delete this.formItem.worker_type;

				let formItem = JSON.parse(JSON.stringify(this.formItem));
				formItem.avatar = formItem.avatar.split('.com/')[1];
				console.log(formItem)
				if (this.edit_status == "add") {
					this.api.worker_mobility_add(formItem).then(res => {
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
					this.api.worker_mobility_edit(formItem).then(res => {
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

				this.pcaObject = {
					province:'',
					city:'',
					area:''
				};

				this.formItem = {
					name: "",
					avatar:"",
					mobile:"",
					idCard:"",
					workerTypeId:"",
					province:"",
					city:"",
					area:""
				};
			},
			editItem(item) {
				this.formItem = item;
				this.$refs.pca.triggByParent(item);
				this.edit_status = "edit";
				this.window_show = true;
			},
			deleteItem(item) {
				console.log(item);
				this.$Modal.confirm({
					title: "警告",
					content: "<p>确定删除该项?</p>",
					onOk: () => {
						this.spin_show = true;
						this.api.worker_mobility_del({ id: item.id }).then(res => {
							console.log(res);
							this.spin_show = false;
							if (res.code == 1) {
								this.$Message.info(res.msg);
								this.initData();
							}
						});
					},
					onCancel: () => {
						this.$Message.info("取消操作");
					}
				});
			},
			deleteAvatar(){
				this.formItem.avatar = '';
			},
			changePage(page) {
				this.currentPage = page;
				this.initData();
			},
			changeArea(item){
				console.log(item);
				this.formItem.province = item.province;
				this.formItem.city = item.city;
				this.formItem.area = item.area;
			},
			//吊起input
			tabInput(){
				document.getElementById('avatarInput').click();
			},
			uploadFile(e){
				let file = e.target.files[0];
				console.log(file)
				if (file) {
					console.log(file)
					if (file.type.split('/')[0] !== 'image') {
						this.$Message.error('不支持该文件格式');
						document.getElementById('avatarInput').value = '';
						return;
					}else{
						this.img_show = true;
						this.api.common_upload().then(res => {
							console.log(res)
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
									this.formItem.avatar = result.url;
									this.img_show = false;
								})
								.catch(err => {
									console.log(err)
								})
							}else {
								this.$Message.error(res.msg);
							}
						})
					}
				}
			},
			//打开图片
			openImg(img){
				console.log(img);
				this.popImg = img;
				this.popimg_show = true;
			}
		}
	};
</script>

<style scoped>
@import '../../assets/css/table.less';

</style>
