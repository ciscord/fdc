import axios from 'axios';

let base = process.env.VUE_APP_ROOT_API;

export const getAffiliateAPI = params => { return axios.get(`${base}/affiliate/80586340-5b00-419b-8b45-9875e96770fd`, { params: params }).then(res => res.data); };

export const getProfileAPI = params => { return axios.get(`${base}/users/80586340-5b00-419b-8b45-9875e96770fd`, { params: params }).then(res => res.data); };
export const updateProfileAPI = params => { return axios.put(`${base}/users`, { params: params }).then(res => res.data); };

export const getProjectionsAPI = params => { return axios.get(`${base}/projections/80586340-5b00-419b-8b45-9875e96770fd`, { params: params }).then(res => res.data); };

export const getMonthlyIncomeAPI = params => { return axios.get(`${base}/income/80586340-5b00-419b-8b45-9875e96770fd/2017-12-01`, { params: params }).then(res => res.data); };
export const updateIncomeAPI = params => { return axios.put(`${base}/income`, { params: params }).then(res => res.data); };

export const getSchedulesAPI = params => { return axios.get(`${base}/schedules/80586340-5b00-419b-8b45-9875e96770fd`, { params: params }).then(res => res.data); };
export const updateSchedulesAPI = params => { return axios.put(`${base}/schedules`, { params: params }).then(res => res.data); };