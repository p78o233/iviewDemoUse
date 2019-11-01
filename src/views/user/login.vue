<template>
	<div class="login-container">
		<div class="login-box">
			<!--<div class="left-con">-->
				<!--<img src="@/assets/back.png" alt="">-->
			<!--</div>-->
			<div class="right-con">
				<div class="input-con">
					<div class="input-item">
						<Icon type="md-contact" />
						<input type="text" name="user" v-model='account' placeholder="admin">
					</div>
					<div class="input-item">
						<Icon type="md-lock" />
						<input type="password" name="pass" v-model='password' placeholder="123456" @keyup.enter='loginDo'>
					</div>
					<div class="btn-box">
						<Button style="background:#ec6151;margin-top: 10px;border-radius: 25px;line-height: 30px;box-shadow: 0 0 15px #ec6151" size="large" long type="warning" @click='loginDo'>登录</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				account:'',
				password:''
			}
		},
		mounted(){
			this.$store.state.view_router_list = [];
		},
		methods:{
			loginDo(){
                this.$router.push('/');
			}
		}
	}
</script>

<style scoped>
.login-container{
	width:100%;
}
.login-box{
	width:50%;
	margin: 8% auto;
	display: flex;
	box-shadow: 0 0 10px #ccc;
}
.left-con{
	width:50%;
}
.left-con img{
	width: 100%;
	height: 100%;
	background-size: cover;
}
.right-con{
	width:50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background:rgba(253,232,125);
}
.right-con i{
	margin: 0 6px;
	color: #ec6151;
	font-size: 26px;
}
.btn-box{
	display: flex;
	justify-content: center;
}
.input-item{
	display: flex;
	padding: 5px;
	margin-bottom:10px;
	-moz-box-shadow:inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
	-webkit-box-shadow:inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
	box-shadow:inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
	background-color: rgba(255, 255, 255);
	border-radius:4px;
}
.input-item i{
	margin-top: 5px;
}
input{
	margin:5px;
	border: 0;
	color: #bbb;
	outline: none;
	padding-left: 10px;
}
input::-webkit-input-placeholder{
	color: #bbb;
}
.input-con{
	margin: 50% auto;
	width: 88%;
	overflow: hidden;
}
.input-con input{
	width: 94%;
}
</style>
