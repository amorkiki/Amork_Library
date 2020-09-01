import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Booklist from '../components/Booklist.vue'
import Readnotes from '../components/Readnotes.vue'
import Addnotes from '../components/Addnotes.vue'
import Readtrack from '../components/Readtrack.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/booklist', component: Booklist },
        { path: '/readingnotes', component: Readnotes },
        { path: '/readingnotes/add', component: Addnotes },
        { path: '/readingtracks', component: Readtrack }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
