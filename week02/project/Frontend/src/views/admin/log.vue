<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref,onMounted,watch} from 'vue'
import { deleteByIds ,queryPage} from '@/api/log';
import { ElMessage, ElMessageBox, ElRow } from 'element-plus';


//分页条配置
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

//对话框配置
const dialogFormVisible = ref(false)
const formTitle = ref('')

//每页数量改变
const handleSizeChange = (val) => {
  search()
}
//当前页码改变
const handleCurrentChange = (val) => {
  search()
}

//搜索栏的配置
const searchForm = ref({
  adminId: '',
  operation: '',
  endTime: '',
  startTime: '',
  date: [],
})


//watch监听
watch(()=> searchForm.value.date,(newValue,oldValue)=>{
  if(newValue.length == 2 ){
    searchForm.value.startTime = newValue[0]
    searchForm.value.endTime = newValue[1]
  }else{
    searchForm.value.startTime = ''
    searchForm.value.endTime = ''
  }
})


const  log= ref({
  id: '',
  adminId: '',
  operation: '',
  method: '',
  url: '',
  params: '',
  ip:'',
  opeartionTime: '',

})


// const add = () => { 
//   log.value = {id:'',deviceType: '', description: '', dormNum: '', status: '', updateTime: ''}
//   ruleForm.value?.resetFields()
//   formTitle.value = '新增报修单'
//   dialogFormVisible.value = true

// const save = async() => { 
//   //校验表单
//   if (!ruleForm.value) {
//     return
//   }
//   ruleForm.value.validate(async(valid) =>{
//     if (valid) {
//       let res = null
//       if(log.value.id){
//         res = await updateRepairOrder(log.value)
//       }else{  
//         res = await addRepairOrder(log.value)
//       }

//       if (res.code == 1) {//成功
//         //提示信息
//         ElMessage.success('保存成功')
//         //隐藏对话框
//         dialogFormVisible.value = false
//         //查询数据
//         search()
//       } else {//失败
//         ElMessage.error('保存失败')
//       }
//     } else { //不通过
//       ElMessage.error('表单校验不通过')
//     }
    
//   })
// }

// //表单校验规则
// const rules = ref({
//   deviceType: [
//     { required: true, message: '请输入设备类型', trigger: 'blur' },
//     { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
//   ]
// })
const ruleForm = ref()

//重置查询条件
const clear = () => { 
  //重置查询条件
  searchForm.value = {
    adminId: '',
  operation: '',
  endTime: '',
  startTime: '',
  date: [],
  }
  //查询数据
  search()
}


// 根据条件查询日志
const search = async() => {
  const res = await queryPage(searchForm.value.adminId,searchForm.value.operation,
  searchForm.value.endTime, searchForm.value.startTime,currentPage.value,pageSize.value)
  if(res.code == 1){
    tableData.value = res.data.rows
    total.value = res.data.total
  }

}

// 表格数据
const tableData = ref([])

//钩子函数
onMounted(()=>{
  search()
})



//删除按钮
const delById =async(id)=>{
  console.log('删除的 id:', id)
  ElMessageBox.confirm('是否删除该日志？','提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async() => {
    const res = await deleteByIds(id)
    if(res.code == 1){
      ElMessage.success('删除成功')
      search()
    }else{
      ElMessage.error('删除失败')
    }
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
}


//复选框
const selectedIds = ref([])

//勾选复选框后触发
const handleSelectionChange = (val) => {
  selectedIds.value = val.map(item=>item.id)
}
//批量删除按钮
const delByIds =async()=>{ 
  ElMessageBox.confirm('是否删除选中的日志？','提示',
  {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
  .then(async() => { 
    //确定删除
    if(selectedIds.value && selectedIds.value.length > 0){
       const res = await deleteByIds(selectedIds.value)
    if(res.code == 1){
      ElMessage.success('删除成功')
      search()
    }else{
      ElMessage.error('删除失败')
    }
    }else{
      ElMessage.info('请选择要删除的日志')
    }
   
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// //详情按钮
// const selById = async(id)=>{ 
//   formTitle.value = '报修单详情'

//     //重置表单的校验规则
//   if(ruleForm.value){
//     ruleForm.value.resetFields()
//   }

//   const res = await queryById(id)
//   if(res.code == 1){
//     log.value = res.data
//     dialogFormVisible.value = true
//   }
// }



</script>

<template>

  <h1>日志查询界面</h1><br>

  <!-- 搜索栏 -->
   <div class ="container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item label="管理员id">
      <el-input v-model="searchForm.adminId" placeholder="请输入管理员id" />
    </el-form-item>
    <el-form-item label="操作">
      <el-select v-model="searchForm.operation" placeholder="请输入操作" >
        <el-option label="待处理" value="待处理" />
        <el-option label="处理中" value="处理中" />
        <el-option label="已完成" value="已完成" />
        <el-option label="已取消" value="已取消" />
      </el-select>
    </el-form-item>
    <el-form-item label="日期">
      <span class="demonstration"></span>
      <el-date-picker
        v-model="searchForm.date" 
        type="daterange"
        range-separator="To"
        start-placeholder="起始时间"
        end-placeholder="结束时间" 
        :size="size"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      />

    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
      <el-button type="info" @click="clear">重置</el-button>
    </el-form-item>
  </el-form>

   </div>


  <div class ="container">

    <!-- 批量删除按钮 -->
     <el-button type="danger" @click ="delByIds">- 批量删除</el-button>
  </div>

  
  <!-- 表格 -->
  <div class ="container">
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="100" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center" ></el-table-column>
      <el-table-column prop="id" label="日志id" width="100"  align="center"></el-table-column>
      <el-table-column prop="adminId" label="管理员id" width="100" align="center"></el-table-column>
      <el-table-column prop="operation" label="操作" width="200" align="center"></el-table-column>
      <el-table-column prop="method" label="请求方法" width="100" align="center"></el-table-column>
      <el-table-column prop="url" label="访问的地址" width="100" align="center"></el-table-column>
      <el-table-column prop="params" label="查询参数" width="250" align="center" ></el-table-column>
      <el-table-column prop="ip" label="ip地址" width="250" align="center" ></el-table-column>
      <el-table-column prop="operationTime" label="操作时间" width="250" align="center" ></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button type="danger" @click="delById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页条 -->
   <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30]"
      :background="background" 
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  
  <!-- 对话框 -->

 <el-dialog v-model="dialogFormVisible" :title="formTitle"  width="1000">
    <el-form :model="log" :rules="rules" ref="ruleForm" >
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="报修单号" label-width="100px ">
            <el-input v-model="log.id" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="宿舍号" label-width="100px ">
            <el-input v-model="log.dormNum" disabled />
          </el-form-item>
        </el-col>
      </el-row>  

      <!-- 第二行 -->
      <el-row :gutter="20"> 
        <el-col :span="12">
          <el-form-item label="报修时间" label-width="100px ">
            <el-date-picker
              v-model="log.createTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="更新时间" label-width="100px ">
            <el-date-picker
              v-model="log.updateTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
       <el-row :gutter="20"> 
        <el-col :span="12">
          <el-form-item label="设备类型" label-width="100px ">
            <el-input v-model="log.deviceType" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="发起人学号" label-width="100px ">
            <el-input v-model="log.studentId"  disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
       <el-row :gutter="20"> 
        <el-col :span="24">
          <el-form-item label="描述" label-width="100px ">
            <el-input v-model="log.description"  disabled />
          </el-form-item>
        </el-col>
      </el-row>

       <!-- 第五行 -->
      <el-row :gutter="20"> 
        <el-col :span="12">
          <el-form-item label="处理状态" label-width="100px ">
              <el-select v-model="log.status" placeholder="请选择处理状态" >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="处理人" label-width="100px ">
            <el-input v-model="log.adminId" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第六行 -->
       <el-row :gutter="20"> 
        <el-col :span="24">
          <el-form-item label="图片" label-width="100px ">
            <el-upload
              action="/api/upload",
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              disabled
            >
              <img v-if="log.image" :src="log.image" class="avatar"/>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click= "save" >确定</el-button>
      </div>
    </template>
  </el-dialog> 



</template>

<style scoped>
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>