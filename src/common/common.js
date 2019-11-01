export function timestampToTime(timestamp) {
  var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
  var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y+M+D+" "+h+m+s;
}
export function secondToTime(sec) {
  let secondTime = parseInt(sec);
  let min = Math.floor(secondTime%3600);
	return Math.floor(secondTime/3600) + "时" + Math.floor(min/60) + "分" + Math.floor(min%60) + "秒";
}
export function getDay(date) {
  return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}/`;
}
export function timestampToTimeUpload(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return Y+M+D;
}