import axios from 'axios'

export function request(config) {
  // 1. 创建 axios 实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/h3',
    timeout: 5000
  })

  // 拦截器
  // 请求拦截
  instance.interceptors.request.use(config => {

    return config
  }, err => {

  }) 

  // 响应拦截
  instance.interceptors.response.use(res => {

    return res.data
  }, err => {

  })

  // 发送网络请求
  return instance(config)
}