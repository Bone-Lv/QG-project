<script setup>

import { ElMessage, ElMessageBox } from 'element-plus'
import {ref ,onMounted} from 'vue'
import { useRouter } from 'vue-router' 


const id =ref(0)
const router = useRouter()
const getId = async ()=>{
  const user =  JSON.parse(localStorage.getItem('user'))
  if(user && user.id){
    id.value = user.id
  }
}

onMounted(()=>{
  getId()
})

//退出函数
const logout = ()=>{
  ElMessageBox.confirm('你确认退出登录吗','提示',
    { confirmButtonText: '确认',cancelButtonText:'取消' , type:'warning'}
  ).then(async ()=>{
    ElMessage.success("成功退出")
    localStorage.removeItem("user")
    //跳转页面
    router.push('/login')
  }).catch(()=>{
    ElMessage.info('您已取消退出')
  })
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        欢迎来到维修人员报修系统
        <div class = "layout-button">
          <el-button type="danger" @click ="logout">退出登录</el-button>
          当前用户：{{ id }}
        </div>     
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router >
          <el-sub-menu index="1">
            <template #title>
              个人信息
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/changePassword">修改密码</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-menu-item index="/admin/repairOrder">报修系统</el-menu-item>  
          <el-menu-item index="/admin/log">查询日志</el-menu-item> 

        </el-menu>

        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;  /* 两端对齐 */
  align-items: center;             /* 垂直居中 */
}

.layout-button {
  display: flex;
  align-items: center;
  gap: 10px;  /* 按钮和文字之间的间距 */
}
</style>
