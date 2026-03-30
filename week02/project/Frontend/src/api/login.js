import request from "@/utils/request";

//登录功能
export const login = (data) => { 
  return request.post('/login',data)
};

//注册功能
export const register = (data) => { 
  return request.post('/register',data)
};

//修改密码功能
export const changePassword = (data) => { 
  return request.put('/changePassword',data)
};

//更新用户宿舍号
export const updateDormNum = (dormNum) => { 
  return request.put('/student/'+dormNum)
};

//获取当前用户的信息
export const queryUserInfo = () => { 
  return request.get('/getCurrentUserInfo')
};