<template>
	<div>
		<Select v-model="pcaObject.province" style="width:100px" @on-change="changeProvince">
			<Option v-for="(item,index) in provinceList" :value="item.name" :key="index">
				{{ item.name }}
			</Option>
		</Select>
		<Select v-model="pcaObject.city" style="width:100px;margin-left: 10px;" @on-change="changeCity">
			<Option v-for="(item,index) in cityList" :value="item.name" :key="index">
				{{ item.name }}
			</Option>
		</Select>
		<Select v-model="pcaObject.area" style="width:100px;margin-left: 10px;" @on-change="changeArea">
			<Option v-for="(item,index) in areaList" :value="item" :key="index">
				{{ item }}
			</Option>
		</Select>
	</div>
</template>

<script>
	import cityJson from './city.json';
	export default {
		data(){
			return{
				provinceList:[],
				cityList:[],
				areaList:[]
			}
		},
		props:{
			pcaObject:{}
		},
		mounted(){
			this.provinceList = cityJson.province;
		},
		methods:{
			changeProvince(){
				for(let p of this.provinceList){
					if (p.name == this.pcaObject.province) {
						this.cityList = p.city;
					}
				}
			},
			changeCity(){
				this.pcaObject.area = '';
				for(let p of this.cityList){
					if (p.name == this.pcaObject.city) {
						this.areaList = p.area;
					}
				}
			},
			changeArea(){
				if (this.pcaObject.area != '' && this.pcaObject.area !== undefined) {
					this.$emit('changeArea',this.pcaObject);
				}
			},
			
			//接收来自父组件的函数
			triggByParent(obj){
				this.pcaObject.province = obj.province;
				this.changeProvince();
				this.pcaObject.city = obj.city;
				this.changeCity();
				this.pcaObject.area = obj.area;
			}
		}
	}
</script>