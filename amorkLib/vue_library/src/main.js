import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '../src/assets/css/global.css'
// 导入字体图标
import './assets/font/iconfont.css'

// 导入富文本编辑
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
// 富文本编辑引用
Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
