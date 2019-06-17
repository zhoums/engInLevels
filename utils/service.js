let axios = require('axios');
const service = axios.create({
  baseURL:'http://127.0.0.1:3000',
})
service.interceptors.request.use(config=>{
  return config;
},error=>{
  Promise.reject(error)
})

service.interceptors.response.use(response=>{
  const res= response.data;
  return res;
},error=>{
  return Promise.reject(error);
})

module.exports = service
