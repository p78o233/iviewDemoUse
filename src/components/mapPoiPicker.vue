<template>
  <div style="height: 60vh">
    <div id="pickerBox">
      <input id="pickerInput" class="myInput" placeholder="输入关键字选取地点" />
      <div id="poiInfo"></div>
    </div>
    <div id="container" class="map" tabindex="0"></div>
    <Button type="primary" icon="ios-navigate" style='position:absolute;right: 50px;bottom: 20px;' @click='confirmPOS'>确定该坐标</Button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mapObj:null,
        markerList:[], //存放所有点标记,用于删除点其他标记,保证地图只显示一个点标记
        positionItem:{},
        geocoder:null,
      };
    },
    mounted() {
      this.mapInit()
    },
    methods: {
      //创建一个map
      mapInit() {
        let that = this;
        this.mapObj = new AMap.Map('container', {
          zoom: 12,
          center:[113.271431,23.135336]
        });
        this.mapObj.on('click',this.clickMap)
        AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

          var poiPicker = new PoiPicker({
            input: 'pickerInput'
          });

          //初始化poiPicker
          that.poiPickerReady(poiPicker);
          that.mapObj.on('click',(evn)=>{
            that.choosePosition(evn)
          })
        });
        //逆地理编码，根据经纬度获取地址信息
        if(!this.geocoder){
          this.geocoder = new AMap.Geocoder({
            city: "全国", //城市设为北京，默认：“全国”
            radius: 1000 //范围，默认：500
          });
        }
      },
      poiPickerReady(poiPicker) {
        let that = this;

        window.poiPicker = poiPicker;

        var infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -20)
        });

        //选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {
          console.log(poiResult)

          //传递到父组件的经纬度数据
          this.positionItem = poiResult.item.location;
          
          //拼装数据
          let poi = poiResult.item,
          info = {
            name: poi.name,
            address: poi.address
          };
          that.mapObj.remove(that.markerList);

          //放大地图并居中
          that.mapObj.setZoom(15)
          that.mapObj.setCenter([poi.location.lng,poi.location.lat])
          //添加点标记
          let marker = new AMap.Marker({
            position: new AMap.LngLat(poi.location.lng.toFixed(2),poi.location.lat.toFixed(2))
          });
          that.mapObj.add(marker);
          that.markerList.push(marker)
          //添加信息窗体
          infoWindow.setMap(that.mapObj);
          infoWindow.setPosition(poi.location);
          delete info.source;
          delete info.id;
          delete info.location;
          infoWindow.setContent('定位信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
          infoWindow.open(that.mapObj, marker.getPosition());
          
          setTimeout(() => {
            infoWindow.close();
          },3000)
        });

        poiPicker.onCityReady(function() {
          poiPicker.suggest('');
        });
      },
      choosePosition(e){
        this.$emit('markPosition',e.lnglat)
      },
      clickMap(e){
        console.log(e);
        //传递到父组件的经纬度数据
        this.positionItem = e.lnglat;
        this.mapObj.remove(this.markerList);
        let marker = new AMap.Marker({
          position: new AMap.LngLat(e.lnglat.lng.toFixed(2),e.lnglat.lat.toFixed(2))
        });
        this.mapObj.add(marker)
        this.markerList.push(marker);
        
      },
      removeM(){
        this.mapObj.remove(this.markerList);
      },
      confirmPOS(){
        let that = this;
        console.log(this.positionItem);
        let lnglat = [];
        lnglat.push(this.positionItem.lng);
        lnglat.push(this.positionItem.lat);
        this.geocoder.getAddress(lnglat, function(status, result) {
          console.warn(status)
          console.warn(result)
          if (status === 'complete'&&result.regeocode) {
            that.positionItem.address = result.regeocode.addressComponent;
            that.$emit('confirmPOS',that.positionItem)
          }else{
            that.$Message.error('根据经纬度查询地址失败')
          }
        });
      }
    }
  }
</script>

<style>
#container{
  height: 90%;
}
#pickerInput{
  margin-bottom: 10px;
}
</style>