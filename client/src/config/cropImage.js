export const getCroppedImg = (imageSrc, crop) => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', reject)
        image.setAttribute('crossOrigin', 'anonymous') 
        image.src = url
      })
  
    const getCroppedImg = async (imageSrc, crop) => {
      const image = await createImage(imageSrc)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
  
      canvas.width = crop.width
      canvas.height = crop.height
  
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      )
  
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg')
      })
    }
  
    return getCroppedImg(imageSrc, crop)
  }
  