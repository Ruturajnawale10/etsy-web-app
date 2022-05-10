//import AWS from 'aws-sdk';
import { Buffer } from 'buffer';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import config from '../configs/config.js';
const BUCKET_NAME = 'etsy-bucket';


const s3 = new AWS.S3(config);

/**
 * @description Uploads an image to S3
 * @param imageName Image name
 * @param base64Image Image body converted to base 64
 * @param type Image type
 * @return string S3 image URL or error accordingly
 */
 async function upload(imageName, base64Image, type) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: imageName,
        Body: new Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: type
    };
    let data;

    try {
        data = await promiseUpload(params);
    } catch (err) {
        console.error(err);
        return "";
    }

    return data.Location;
}

async function getImage(imageURL){
    console.log("Inside getImage");
    const data = s3.getObject(
      {
          Bucket:BUCKET_NAME,
          Key: imageURL
        }
      
    ).promise();
     return data;
  }

/**
 * @description Promise an upload to S3
 * @param params S3 bucket params
 * @return data/err S3 response object
 */
function promiseUpload(params, imageName) {
    return new Promise(function (resolve, reject) {
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export default {upload, getImage};