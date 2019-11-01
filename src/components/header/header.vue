<template>
	<div class="header-con">
		<div class="header-text">
			<!--<img src="@/assets/logo.png">-->
		</div>
		<div style="padding-top: 5px;margin-right: 30px;">
			<Dropdown trigger="hover" @on-click="trigger">
				<a href="javascript:void(0)">
					<Badge :count="$store.state.message_unread">
						<Avatar icon="ios-person" size="large" />
					</Badge>
					{{$store.state.user_name}}
				</a>
				<DropdownMenu slot="list">
					<!--<DropdownItem name='message'>-->
						<!--<Badge dot v-if="$store.state.message_unread>0" :offset=[-10,-10]>-->
						<!--</Badge>-->
						<!--<Icon type="md-notifications" />-->
						<!--消息中心-->
					<!--</DropdownItem>-->
					<!--<DropdownItem name='edit'>-->
						<!--<Icon type="md-hammer" />-->
						<!--修改密码-->
					<!--</DropdownItem>-->
					<DropdownItem name='logout'>
						<Icon type="md-power" />
						登出
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>

		<!-- 修改信息窗口 -->
		<transition name='bounce'>
			<div class="pop-container" v-show="modal_show">
				<div class="pop-content">
					<Form>
						<FormItem label="新密码">
							<Input v-model="password" placeholder="Enter something..."></Input>
						</FormItem>
						<FormItem label="再次输入密码">
							<Input v-model="password_copy" placeholder="Enter something..."></Input>
						</FormItem>
						<FormItem>
							<Button type="primary" @click="changePassWord()"><Icon type="md-checkmark" />提交</Button>
							<Button style="margin-left: 8px" @click="modal_show = false"><Icon type="md-close" />取消</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		</transition>

		<!-- 信息窗口 -->
		<Drawer :closable="false" width="300" v-model="drawer_show">
			<Spin size="large" fix v-if="spin_show"></Spin>
			<div class="type-list">
				<p
				v-for="(p,i) in type_list"
				:key='i' v-if="i>0"
				:class="i == isread ? 'typeItemActived' : 'typeItem'"
				@click="changeType(i)">{{p}}</p>
			</div>
			<div class="demo-drawer" v-for='(item,index) in message_list' :key='item.id' @click='openModal(item,index)' >
				<Badge dot v-if="item.isread == '0'">
				</Badge>
				<p class="message-item">{{item.content}}</p>
				<p class="message-time">{{item.createtime | formate}}</p>
				<Divider />
			</div>
			<p v-if="message_list.length == 0" style="text-align: center;margin: 100px auto;">没有消息</p>
			<Page v-if="message_list.length > 0"  :total="totalPage" @on-change="changePage" size="small">
			</Page>
		</Drawer>
	</div>
</template>

<script>
	import {timestampToTime} from '../../common/common';
	export default{
		data(){
			return{
				modal_show:false,
				drawer_show:false,
				spin_show:false,
				msgDetail:false,
				password:'',
				password_copy:'',
				message_list:[],
				type_list:["","已读","未读","全部"],
				isread:2,
				currentPage:1,
				totalPage:0,

				loop:null
			}
		},
		mounted(){
			// this.loadMessage();
			// this.loop = setInterval(()=>{
			// 	this.isread = 2;
			// 	this.loadMessage();
			// },10000)
		},
		methods:{
			//加载信息
			loadMessage(){
				this.spin_show = true;
				this.api.message({
					page:this.currentPage,
					isread:this.isread,
					count:6
				}).then(res => {
					if (res.code == 1) {
						this.spin_show = false;
						this.message_list = res.data.list;
						this.$store.commit('CACHE_UNREAD',res.data.unreadCount);
						this.totalPage = res.data.totalPage*10;
					}
				})
			},
			//触发下拉
			trigger(e){
				if (e == 'edit') {
					this.modal_show = true;
				}else if (e == 'logout') {
					this.logout();
				}else{
					this.drawer_show = true;
				}
			},
			//退出登录
			logout(){
				// let userId = JSON.parse(localStorage.getItem('userid'));
				//
				// this.api.logout({id:userId},"logout").then(res =>{
				// 	if (res.code == 1) {
				// 		console.log(this.loop);
				// 		// window.clearInterval(this.loop);
				// 		localStorage.removeItem('userInfo');
				// 		this.$router.push('/login');
				// 	}else{
				// 		this.$message.error(res.msg);
				// 	}
				// })
                this.$router.push('/login');
			},
			changePassWord(){
				if (this.password == '') {
					this.$Message.error('请输入密码');
					return;
				}else if (this.password_copy == '' || this.password !== this.password_copy) {
					this.$Message.error('两次密码不一致');
					return;
				}

				const md5 = require('md5-node');
				console.log(localStorage.getItem('userid'))
				this.api.user_edit({
					password:md5(this.password),
					userId:localStorage.getItem('userid')
				}).then(res => {
					console.log(res)
					this.$Message.info(res.msg);
					this.password = '';
					this.password_copy = '';
					this.modal_show = false;
				})
			},
			//打开信息详情
			openModal(item,i){
				console.log(item)
				this.$set(this.message_list[i],'isread','1');
				let message_unread = this.$store.state.message_unread;
				if (message_unread >= 0) {
					message_unread--;
				}else{
					message_unread = 0;
				}
				this.$store.commit('CACHE_UNREAD',message_unread);
				this.$Modal.info({
					title: item.content,
					content:
					`
					<p>项目名称：${item.project.storeName}</p>
					<p>流程节点：${item.rule.name}</p>
					<p>负责员工：${item.user.nickname}</p>
					`
				});
				this.api.set_read({
					ids:item.id
				}).then(res => {
					console.log(res);
				})
			},
			changeType(i){
				this.currentPage = 0;
				this.isread = i;
				this.loadMessage();
			},
			//翻页
			changePage(page){
				this.currentPage = page;
				this.loadMessage();
			}
		},
		filters:{
			formate(value){
				return timestampToTime(value);
			}
		}
	}
</script>

<style scoped lang="less">
.header-con{
	height: 70px;
	box-shadow: 1px 1px 5px #bdbdbd;
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	padding:10px 20px;
	.header-text{
		display: flex;
		img{
			height: 50px;
		}
		p,span{
			margin-left: 20px;
			line-height: 50px;
		}
	}
	.username{
		font-size: 20px;
		font-weight: bold;
		color:#2d8cf0;
	}
}
.message-item{
	width:100%;
}
.demo-drawer:hover{
	cursor: pointer;
	font-weight:bold;
}
.message-time{
	color:#aaa;
	text-align: right;
}
.type-list{
	width:100%;
	margin:20px auto;
	display:flex;
	justify-content:center;
}
.typeItem{
	padding:5px 15px;
	border:1px dashed #ccc;
}
.typeItemActived{
	padding:5px 15px;
	border:1px dashed #ccc;
	color:#fff;
	background:#5cadff;
}
.type-list>p:hover{
	cursor:pointer;
	color:#fff;
	background:#5cadff;
}
</style>
