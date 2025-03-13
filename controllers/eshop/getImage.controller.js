const { deleteFileFromS3 } = require("../../services/S3_Services")

const getImageUrls = async(req,res)=>{
    const images = req?.imageUrls 
    console.log(images)
    try {
        const urls = images?.map((obj)=>{
            return obj?.url
        })
        res.status(200).json(urls)
    } catch (error) {
        images?.map((obj)=>{
            deleteFileFromS3(obj.key)
        })
        res.status(400).json({error:error.message})
    }
}

module.exports = {getImageUrls}