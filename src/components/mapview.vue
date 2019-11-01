<template>
	<div class="container">
		<div id="mapCon"></div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				mapObject:null,
				markerType:0
			}
		},
		props:{
			positionList:{
				type:Array
			}
		},
		mounted(){
			this.initMap();
		},
		methods:{
			//初始化数据
			initData(){
				
			},
			//初始化地图
			initMap(){
				let that = this;
				this.mapObject = new AMap.Map('mapCon',{
					zoom:11,//级别
	        center: [113.271431,23.135336],//中心点坐标
	      });
				AMap.plugin(['AMap.ToolBar'], function(){
			    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
			    that.mapObject.addControl(new AMap.ToolBar());
			  });
				//绑定移动事件
				this.mapObject.on('moveend',this.loadPos);
				this.loadPos();
			},
			//地图移动定位事件
			loadPos(){
				// debugger
				let that = this;
				console.log('移动结束')
				let bounds = this.mapObject.getBounds();
				this.$emit('loadPos',bounds);
			},
			//setMarker这里的type用来区分不同组件的调用,因为数据字段名称不一致所以需要适配
			setMarker(type){
				this.markerType = type;
				let that = this;
				// debugger
				let mapMark = [];
				if (type == 1) {
					for(let i of this.positionList){
						//循环添加点标记
						let marker = new AMap.Marker({
					    position: new AMap.LngLat(that.posTrans(i.userPoint)[0],that.posTrans(i.userPoint)[1]), // 经纬度对象
					  });	
						marker.setLabel({
			        offset: new AMap.Pixel(0,0),  //设置文本标注偏移量
			        content: "<div class='info'>"+i.nickname+"</div>", //设置文本标注内容
			        direction: 'top' //设置文本标注方位
			      });
						mapMark.push(marker);
					}
				}else{
					for(let i of this.positionList){
						//循环添加点标记
						let marker = new AMap.Marker({
					    position: new AMap.LngLat(that.posTrans(i.projectPoint)[0],that.posTrans(i.projectPoint)[1]), // 经纬度对象
					  });	
						marker.setLabel({
			        offset: new AMap.Pixel(0,0),  //设置文本标注偏移量
			        content: "<div class='info'>"+i.storeName+"</div>", //设置文本标注内容
			        direction: 'top', //设置文本标注方位
			        clickable : true 
			      });
			      //点标注的点击事件
            marker.on('click', function(e){
              console.log(i)
            });
						mapMark.push(marker);
					}
				}
				this.mapObject.add(mapMark)
			},
			posTrans(str){
				let arr = str.slice(6,str.length-1).split(' ');
				let LngLat = [];
				LngLat.push(new Number(arr[0]).toFixed(2))
				LngLat.push(new Number(arr[1]).toFixed(2))
				return LngLat;
			}
		},
		watch:{
			"positionList":function(){
				this.setMarker(this.markerType);
			}
		}
	}
</script>

<style>
#mapCon{
	height: 100%;
}
</style>