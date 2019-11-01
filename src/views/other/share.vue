<template>
	<div class="container">
		<div class="float-btn">
			<Button type="primary" size="large" shape="circle" icon="md-cloud-upload" @click="uploadWin()" style='height: 50px;width:50px;font-size: 30px;'>
			</Button>
		</div>
		<Tabs type='card' style='width: 100%;' v-model='chooseTab' @on-click="changeTab">
			<TabPane label="文件共享" name='2' icon="md-document">
				<div class="table-container">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<div class="table-scroll">
						<table id="hor-minimalist-b">
							<thead>
								<tr>
									<th>ID</th>
									<th>文件名称</th>
									<th>文件</th>
									<th>文件类型</th>
									<th>文件大小(kb)</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(tb,i2) in table_data.t_body" :key='i2'>
									<td><div class="td_div">{{tb.id}}</div></td>
									<td><div class="td_div">{{tb.name}}</div></td>
									<td><a :href="tb.link" target="view_window">点击下载文件</a></td>
									<td><div class="td_div">{{tb.suffixName}}</div></td>
									<td><div class="td_div">{{tb.size}}</div></td>
									<td>
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
			</TabPane>
			<TabPane label="图片共享" name='1' icon="md-images">
				<div class="table-container">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<div class="table-scroll">
						<table id="hor-minimalist-b">
							<thead>
								<tr>
									<th>ID</th>
									<th>图片名称</th>
									<th>图片</th>
									<th>图片类型</th>
									<th>图片大小(kb)</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(tb,i2) in table_data.t_body" :key='i2'>
									<td><div class="td_div">{{tb.id}}</div></td>
									<td><div class="td_div">{{tb.name}}</div></td>
									<td><img class="td_img" :src="tb.link" @click='openImg(tb.link)'></td>
									<td><div class="td_div">{{tb.suffixName}}</div></td>
									<td><div class="td_div">{{tb.size}}</div></td>
									<td>
										<span class="delete-btn" @click='deleteItem(tb)'><Icon type="md-trash" />删除</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<p style="text-align: center;width: 100%;margin-top: 50px;" v-show='table_data.t_body.length == 0'>暂无数据</p>
					<p class="space">&nbsp;</p>
					<Page :total="totalPage" @on-change="changePage"></Page>
				</div>
			</TabPane>
		</Tabs>

		<!-- 上传弹窗 -->
		<transition name="bounce">
			<div class="pop-container" v-show="window_show">
				<div class="pop-content">
					<Spin size="large" fix v-if="spin_show"></Spin>
					<span class="close-btn" @click="closePop()">×</span>
					<Form :model="formItem" :label-width="80">
						<FormItem label="文件名">
							<Input v-model="formItem.name" placeholder="请输入..."></Input>
						</FormItem>
						<FormItem label="文件类型">
							<RadioGroup v-model="formItem.dataType">
								<Radio label="1">图片</Radio>
								<Radio label="2">文件</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="选择文件">
							<div style="display: flex;">
								<p class="myInput">{{uploadFile.name}}</p>
								<Button type="primary" @click="showUploadInput()">选择文件</Button>
							</div>
							<input type="file" style="display: none;" id="uploadInput" @change="uploadFun">
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
				<img class="pop-img" :src="popImg">
			</div>
		</div>
		
	</div>
</template>

<script>
	import axios from 'axios';
	export default{
		data(){
			return{
				chooseTab:'2',
				currentPage:1,
				table_data: {
					t_body: []
				},
				window_show:false,
				spin_show:false,
				totalPage:1,

				formItem:{
					name:'',
					dataType:'1',
					file:''
				},
				uploadFile:{},
				popimg_show: false,
				popImg: '',
			}
		},
		mounted(){
			this.initData();
		},
		methods:{
			changeTab(){
				this.currentPage = 1;
				this.initData();
			},
			initData(){
				this.spin_show = true;
				this.api.share_database({
					dataType:this.chooseTab,
					page:this.currentPage
				}).then(res => {
					if (res.code == 1) {
						this.table_data.t_body = res.data.list;
						this.totalPage = res.data.totalPage*10;
						this.spin_show = false;
					}else{
						this.$Message.error(res.msg);
					}
				})
			},
			deleteItem(item) {
				console.log(item);
				this.$Modal.confirm({
					title: "警告",
					content: "<p>确定删除该项?</p>",
					onOk: () => {
						this.spin_show = true;
						this.api.share_database_del({ id: item.id }).then(res => {
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
			changePage(page){
				this.currentPage = page;
				this.initData();
			},
			uploadWin(){
				this.window_show = true;
			},
			showUploadInput(){
				document.getElementById('uploadInput').click();
			},
			closePop(){
				this.window_show = false;
				this.formItem.name = '';
				this.formItem.dataType = '1';
				this.uploadFile = {};
			},
			uploadFun(e){
				this.uploadFile = e.target.files[0];
				console.log(this.uploadFile);
			},
			confirm(){
				this.spin_show = true;
				if (this.formItem.name == '') {
					this.$Message.error('请输入文件名');
					this.spin_show = false;
					return;
				}
				if (!this.uploadFile.name) {
					this.$Message.error('请选择文件');
					this.spin_show = false;
					return;
				}
				this.formItem.file = this.uploadFile;
				let formdata = new FormData();
				formdata.append('file',this.uploadFile);
				formdata.append('name',this.formItem.name);
				formdata.append('dataType',this.formItem.dataType);

				this.api.share_database_upload(formdata)
				.then(res => {
					this.$Message.info(res.msg);
					this.spin_show = false;
					
					if (res.code == 1) {
						document.getElementById('uploadInput').value = '';
						this.closePop();
						this.initData();
					}
					console.log(res)
				})
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
@import '../../assets/css/table.less';
.td_img{
	height: 80px;
	width:80px;
}
.float-btn{
	width:68px;
	height: 68px;
	line-height: 68px;
	text-align: center;
	position: absolute;
	bottom: 50px;
	right: 20px;
	background:rgb(51,153,255,0.5);
	border-radius: 50px;
	z-index: 998;
	box-shadow: 0 0 10px #ccc;
}
.ivu-tabs .ivu-tabs-tabpane{
	height:80vh;
}
</style>
