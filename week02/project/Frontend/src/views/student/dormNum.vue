<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref,onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import { updateDormNum,queryUserInfo } from '@/api/login'
import { useRouter } from 'vue-router'


//钩子函数
onMounted(async()=>{
  const res = await queryUserInfo()
  if(res.code === 1) {
    formData.value.dormNum = res.data.dormNum
  }
})

const dormNumForm = ref()

const formData = ref({
  dormNum: '',
})

const rules = ref({
  dormNum: [
    { required: true, message: '请输入宿舍号', trigger: 'blur' },
    { min: 5, max: 6, message: '长度为5-6个字符', trigger: 'blur' },
    { pattern: /^.*\d{3}$/, message: '不符合格式' },
  ],
})


//绑定后触发
const submitForm = async() => { 
    if(!dormNumForm.value){
      return
    }
    dormNumForm.value.validate(async valid =>{
      if(valid) {
        //校验通过
        const res = await updateDormNum(formData.value.dormNum)
        if(res.code === 1) {
        ElMessage.success('绑定成功')
        dormData.value.dormNum = ''
        } else {
          ElMessage.error('绑定失败')
        }
      } else {
        ElMessage.error('请输入正确的信息')
      }
    })
}
//重置按钮触发
const resetForm = () => { 
  ElMessage.success('重置成功')
  dormNum.value = ''
  dormNumForm.value.resetFields()
}


</script>

<template>
  <div class="login-container"> 
  <el-form
      ref="dormNumForm"
      style="max-width: 600px"
      :model="formData"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
    <h1>绑定/修改宿舍</h1>
      <el-form-item label="宿舍号" prop="dormNum">
        <el-input v-model="formData.dormNum"   autocomplete="off" width="200px" size = "large" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()" size ="large">绑定</el-button>
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