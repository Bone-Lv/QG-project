import request from "@/utils/request";

//批量删除
export const deleteByIds =(ids)=>{
  console.log(ids)
  return request.delete('/admin/log',{params:{ids}})
} 

//查询日志
export const queryPage =(
  adminId,
  operation,
  endTime,
  startTime,
  page,
  pageSize
)=>{
  return request.get('/admin/log?adminId='+adminId+'&operation='+operation+'&endTime='+endTime+'&startTime='
    +startTime+'&page='+page+'&pageSize='+pageSize)
}