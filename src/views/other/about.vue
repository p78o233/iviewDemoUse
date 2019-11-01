<template>
	<div class="about-container">
		<Button type="success" icon="md-sync" @click="initData()">刷新</Button>
		<Spin size="large" fix v-if='spin_show'></Spin>
		<label class="label-title">关于我们</label>
		<div style="height: 100%;">
			<quillEditor v-model='editorText'  ref="myQuillEditor" :options="editorOption" ></quillEditor>
		</div>
		<input type="file" @change='uploadFile' style="display: none;" id="uploadInput">
		<div class="btn-div">
			<Button type="primary" @click='confirm()'>提交</Button>
		</div>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor';
	import quillConfig from '../../common/quill_config';
	import {timestampToTimeUpload} from '../../common/common';
	export default{
		data(){
			return{
				editorText:'',
				spin_show:false,
				editorOption:quillConfig,   //富文本配置文件
				add_range:[],						//富文本光标坐标
			}
		},
		mounted(){
			this.initData();
			this.$refs.myQuillEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);
		},
		methods:{
			initData(){
				this.spin_show = true;
				this.api.about().then(res => {
					console.log(res);
					this.spin_show = false;
					this.editorText = res.data.content;
				})
			},
			confirm(){
				this.spin_show = true;
				this.api.about_post({content:this.editorText})
				.then(res => {
					console.log(res);
					this.$Message.info(res.msg);
					if (res.code == 1) {
						this.$Message.info(res.msg);
						this.spin_show = false;
					}
				})
			},
			imgHandler(){
				this.add_range = this.$refs.myQuillEditor.quill.getSelection();
				document.getElementById('uploadInput').click();
			},
			uploadFile(e){
				let file = e.target.files[0];
				console.log(file)
				if (file) {
					console.log(file)
					if (file.type.split('/')[0] !== 'image') {
						this.$Message.error('不支持该文件格式');
						document.getElementById('uploadInput').value = '';
						return;
					}else{
						this.spin_show = true;
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
								console.log(filename);
								//使用put方法上传图片
								client.put(filename,file)
								.then(result => {
									this.$refs.myQuillEditor.quill.insertEmbed(this.add_range.index,'image',result.url);
									document.getElementById('uploadInput').value = '';
									this.spin_show = false;
								})
								.catch(err => {
									this.spin_show = false;
									console.log(err)
								})
							}else {
								this.spin_show = false;
								this.$Message.error(res.msg);
							}
						})
					}
				}
			},
			getDay(date){
				return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/`;
			}
		},
		components:{
			quillEditor
		}
	}
</script>

<style>
.ql-container{
	height: 500px;
}
.about-container{
	position: relative;
}
.btn-div{
	width: 56px;
	margin: 50px auto;
}
</style>