import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
//创建axios实例对象
const request = axios.create({
  baseURL : '/api',
  timeout: 600000,
})

//axios的请求request拦截器
request.interceptors.request.use(
  (config) =>{
    //成功回调函数
    const data = JSON.parse(localStorage.getItem('user'))
    if (data && data.token){
      config.headers.token = data.token
    }
    return config
  },
  (error) =>{
    //失败回调函数
    return Promise.reject(error)
  }
)

//axois的响应response拦截器
request.interceptors.response.use(
  (response) => {//成功回调
    const newToken = response.headers['x-new-token']
    if(newToken){
      const data = JSON.parse(localStorage.getItem('user'))
      if (data && data.token){
        data.token = newToken
        localStorage.setItem('user',JSON.stringify(data))
        
      }
    }
    
    
    return response.data
  },
  (error) =>{//失败回调
    if(error.response.status == 401){
      //提示信息
      ElMessage.error('登陆超时，请重新登陆')
      router.push('/login')
      
    }else if(error.response.status == 403){
      ElMessage.error('无访问权限')
    }
    else{
      ElMessage.error('接口访问异常')
    }
    return Promise.reject(error)
  }
  
)
export default request