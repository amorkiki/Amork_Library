import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/users/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'
import Booklist from '../views/books/Booklist.vue'
import Category from '../views/books/Category.vue'
import Readnotes from '../views/tracks/Readnotes.vue'
import Addnotes from '../views/tracks/Addnotes.vue'
import Readtrack from '../views/tracks/Readtrack.vue'
import History from '../views/datas/History.vue'
import Pie from '../views/datas/Pie.vue'

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
