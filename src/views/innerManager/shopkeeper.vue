<template>
	<div class="container">
		<div class="btn-nav">
			<Button type="success" icon="md-sync" @click="refresh()">刷新</Button>
			<p class="space"></p>
			<Button type="primary" icon="md-add" @click="showPop()">新增店主</Button>
			<p class="space"></p>
			<Input v-model="searchName">
			<Select v-model="searchType" slot="prepend" style="width: 80px">
				<Option value="username">账号</Option>
				<Option value="nickname">昵称</Option>
				<Option value="mobile">手机号码</Option>
			</Select>
			<Button slot="append" icon="ios-search" @click="searchByType()">
				
			</Button></Input>

		</div>
		<div class="table-container">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="table-scroll">
				<tableComp :tableData="table_data" @editItem="editItem" @deleteItem="deleteItem"></tableComp>
			</div>
			<p class="space">&nbsp;</p>
			<Page :total="totalPage" @on-change="changePage"></Page>
		</div>
		<transition name="bounce">
			<div class="pop-container" v-show="window_show">
				<div class="pop-content">
					<span class="close-btn" @click="closePop()">×</span>
					<Form :model="formItem" :label-width="80">
						<FormItem label="账号" v-show='edit_status == "add"'>
							<Input v-model="formItem.username" placeholder="请输入..."></Input>
							<p style="color: red;">初始密码为 " 1234 " </p>
						</FormItem>
						<FormItem label="昵称">
							<Input v-model="formItem.nickname" placeholder="请输入..."></Input>
						</FormItem>
						<FormItem label="手机号码">
							<input v-model="formItem.mobile" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" type="text" placeholder="Enter something..." class="myInput"/>
						</FormItem>
						<FormItem label="性别">
							<RadioGroup v-model="formItem.gender">
								<Radio label="1">男</Radio>
								<Radio label="2">女</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem label="状态">
							<RadioGroup v-model="formItem.status">
								<Radio label="normal">正常</Radio>
								<Radio label="hidden">冻结</Radio>
							</RadioGroup>
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
	</div>
</template>

<script>
	import tableComp from "../../components/table/tableComp";
	export default {
		data() {
			return {
				table_data: {
					t_head: [
					{ title: "ID", key: "id" },
					{ title: "账号", key: "username" },
					{ title: "昵称", key: "nickname" },
					{ title: "手机号码", key: "mobile" },
					{ title: "性别", key: "genderText" },
					{ title: "状态", key: "statusText" }
					],
					t_body: []
				},
				window_show: false,
				spin_show: false,
				formItem: {
					gender: '1',
					mobile: "",
					nickname: "",
					status: "normal",
					username: ""
				},
				searchName: "",
				currentPage: 1,
				totalPage: 0,
				edit_status: "add",
				searchType:'username',

				searchObject:{
					page:this.currentPage
				},
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
				this.api.store(this.searchObject)
				.then(res => {
					this.table_data.t_body = res.data.list;
					this.totalPage = res.data.totalPage*10;
					this.table_data.t_body.forEach((v)=>{
						if (v.gender == 1) {
							this.$set(v,'genderText','男')
						}else{
							this.$set(v,'genderText','女')
						}

						if (v.status == 'normal') {
							this.$set(v,'statusText','正常')
						}else{
							this.$set(v,'statusText','冻结')
						}
					})
					this.spin_show = false;
				});
			},
			//请空搜索条件并刷新
			refresh(){
				this.currentPage = 1;
				this.searchName = '';
				this.searchType = 'username';
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
				if (this.edit_status == "add") {
					this.api.store_add(this.formItem).then(res => {
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
					this.formItem.userId = this.formItem.id;
					this.api.store_edit(this.formItem).then(res => {
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
					gender: '1',
					mobile: "",
					nickname: "",
					status: "normal",
					username: ""
				};
			},
			editItem(item) {
				console.log(item);
				this.formItem = item;
				this.formItem.gender = item.gender+'';
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
						this.api.store_del({ id: item.id }).then(res => {
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
			changePage(page) {
				this.currentPage = page;
				this.initData();
			}
		}
	};
</script>

