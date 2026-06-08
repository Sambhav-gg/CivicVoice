import client from './client'

export const getNearby = (lat, lng, radius = 3000) =>
    client.get(`/issues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)

export const getIssues = (params = {}) =>
    client.get('/issues', { params })

export const reportIssue = (data) =>
    client.post('/issues', data)

export const upvoteIssue = (id) =>
    client.patch(`/issues/${id}/upvote`)

export const updateStatus = (id, status) =>
    client.patch(`/issues/${id}/status`, { status })