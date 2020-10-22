import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/users/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Booklist from '../components/books/Booklist.vue'
import Category from '../components/books/Category.vue'
import Readnotes from '../components/tracks/Readnotes.vue'
import Addnotes from '../components/tracks/Addnotes.vue'
import Readtrack from '../components/tracks/Readtrack.vue'
import History from '../components/datas/History.vue'
import Pie from '../components/datas/Pie.vue'

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
        { path: '/category', component: Category },
        { path: '/readingnotes', component: Readnotes },
        { path: '/readingnotes/add', component: Addnotes },
        { path: '/readingtracks', component: Readtrack },
        { path: '/history', component: History },
        { path: '/pie', component: Pie }
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
