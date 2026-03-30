<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { changePassword } from '@/api/login'

const passwordForm = ref()
const passwords = ref({oldPassword : '',newPassword : '',code : ''})



const rules = ref({
  oldPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 10个字符}' , trigger: 'blur' }
  ],
  newPassword: [
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

//修改按钮后触发
const submitForm = async() => { 
  if (!passwordForm.value) {
    return
  }
  passwordForm.value.validate(async(valid) =>{ 
    if (valid) { 
      //验证成功
      if(passwords.value.newPassword === passwords.value.code){
        //两次密码一致
        ElMessageBox.confirm('确定修改密码吗','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await changePassword(passwords.value)
          if(res.code === 1){
            ElMessage.success(`${res.msg}`)
            //跳转
            router.push('/login')
          }else{
            //修改失败
            ElMessage.error(`${res.msg}`)
          }
        }).catch(() => {
          ElMessage.info('取消修改')
        })
        }else{
        //两次密码不一致
        ElMessage.error('两次密码不一致')
        }


       
      }else { 
      //验证失败
      ElMessage.error('请填写正确的信息')
      return false
      }
  })
  
}
//重置按钮触发
const resetForm = () => { 
  passwords.value = {oldPassword : '',newPassword : ''}
  code.value = ''
  passwordForm.value.resetFields()
}


</script>

<template>
  <div class="login-container"> 
  <el-form
      ref="passwordForm"
      style="max-width: 600px"
      :model="passwords"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
    <h1>修改密码</h1>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="passwords.oldPassword" type="password" placeholder="请输入原密码" autocomplete="off" width="200px" size = "large"/>
      </el-form-item>
      <el-form-item label="密码" prop="newPassword">
        <el-input v-model="passwords.newPassword"  placeholder="请输入新密码" type="password" autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item label="确认密码" prop="code">
        <el-input v-model="passwords.code"  type="password" placeholder="请再次输入新密码" autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" size ="large">修改</el-button>
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
  min-height: 80vh;
  background-size: cover;
}

</style>