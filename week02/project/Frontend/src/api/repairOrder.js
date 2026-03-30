import request from "@/utils/request";

//报修单历史记录列表查询
export const queryPage =(status,startTime,endTime,page,pageSize,dormNum)=>{
  return request.get('/admin?status='+status+'&startTime='+startTime+'&endTime='+endTime+'&page='+page+'&pageSize='+pageSize+'&dormNum='+dormNum)
}


//根据学生id查询保修单历史记录
export const queryAllrepairOrderById =(status,startTime,endTime,page,pageSize)=>{
  return request.get('/student?status='+status+'&startTime='+startTime+'&endTime='+endTime+'&page='+page+'&pageSize='+pageSize)
}



//添加报修单
export const addRepairOrder =(data)=>{
  return request.post('/student',data)
}

// 根据报修单单号查询报修单
export const queryRepairOrderById =(id)=>{
  return request.get('/admin/'+id)
}

//维修人员修改报修单
export const updateRepairOrder =(data)=>{
  return request.put('/admin',data)
}

//学生修改报修单
export const updateRepairOrderBystudent =(data)=>{
  return request.put('/student',data)
}


//批量删除报修单
export const deleteByIds =(ids)=>{
  console.log(ids)
  return request.delete('/admin',{params:{ids}})
} 

//根据订单号查看详情
export const queryById =(id)=>{
  return request.get('/admin/'+id)
}

//删除未上传到数据库的image文件
export const deleteImage =(image)=>{
  return request.delete('/deleteImage?image='+image)
}
