<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="initData()">刷新</Button>
			<p class="space"></p>
			<Button type="primary" @click="tabInput()">
				<Icon type="md-cloud-upload" />选择图片
			</Button>
			<p class="space"></p>
			<Button type="warning" @click="confirm()">
				<Icon type="md-folder" />保存
			</Button>
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<table id="hor-minimalist-b">
					<thead>
						<tr>
							<th>序号</th>
							<th>启动页</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(tb,i) in start_page_list" :key='i'>
							<td><div class="td_div">{{i}}</div></td>
							<td><img class="td_img" :src="tb" @click='openImg(tb)'></td>
							<td>
								<span class="delete-btn" @click='deleteItem(i)'><Icon type="md-trash" />删除</span>
							</td>
						</tr>
					</tbody>
				</table>
				<p style="text-align: center;width: 100%;margin-top: 50px;" v-show='start_page_list.length == 0'>暂无数据</p>
			</div>
		</div>
		<input type="file" style="display: none;" id="uploadInput" @change="uploadFun">


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
	import tableComp from "../../components/table/tableComp";
	import {timestampToTimeUpload} from '../../common/common';
	export default {
		data() {
			return {
				spin_show: false,
				start_page_list:[],
				popimg_show: false,
				popImg: '',
			};
		},
		components: {
			tableComp
		},
		mounted() {
			this.initData();
		},
		methods: {
			initData() {
				this.spin_show = true;
				this.api.start_page()
				.then(res => {
					console.log(res)
					if (res.code == 1) {
						this.start_page_list = res.data.content;
						this.spin_show = false;
					}else{
						this.$Message.error(res.msg);
					}
				});
			},
			confirm() {
				this.spin_show = true;
				let imgList = [];
				for(let i of this.start_page_list){
					imgList.push(i.split('.com/')[1]);
				}

				this.api.start_page_post({
					content:imgList.join(',')
				}).then(res => {
					if (res.code == 1) {
						this.$Message.success(res.msg);
						this.initData();
					} else {
						this.$Message.error(res.msg);
					}
					this.spin_show = false;
				});
			},
			deleteItem(i) {
				this.$Modal.confirm({
					title: "警告",
					content: "<p>确定删除该项?</p>",
					onOk: () => {
						this.start_page_list.splice(i,1);
					},
					onCancel: () => {
						this.$Message.info("取消操作");
					}
				});
			},
			tabInput(){
				document.getElementById('uploadInput').click();
			},
			uploadFun(e){
				let file = e.target.files[0];
				if (file) {
					this.spin_show = true;
					this.api.common_upload().then(res => {
						console.log(res)
						let fileType = file.type.split('/')[0];
						//判断文件格式是否正确
						if (fileType !== 'image') {
							this.$Message.error('不支持该文件格式');
							document.getElementById('uploadInput').value = '';
							this.spin_show = false;
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
								this.start_page_list.push(result.url);
								this.spin_show = false;
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
			//打开图片
			openImg(img){
				console.log(img);
				this.popImg = img;
				this.popimg_show = true;
			}
		}
	};
</script>

