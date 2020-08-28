import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
<<<<<<< HEAD
=======
// 导入全局样式表
import '../src/assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'

// 引入axios包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:5000/api/'

// 通过axios请求拦截器，添加token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// axios挂载到vue的原型对象上
Vue.prototype.$http = axios
>>>>>>> user

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
