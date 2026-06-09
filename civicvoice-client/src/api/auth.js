import client from './client'

export const register = (data) => client.post('/auth/register', data)
export const login = (data) => client.post('/auth/login', data)
export const getMe = () => client.get('/auth/me')
export const resendVerification = (data) => client.post('/auth/resend-verification', data)
export const forgotPassword = (data) => client.post('/auth/forgot-password', data)
export const resetPassword = (data) => client.post('/auth/reset-password', data)