<template>
	<div class="container">
		<mapView @loadPos='loadPos' ref='mapview' :positionList='positionList'></mapView>
	</div>
</template>

<script>
	import mapView from '../../components/mapview';
	export default{
		data(){
			return{
				positionList:[]
			}
		},
		components:{
			mapView
		},
		methods:{
			loadPos(bounds){
				let that = this;
				this.api.map_person({
					longitude1:bounds.northeast.lng,
					latitude1:bounds.northeast.lat,
					longitude2:bounds.southwest.lng,
					latitude2:bounds.southwest.lat
				}).then(res => {
					console.log(res)
					// debugger
					that.$Message.info(res.msg);
					that.positionList = res.data;
					that.$refs.mapview.setMarker(1);
				})
			}
		}
	}
</script>