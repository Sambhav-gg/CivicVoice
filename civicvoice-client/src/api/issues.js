import client from './client'

export const getNearby = (lat, lng, radius = 3000) =>
    client.get(`/issues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)

export const getIssues = (params = {}) =>
    client.get('/issues', { params })

export const reportIssue = (data) => {
    const formData = new FormData()

    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('category', data.category)
    formData.append('lat', data.lat)
    formData.append('lng', data.lng)
    formData.append('address', data.address)

    if (data.user_id) {
        formData.append('user_id', data.user_id)
    }

    if (data.image) {
        formData.append('image', data.image)
    }

    return client.post('/issues', formData)
}

export const upvoteIssue = (id) =>
    client.patch(`/issues/${id}/upvote`)

export const updateStatus = (id, status) =>
    client.patch(`/issues/${id}/status`, { status })

export const getMyVotes = () => client.get('/issues/my-votes')