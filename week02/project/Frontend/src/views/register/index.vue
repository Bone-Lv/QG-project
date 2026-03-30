<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { register } from '@/api/login'

const userForm = ref()

const user = ref({id: '', password: '',code: ''})


const rules = ref({
  id: [
    { required: true, message: '请输入学号/工号', trigger: 'blur' },
    { min: 10, max: 10, message: '长度为10', trigger: 'blur' },
    { pattern: /^(3125|0025|3225)\d{6}$/, message: '不符合格式', trigger: 'blur' }

  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 10个字符}' , trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 10个字符}' , trigger: 'blur' }
  ]

})

//路由
const router = useRouter()

//注册后触发
const submitForm = async() => { 
  if (!userForm.value) {
    return
  }
  userForm.value.validate(async(valid) =>{ 
    if (valid) { 
      //验证成功
      if(user.value.password === user.value.code){
      //两次密码一致
        const res = await register(user.value)
        if(res.code === 1){
          ElMessage.success(`${res.msg}`)
          //跳转
          router.push('/login')
        }else{
          //注册失败
          ElMessage.error(`${res.msg}`)
        }
      }else{
        //两次密码不一致
        ElMessage.error('两次密码不一致')
        }
    } else { 
      //验证失败
      ElMessage.error('请填写正确的信息')
      return false
    }
})
  
}
//重置按钮触发
const resetForm = () => { 
  user.value= {id: '', password: ''}
  code.value = ''
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
    <h1>注册界面</h1>
      <el-form-item label="学号" prop="id">
        <el-input v-model="user.id" type="id" placeholder="请输入学号" autocomplete="off" width="200px" size = "large"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="user.password"  placeholder="请输入密码" type="password" autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item label="确认密码" prop="code">
        <el-input v-model="user.code"  type="password" placeholder="请再次输入密码" autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" size ="large">注册</el-button>
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