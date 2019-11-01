import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';
import router from '../router';
axios.defaults.withCredentials=true;

// const BASE_URL = 'http://192.168.50.229/mingya-backend/public/api/admin';
// const COMMON_URL = 'http://192.168.50.229/mingya-backend/public';

const BASE_URL = 'http://192.168.240.60:9090/op';
const COMMON_URL = 'http://192.168.240.60:9090/op';

function checkData(data) {
	if (data.data.code == 1) {
		return data.data
	}else if (data.data.code == 2) {
		Vue.prototype.$Message.error(data.data.msg);
		router.push('/login');
	}else{
		console.log(data.data)
		return data.data
		Vue.prototype.$Message.error(data.msg);
	}
}

/**
 * 封装get请求
 * @param url
 * @param params
 * @returns {Promise}
 */
 function myGet(url, params) {
 	return new Promise((resolve, reject) => {
 		url = BASE_URL + url;
 		axios.get(url, {
 			params: params
 		})
 		.then(res => {
 			let data = checkData(res);
 			if (data !== false) {
 				resolve(data);
 			}
 		})
 		.catch(err => {
 			reject(err);
 			console.log(err);
 		})
 	})
 }

/**
 * 封装post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
 function myPost(url, params) {
 	return new Promise((resolve, reject) => {
 		url = BASE_URL + url;
 		axios.post(url,params)
 		.then(res => {
 			let data = checkData(res);
 			if (data !== false) {
 				resolve(data);
 			}
 		})
 		.catch(err => {
 			reject(err);
 			console.log(err);
 		})
 	})
 }

/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
 function myFormDataPost(url, formdata) {
 	return new Promise((resolve, reject) => {
 		url = BASE_URL + url;
 		axios.post(url,formdata)
 		.then(res => {
 			let data = checkData(res);
 			if (data !== false) {
 				resolve(data);
 			}
 		})
 		.catch(err => {
 			reject(err);
 			console.log(err);
 		})
 	})
 }

/**
 * 封装表单提交post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
 function myCommonPost(url, formdata) {
 	return new Promise((resolve, reject) => {
 		url = COMMON_URL + url;
 		axios.get(url,formdata)
 		.then(res => {
 			let data = checkData(res);
 			if (data !== false) {
 				resolve(data);
 			}
 		})
 		.catch(err => {
 			reject(err);
 			console.log(err);
 		})
 	})
 }
// mgrDemo
export const getAllDubbo = params => {return myGet('/allDubbo', params)};
export const allAction = params => {return myGet('/allAction', params)};
export const actionCallback = params => {return myPost('/actionCallback',params)}
export const delApp = params => {return myPost('/delApp',params)}
// 部门管理
export const department = params => {return myGet('/department/index', params)};
export const get_all_position = params => {return myGet('/department/get_all_position', params)};//获取全部岗位
export const department_add = params => {return myPost('/department/add', params)};
export const department_edit = params => {return myPost('/department/edit', params)};
export const department_del = params => {return myPost('/department/del', params)};

// 岗位管理
export const position = params => {return myGet('/position/index', params)};
export const position_add = params => {return myPost('/position/add', params)};
export const position_edit = params => {return myPost('/position/edit', params)};
export const position_del = params => {return myPost('/position/del', params)};

//用户
export const login = params => {return myPost('/login/index',params)};//登录
export const logout = params => {return myPost('/user/logout',params)};//注销

//用户组
export const user_group = params => {return myGet('/user_group/index', params)};
export const user_group_add = params => {return myPost('/user_group/add', params)};
export const user_group_edit = params => {return myPost('/user_group/edit', params)};
export const user_group_del = params => {return myPost('/user_group/del', params)};

//权限
export const rules = params => {return myGet('/rules/index', params)};
export const rules_add = params => {return myPost('/rules/add', params)};
export const rules_edit = params => {return myPost('/rules/edit', params)};
export const rules_del = params => {return myPost('/rules/del', params)};

//用户权限设置
export const set_group = params => {return myGet('/user_rule/index', params)};
export const set_group_edit = params => {return myPost('/user_rule/set_group', params)};

//岗位权限
export const position_rule = params => {return myGet('/position_rule/index', params)};
export const set_rule = params => {return myPost('/position_rule/set_rule', params)};

//品牌
export const brand = params => {return myGet('/brand/index', params)};
export const brand_add = params => {return myPost('/brand/add', params)};
export const brand_edit = params => {return myPost('/brand/edit', params)};
export const brand_del = params => {return myPost('/brand/del', params)};

//区域
export const add_area = params => {return myPost('/brand/add_area', params)};
export const edit_area = params => {return myPost('/brand/edit_area', params)};
export const del_area = params => {return myPost('/brand/del_area', params)};

//等级
export const get_level = params => {return myGet('/brand/get_level', params)};
export const add_level = params => {return myPost('/brand/add_level', params)};
export const edit_level = params => {return myPost('/brand/edit_level', params)};
export const del_level = params => {return myPost('/brand/del_level', params)};

//区域用户
export const get_user = params => {return myGet('/brand/get_user', params)};
export const add_user = params => {return myPost('/brand/add_user', params)};
export const edit_user = params => {return myPost('/brand/edit_user', params)};
export const del_user = params => {return myPost('/brand/del_user', params)};

//工种
export const worker_type = params => {return myGet('/worker_type/index', params)};
export const worker_type_add = params => {return myPost('/worker_type/add', params)};
export const worker_type_edit = params => {return myPost('/worker_type/edit', params)};
export const worker_type_del = params => {return myPost('/worker_type/del', params)};

//店主
export const store = params => {return myGet('/store/index', params)};
export const store_add = params => {return myPost('/store/add', params)};
export const store_edit = params => {return myPost('/store/edit', params)};
export const store_del = params => {return myPost('/store/del', params)};

//机动人员
export const worker_mobility = params => {return myGet('/worker_mobility/index', params)};
export const worker_mobility_edit_get = params => {return myGet('/worker_mobility/edit', params)};
export const worker_mobility_add = params => {return myPost('/worker_mobility/add', params)};
export const worker_mobility_edit = params => {return myPost('/worker_mobility/edit', params)};
export const worker_mobility_del = params => {return myPost('/worker_mobility/del', params)};

//关于我们
export const about = params => {return myGet('/config/about', params)};
export const about_post = params => {return myPost('/config/about', params)};

//工程列表
export const project = params => {return myGet('/project/index', params)};
export const project_detail = params => {return myGet('/project/detail', params)};
export const project_add = params => {return myPost('/project/add', params)};
export const project_add_get = params => {return myGet('/project/add', params)};//这个接口用get请求可以拿到列表数据
export const project_edit = params => {return myPost('/project/edit', params)};
export const project_del = params => {return myPost('/project/del', params)};
export const hanld_process = params => {return myPost('/project/hanld_process', params)};//工程节点操作
export const get_user_by_rule = params => {return myGet('/project/get_user_by_rule', params)};//工程节点获取人员
export const get_evaluation = params => {return myGet('/project/get_evaluation', params)};//工程节点获取人员

//内部用户
export const user = params => {return myGet('/user/get_list', params)};
export const user_add = params => {return myPost('/user/add', params)};
export const user_edit = params => {return myPost('/user/edit', params)};
export const user_del = params => {return myPost('/user/del', params)};

//工具
export const tool = params => {return myGet('/tool/index', params)};
export const tool_add = params => {return myPost('/tool/add', params)};
export const tool_edit = params => {return myPost('/tool/edit', params)};
export const tool_del = params => {return myPost('/tool/del', params)};

//工具类
export const tool_cate = params => {return myGet('/tool/category_list', params)};
export const tool_cate_add = params => {return myPost('/tool/add_category', params)};
export const tool_cate_edit = params => {return myPost('/tool/edit_category', params)};
export const tool_cate_del = params => {return myPost('/tool/del_category', params)};

//共享资源
export const share_database = params => {return myGet('/share_database/index', params)};
export const share_database_del = params => {return myPost('/share_database/del', params)};
export const share_database_upload = formdata => {return myFormDataPost('/share_database/upload', formdata)};

//人员定位
export const map_person = params => {return myGet('/map_person/index', params)};
export const map_project = params => {return myGet('/map_project/index', params)};

//其他配置
export const start_page = params => {return myGet('/config/start_page', params)};
export const start_page_post = params => {return myPost('/config/start_page', params)};
export const statistics = params => {return myGet('/project_statistics/index', params)};

//上传图片
export const common_upload = formdata => {return myCommonPost('/api/common/common/get_oss_config_for_web', formdata)};

//模糊搜索店主
export const get_brand_user = params => {return myGet('/project/get_brand_user', params)};
//消息中心
export const message = params => {return myGet('/message/index', params)};
export const set_read = params => {return myPost('/message/set_read', params)};
//导出excel
export const export_logistics_msg = params => {return myGet('/project_statistics/export_logistics_msg', params)};
//节点操作日志
export const process_handle_log = params => {return myPost('/process_handle_log/index', params)};

export let export_logistics = params => {
	return BASE_URL + '/project_statistics/export_logistics_msg?ids=' + params;
}

//ee3f38cf88acecc5021c8eeab703caa5
