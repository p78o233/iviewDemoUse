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
				this.api.map_project({
					longitude1:bounds.northeast.lng,
					latitude1:bounds.northeast.lat,
					longitude2:bounds.southwest.lng,
					latitude2:bounds.southwest.lat
				}).then(res => {
					console.log(res)
					this.$Message.info(res.msg);
					this.positionList = res.data;
					this.$refs.mapview.setMarker();
				})
			}
		}
	}
</script>