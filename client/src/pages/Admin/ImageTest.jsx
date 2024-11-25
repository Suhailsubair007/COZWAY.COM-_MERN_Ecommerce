import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../../config/cropImage' 
import axios from 'axios'
import { toast } from 'sonner'

export default function ImageCropUpload() {

  const [image, setImage] = useState(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)


  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file)) // Create a local URL for the selected image
    }
  }

  // Handle crop area changes
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])



  //Uploading to cloudinary....

  const uploadCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels)
      
      const formData = new FormData()
      formData.append('file', croppedImageBlob, 'croppedImage.jpg')
      formData.append('upload_preset', 'cozway') 

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dupo7yv88/image/upload',
        formData
      )
      toast('Cropped image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cropped image:', error)
      toast('Error uploading image')
    }
  }



  return (
    <div className='flex flex-col items-center space-y-4'>
      <h2 className='text-2xl font-bold'>Crop and Upload Image</h2>

      {/* File Input */}
      <input
        type='file'
        accept='image/*'
        onChange={handleImageChange}
        className='border border-gray-300 rounded-md p-2 w-full'
      />

      {/* Display Cropper if an image is selected */}
      {image && (
        <div className="crop-container" style={{ width: '100%', height: '400px', position: 'relative' }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={2 / 3} 
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      <button
        onClick={uploadCroppedImage}
        className='px-4 py-2 bg-blue-500 text-white rounded-md'
      >
        Upload Cropped Image
      </button>
    </div>
  )
}
