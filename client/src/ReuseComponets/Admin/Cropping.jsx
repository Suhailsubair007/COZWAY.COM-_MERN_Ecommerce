import  { useState, useCallback } from 'react'
import Cropper from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const ImageCropModal = ({ image, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState({ aspect: 0 })
  const [croppedImage, setCroppedImage] = useState(null)
  const [completedCrop, setCompletedCrop] = useState(null)

  const onImageLoaded = useCallback(img => {
    setCrop({
      unit: '%', // Can be 'px' or '%'
      width: 80,
      aspect: 0 // Aspect ratio turned off
    })
  }, [])

  const onCropChange = newCrop => {
    setCrop(newCrop)
  }

  const handleCropComplete = async () => {
    if (!completedCrop || !image) return

    const croppedImage = await getCroppedImage(image, completedCrop)
    setCroppedImage(croppedImage)
    onCropComplete(croppedImage)
  }

  const getCroppedImage = (sourceImage, crop) => {
    const canvas = document.createElement('canvas')
    const scaleX = sourceImage.naturalWidth / sourceImage.width
    const scaleY = sourceImage.naturalHeight / sourceImage.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      sourceImage,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        const file = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg'
        })
        resolve(file)
      }, 'image/jpeg')
    })
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h2>Crop Image</h2>
        <Cropper
          src={URL.createObjectURL(image)}
          crop={crop}
          onImageLoaded={onImageLoaded}
          onChange={onCropChange}
          onComplete={crop => setCompletedCrop(crop)}
        />
        <button onClick={handleCropComplete}>Submit Cropping</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export default ImageCropModal
