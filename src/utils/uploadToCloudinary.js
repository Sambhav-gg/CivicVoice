const streamifier = require('streamifier')
const { cloudinary } = require('../config/cloudinary')

const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'civic-issues',
                transformation: [
                    {
                        width: 1200,
                        quality: 'auto',
                        fetch_format: 'auto',
                    },
                ],
            },
            (err, result) => {
                if (err) return reject(err)
                resolve(result)
            }
        )

        streamifier.createReadStream(buffer).pipe(stream)
    })

module.exports = uploadToCloudinary