import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/global.css';
// import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '@/quill/quill.snow.css';
import './assets/css/popcss.less';

import { Button, Table ,Form,FormItem,Menu,MenuItem,Dropdown,Badge,Avatar,
	DropdownMenu,DropdownItem,Icon,RadioGroup,Radio,Page,Spin,Divider,Drawer,
	Submenu,Message,Input,Select,Option,Tabs,TabPane,CheckboxGroup,Checkbox,Steps,Step,Modal} from 'iview';
	Vue.component('Button', Button);
	Vue.component('Table', Table);
	Vue.component('Form', Form);
	Vue.component('FormItem', FormItem);
	Vue.component('Menu', Menu);
	Vue.component('MenuItem', MenuItem);
	Vue.component('Badge', Badge);
	Vue.component('Dropdown', Dropdown);
	Vue.component('DropdownMenu', DropdownMenu);
	Vue.component('DropdownItem', DropdownItem);
	Vue.component('Avatar', Avatar);
	Vue.component('Icon', Icon);
	Vue.component('RadioGroup', RadioGroup);
	Vue.component('Radio', Radio);
	Vue.component('Page', Page);
	Vue.component('Spin', Spin);
	Vue.component('Divider', Divider);
	Vue.component('Drawer', Drawer);
	Vue.component('Submenu', Submenu);
	Vue.component('Input', Input);
	Vue.component('Select', Select);
	Vue.component('Option', Option);
	Vue.component('Tabs', Tabs);
	Vue.component('TabPane', TabPane);
	Vue.component('CheckboxGroup', CheckboxGroup);
	Vue.component('Checkbox', Checkbox);
	Vue.component('Steps', Steps);
	Vue.component('Step', Step);
	Vue.component('Modal', Modal);

	Vue.prototype.$Message = Message;
	Vue.prototype.$Modal = Modal;

	import * as api from './http/api';

// Vue.use(iView);
Vue.prototype.api = api

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')