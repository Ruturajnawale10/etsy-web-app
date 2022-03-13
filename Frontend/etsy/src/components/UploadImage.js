import React from "react";
import axios from "axios";
import S3FileUpload from "react-s3";

const UploadImage = () => {

    const onSelectFile = async (event) => {
        const file = event.target.files[0];
        const convertedFile = await convertToBase64(file);
        
        // Request will be sent from here in the future
        const s3URL = await axios.post(
            'http://localhost:3001/upload',
            {
                image: convertedFile,
                imageName: file.name
            }
        );
    }
    const convertToBase64 = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
        })
    }

  return (
      <div>
          <input type="file" onChange={onSelectFile}></input>
      </div>
  )
}

export default UploadImage;