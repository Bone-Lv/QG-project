import { createRouter, createWebHistory } from 'vue-router'
import StuView from '@/views/student/index.vue'
import dormNum from '@/views/student/dormNum.vue'
import repairOrder from '@/views/student/repairOrder.vue'

import login from '@/views/login/index.vue'
import register from '@/views/register/index.vue'
import changePassword from '@/views/changePassword/index.vue'
import adminLog from '@/views/admin/log.vue'
import AdminView from '@/views/admin/index.vue'
import repairOrderAdmin from '@/views/admin/repairOrder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/student',
      component: StuView,
      children:[
        {
          path:'dormNum',
          name:'dormNum',
          component: dormNum
        },
            {path: 'changePassword', component: changePassword },
        {
          path:'repairOrder',
          name:'repairOrder',
          component: repairOrder
        }
      ]

    },
    {
      path: '/admin',
      component: AdminView,
      children:[
        {
          path:'repairOrder',
          name:'repairOrderAdmin',
          component: repairOrderAdmin
        },
        {path: 'changePassword', component: changePassword },
        {path: 'log',component: adminLog }

      ]
    },   
    {path: '/login', component: login },
    {path: '/register',component: register },
    {path: '/', redirect: '/login'},

    
  ]
})

export default router
