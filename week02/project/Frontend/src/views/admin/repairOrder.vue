<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {ref,onMounted,watch} from 'vue'
import { queryPage,addRepairOrder,updateRepairOrder ,deleteByIds,queryById, queryRepairOrderById,deleteImage} from '@/api/repairOrder';
import { ElMessage, ElMessageBox, ElRow } from 'element-plus';

//元数据
const statusOptions = ref([
  {value: '待处理', label: '待处理'},
  {value: '处理中', label: '处理中'},
  {value: '已完成', label: '已完成'},
  {value: '已取消', label: '已取消'},
])


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
  status: '',
  date: [],
  dormNum: '',
  endTime: '',
  startTime: '',

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


const repairOrder = ref({
  id: '',
  deviceType: '',
  description: '',
  dormNum: '',
  status: '',
  updateTime: '',
  createTime: '',
  studentId:'',
  adminId: '',
  image: '',
})


const add = () => { 
  repairOrder.value = {id:'',deviceType: '', description: '', dormNum: '', status: '', updateTime: ''}
  ruleForm.value?.resetFields()
  formTitle.value = '新增报修单'
  dialogFormVisible.value = true

}
const save = async() => { 
  //校验表单
  if (!ruleForm.value) {
    return
  }
  ruleForm.value.validate(async(valid) =>{
    if (valid) {
      let res = null
      if(repairOrder.value.id){
        res = await updateRepairOrder(repairOrder.value)
      }else{  
        res = await addRepairOrder(repairOrder.value)
      }

      if (res.code == 1) {//成功
        //提示信息
        ElMessage.success('保存成功')
        //隐藏对话框
        dialogFormVisible.value = false
        //查询数据
        search()
      } else {//失败
        ElMessage.error('保存失败')
      }
    } else { //不通过
      ElMessage.error('表单校验不通过')
    }
    
  })
}

//表单校验规则
const rules = ref({
  deviceType: [
    { required: true, message: '请输入设备类型', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
})
const ruleForm = ref()

//重置查询条件
const clear = () => { 
  //重置查询条件
  searchForm.value = {status: '',
  date: [],
  dormNum: '',
  endTime: '',
  startTime: ''
  }
  //查询数据
  search()
}


// 查询所有报修单
const search = async() => {
  const res = await queryPage(searchForm.value.status,searchForm.value.startTime,
  searchForm.value.endTime,currentPage.value,pageSize.value,searchForm.value.dormNum)
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
  ElMessageBox.confirm('是否删除该报修单？','提示',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async() => {
    //删除图片
    const result = await queryRepairOrderById(id)
    const image = result.data.image
    if(image && image.length > 0){
      await deleteImage(image)
    }
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
  ElMessageBox.confirm('是否删除选中的报修单？','提示',
  {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
  .then(async() => { 
    //确定删除
      //删除存储在oss的图片
    if(selectedIds.value && selectedIds.value.length > 0){
      for(let i = 0; i < selectedIds.value.length; i++){
        const result = await queryRepairOrderById(id)
        const image = result.data.image
        if(image && image.length > 0){
          await deleteImage(image)
        }
      }
       const res = await deleteByIds(selectedIds.value)
    if(res.code == 1){
      ElMessage.success('删除成功')
      search()
    }else{
      ElMessage.error('删除失败')
    }
    }else{
      ElMessage.info('请选择要删除的报修单')
    }
   
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

//详情按钮
const selById = async(id)=>{ 
  formTitle.value = '报修单详情'

    //重置表单的校验规则
  if(ruleForm.value){
    ruleForm.value.resetFields()
  }

  const res = await queryById(id)
  if(res.code == 1){
    repairOrder.value = res.data
    dialogFormVisible.value = true
  }
}



</script>

<template>

  <h1>报修单</h1><br>

  <!-- 搜索栏 -->
   <div class ="container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
    <el-form-item label="宿舍号/栋">
      <el-input v-model="searchForm.dormNum" placeholder="请输入宿舍/栋" />
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="searchForm.status" placeholder="请输入状态" >
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
      <el-table-column prop="id" label="报修单号" width="100"  align="center"></el-table-column>
      <el-table-column prop="deviceType" label="设备类型" width="100" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" width="200" align="center"></el-table-column>
      <el-table-column prop="dormNum" label="宿舍号" width="100" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="250" align="center" ></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button type="success" @click="selById(scope.row.id)">详情</el-button>
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
    <el-form :model="repairOrder" :rules="rules" ref="ruleForm" >
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="报修单号" label-width="100px ">
            <el-input v-model="repairOrder.id" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="宿舍号" label-width="100px ">
            <el-input v-model="repairOrder.dormNum" disabled />
          </el-form-item>
        </el-col>
      </el-row>  

      <!-- 第二行 -->
      <el-row :gutter="20"> 
        <el-col :span="12">
          <el-form-item label="报修时间" label-width="100px ">
            <el-date-picker
              v-model="repairOrder.createTime"
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
              v-model="repairOrder.updateTime"
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
            <el-input v-model="repairOrder.deviceType" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12"> 
          <el-form-item label="发起人学号" label-width="100px ">
            <el-input v-model="repairOrder.studentId"  disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
       <el-row :gutter="20"> 
        <el-col :span="24">
          <el-form-item label="描述" label-width="100px ">
            <el-input v-model="repairOrder.description"  disabled />
          </el-form-item>
        </el-col>
      </el-row>

       <!-- 第五行 -->
      <el-row :gutter="20"> 
        <el-col :span="12">
          <el-form-item label="处理状态" prop="status" label-width="100px ">
              <el-select v-model="repairOrder.status" placeholder="请选择处理状态" >
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
            <el-input v-model="repairOrder.adminId" disabled />
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
              <img v-if="repairOrder.image" :src="repairOrder.image" class="avatar"/>
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