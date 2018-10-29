import axios from 'axios';

let base = process.env.VUE_APP_ROOT_API;

export const getAffiliateAPI = params => { return axios.get(`${base}/affiliate`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  }, params: params }).then(res => res.data); };

export const getProfileAPI = params => { return axios.get(`${base}/users`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  },params: params }).then(res => res.data); };
export const updateProfileAPI = params => { return axios.put(`${base}/users`, params, {headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  }} ).then(res => res.data); };

export const getProjectionsAPI = params => { return axios.get(`${base}/projections`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  },params: params }).then(res => res.data); };

export const getMonthlyIncomeAPI = params => { return axios.get(`${base}/income/2017-12-01/2018-12-01`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  },params: params }).then(res => res.data); };
export const updateIncomeAPI = params => { return axios.post(`${base}/income`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  }}).then(res => res.data); };

export const getSchedulesAPI = params => { return axios.get(`${base}/schedules`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  },params: params }).then(res => res.data); };
export const updateSchedulesAPI = params => { return axios.put(`${base}/schedules`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  }}).then(res => res.data); };
export const addSchedulesAPI = params => { return axios.post(`${base}/schedules`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') //the token is a variable which holds the token
  }}).then(res => res.data); };

  

export const getProjectsAPI = params => { return axios.get(`${base}/projects`, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') // the token is a variable which holds the token
  },params: params }).then(res => res.data); };
export const addProjectsAPI = params => { return axios.post(`${base}/projects`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') // the token is a variable which holds the token
  }}).then(res => res.data); };
export const updateProjectsAPI = params => { return axios.put(`${base}/projects`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') // the token is a variable which holds the token
  }}).then(res => res.data); };

  export const paymentStripeAPI = params => { return axios.post(`${base}/payment/stripe`, params, { headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') // the token is a variable which holds the token
  }}).then(res => res.data); };