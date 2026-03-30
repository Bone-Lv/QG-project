<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '@/api/login'
import { useRouter } from 'vue-router'


const userForm = ref()

const user = ref({id: '', password: ''})

const rules = ref({
  id: [
    { required: true, message: '请输入学号/工号', trigger: 'blur' },
    { min: 10, max: 10, message: '长度为10', trigger: 'blur' },
    { pattern: /^(3125|0025|3225)\d{6}$/, message: '不符合格式', trigger: 'blur' }

  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 10个字符}' , trigger: 'blur' }
  ]

})

//路由
const router = useRouter()

//登录后触发
const submitForm = async() => { 
    if(!userForm.value){
      return
    }
    userForm.value.validate(async valid =>{
      if(valid) {
        //校验通过
        const res = await login(user.value)
        if(res.code === 1) {
        ElMessage.success('登录成功')
        localStorage.setItem('user', JSON.stringify(res.data))

          if(res.data.role === 'student'){
            //跳转学生界面
            router.push('/student')
          }else{
            router.push('/admin')
          }
        } else {
          ElMessage.error('登录失败')
        }
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
}
//重置按钮触发
const resetForm = () => { 
  ElMessage.success('重置成功')
  user.value = {id: '', password: ''}
  userForm.value.resetFields()
}


</script>

<template>
  <div class="login-container"> 
  <el-form
      ref="userForm"
      style="max-width: 600px"
      :model="user"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
    <h1>登录界面</h1>
      <el-form-item label="学号" prop="id">
        <el-input v-model="user.id" type="id" autocomplete="off" width="200px" size = "large"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password"  type="password" autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" size ="large">登录</el-button>
        <el-button @click="resetForm()" size ="large">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-size: cover;
}

</style>