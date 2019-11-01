<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="initData()">刷新</Button>			
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<Table :columns="columns" :data="table_data"></Table>
			</div>
		</div>

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
	import {timestampToTime} from "../../common/common";
	export default {
		data() {
			return {
				spin_show: false,
				table_data: [],
				columns: [
				{
					title: '评价内容',
					key: 'content'
				},
				{
					title: '图片',
					key: 'img',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('img', {
								style: {
									height:"80px",
									width:'80px',
									margin:'10px'
								},
								attrs: {
									src: params.row.img
								},
								on: {
									click: () => {
										this.openImg(params.row.img)
									}
								}
							})
							]);
					}
				},
				{
					title: '质量星级',
					key: 'qualityStar'
				},
				{
					title: '项目经理',
					key: 'managerStar'
				},
				{
					title: '设计师',
					key: 'designerStar'
				},
				{
					title: '预算员',
					key: 'budgetaryStar'
				},
				{
					title: '测量人员',
					key: 'measureStar'
				},
				{
					title: '评价时间',
					key: 'timeC'
				}
				],
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
				this.api.get_evaluation({
					projectId: this.$route.query.projectId
				}).then(res => {
					console.log(res)
					if (res.code == 1) {
						this.table_data = res.data;
						for(let i of this.table_data){
							this.$set(i,'timeC',timestampToTime(i.createtime));
						}
						this.spin_show = false;
					}else{
						this.$Message.error(res.msg);
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
	};
</script>