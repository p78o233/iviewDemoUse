<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="initData()">刷新</Button>
			<p class="space"></p>
			<Button type="warning" icon="md-return-right" @click="exportData()">导出</Button>
		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<Table 
				id="scrollTable" 
				ref="selection" 
				border 
				:columns="columns" 
				:data="tableData"
				@on-select="chooseItem"
				@on-select-all="chooseItem"
				@on-select-all-cancel="chooseItem"
				@on-select-cancel="chooseItem"></Table>
			</div>
			<p class="space">&nbsp;</p>
			<Page :total="totalPage" @on-change='changePage'></Page>
		</div>

		<!-- 订单列表窗口 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="modal_show">
				<div class="pop-content">
					<Table :columns="columns1" :data="orderList"></Table>
					<div style="margin: 20px auto;display: flex;justify-content: center;">
						<Button @click='closePop()'>关闭</Button>
					</div>
				</div>
			</div>
		</transition>

	</div>
</template>

<script>
	import {timestampToTime,secondToTime} from '../../common/common';
	export default{
		data(){
			return{
				totalPage:0,
				currentPage:0,
				spin_show:false,
				modal_show:false,
				tableData:[],
				orderList:[],
				selectedList:[],
				columns:[
				{
					type: 'selection',
					width: 60,
					align: 'center',
					fixed: 'left'
				},
				{
					title: '品牌',
					key: 'brandName',
					width: 150,
					fixed: 'left'
				},
				{
					title: '编号',
					key: 'code',
					width: 100
				},
				{
					title: '级别',
					key: 'levelName',
					width: 100
				},
				{
					title: '省',
					key: 'province',
					width: 100
				},
				{
					title: '市',
					key: 'city',
					width: 100
				},
				{
					title: '详细地址',
					key: 'addressDetail',
					width: 200
				},
				{
					title: '零售店名称',
					key: 'storeName',
					width: 120
				},
				{
					title: '联系人(店主)',
					key: 'nickname',
					width: 110
				},
				{
					title: '电话',
					key: 'mobile',
					width: 120
				},
				{
					title: '申请日期',
					key: 'fTime',
					width: 150
				},
				{
					title: '当前状态',
					key: 'lastProcess',
					width: 100
				},
				{
					title: '品牌负责人',
					key: 'commissioner',
					width: 100
				},
				{
					title: '跟单人员(预算员)',
					key: 'create_user',
					width: 130
				},
				{
					title: '安排测量日期',
					key: 'measurer_createtime',
					width: 150
				},
				{
					title: '测量完成日期',
					key: 'measurer_finishtime',
					width: 150
				},
				{
					title: '测量人员',
					key: 'measurer_name',
					width: 120
				},
				{
					title: '安排设计日期',
					key: 'designer_createtime',
					width: 150
				},
				{
					title: '设计员',
					key: 'designer_name',
					width: 100
				},
				{
					title: '图纸提交日期',
					key: 'designer_finishtime',
					width: 150
				},
				{
					title: '店主回传日期',
					key: 'storeGiveBack',
					width: 150
				},
				{
					title: '备货日期',
					key: 'readyGoods',
					width: 150
				},
				{
					title: '订单列表',
					key: 'sendGoods',
					width: 150,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.showOrder(params.row)
									}
								}
							}, '查看详细')
							]);
					}
				},
				{
					title: '施工人员',
					key: 'worker',
					width: 100
				},
				{
					title: '施工进场日期',
					key: 'worker_createtime',
					width: 150
				},
				{
					title: '完工日期',
					key: 'worker_finishtime',
					width: 150
				},
				{
					title: '结算时间',
					key: 'settlement',
					width: 150
				},
				{
					title: '超时时间',
					key: 'timeout',
					width: 150
				}
				],
				columns1:[
				{
					title: '订单名称',
					key: 'name'
				},
				{
					title: '订单号',
					key: 'orderNo'
				},
				{
					title: '物流公司',
					key: 'company'
				},
				{
					title: '手机号码',
					key: 'phone'
				},
				{
					title: '发货时间',
					key: 'deliveryTime'
				},
				{
					title: '到货时间',
					key: 'arrivalTime'
				},
				]
			}
		},
		mounted(){
			this.initData();
			let scrollTable = document.querySelector(".ivu-table-body");
			scrollTable.addEventListener("mousewheel",e => {
				let v = -e.wheelDelta / 2;
				scrollTable.scrollLeft += v;
        //阻止浏览器默认方法
        e.preventDefault();
      },false);
		},
		methods:{
			initData(){
				this.spin_show = true;
				this.api.statistics({
					page:this.currentPage
				}).then(res => {
					console.log(res);
					this.$Message.info(res.msg);
					if (res.code == 1) {
						this.tableData = res.data.list;
						this.totalPage = res.data.totalPage*10;
						for(let i of this.tableData){
							//品牌名称
							this.$set(i,'brandName',i.brand.name);
							//等级名称
							this.$set(i,'levelName',i.level.name);
							//联系人
							this.$set(i,'nickname',i.store_user.nickname);
							//手机号码
							this.$set(i,'mobile',i.store_user.mobile);
							//创建时间
							this.$set(i,'fTime',timestampToTime(i.createtime));
							//品牌负责人
							this.$set(i,'commissioner',i.commissioner_user.nickname);
							//预算
							this.$set(i,'create_user',i.create_user.nickname);

							//解析json
							let json = JSON.parse(i.detailMsgJson);

							//测量
							// console.log(json)
							if (json.planMeasurer.empty == '0') {
								// console.warn(json.planMeasurer.value)
								this.$set(i,'measurer_createtime',timestampToTime(json.planMeasurer.value.process_log.createtime));
							}else{
								this.$set(i,'measurer_createtime','');
							}
							if (json.finishMeasure.empty == '0') {
								this.$set(i,'measurer_finishtime',timestampToTime(json.finishMeasure.value.process_log.createtime));
							}else{
								this.$set(i,'measurer_finishtime','');
							}
							if (json.finishMeasure.empty == '0' && this.verify(json.finishMeasure.value.user)) {
								this.$set(i,'measurer_name',json.finishMeasure.value.user.nickname);
							}else{
								this.$set(i,'measurer_name','');
							}

							//设计
							if (json.planDesigner.empty == '0') {
								this.$set(i,'designer_createtime',timestampToTime(json.planDesigner.value.process_log.createtime));
							}else{
								this.$set(i,'designer_createtime','');
							}
							if (json.finishDesign.empty == '0') {
								this.$set(i,'designer_finishtime',timestampToTime(json.finishDesign.value.process_log.finishtime));
							}else{
								this.$set(i,'designer_finishtime','');
							}
							if (json.finishDesign.empty == '0') {
								this.$set(i,'designer_name',json.finishDesign.value.user.nickname);
							}else{
								this.$set(i,'designer_name','');
							}

							//店主回传
							if (json.storeGiveBack.empty == '0') {
								this.$set(i,'storeGiveBack',timestampToTime(json.storeGiveBack.value.process_log.finishtime));
							}else{
								this.$set(i,'storeGiveBack','');
							}

							//备货
							if (json.readyGoods.empty == '0') {
								this.$set(i,'readyGoods',timestampToTime(json.readyGoods.value.process_log.createtime));
							}else{
								this.$set(i,'readyGoods','');
							}

							//订单列表
							if (json.readyGoods.empty == '0') {
								this.$set(i,'orderList',json.sendGoods.value);
							}

							//施工
							if (json.worker.empty == '0') {
								this.$set(i,'worker',json.worker.value.user.nickname);
							}else{
								this.$set(i,'worker','');
							}
							if (json.worker.empty == '0') {
								this.$set(i,'worker_createtime',timestampToTime(json.worker.value.process_log.createtime));
								this.$set(i,'worker_finishtime',timestampToTime(json.worker.value.process_log.finishtime));
							}else{
								this.$set(i,'worker_createtime','');
								this.$set(i,'worker_finishtime','');
							}

							//结算
							if (json.settlement.empty == '0') {
								this.$set(i,'settlement',timestampToTime(json.settlement.value.process_log.finishtime));
							}else{
								this.$set(i,'settlement','');
							}

							//当前状态
							if (json.lastProcess.empty == '0') {
								this.$set(i,'lastProcess',json.lastProcess.value.name);
							}else{
								this.$set(i,'lastProcess','');
							}

							//超时
							this.$set(i,'timeout',secondToTime(json.timeout));
						}
						this.spin_show = false;
					}
				})
			},
			changePage(page){
				this.currentPage = page;
				this.initData();
			},
			showOrder(item){
				console.log(item);
				this.modal_show = true;
				this.orderList = item.orderList;
			},
			closePop(){
				this.modal_show = false;
				this.orderList = [];
			},
			verify(params){
				if (!params && typeof(params) && params != 0) {
					return false;
				}else {
					return true;
				}
			},
			chooseItem(list){
				this.selectedList = [];
				for(let i of list){
					this.selectedList.push(i.id);
				}
				console.log(this.selectedList)
			},
			exportData(){
				if (this.selectedList.length === 0) {
					this.$Message.error('请选择项目');
					return;
				}
				window.open(this.api.export_logistics(this.selectedList.join(',')));
			}
		}
	}
</script>
