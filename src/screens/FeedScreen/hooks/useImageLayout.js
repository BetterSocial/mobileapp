const useImageLayout = () => {

    const handleImageWidth = (images,index) => {
    if(images.length > 2 && images.length % 2 === 0) {
      return {
        height: '50%',
        width: '50%'
      }
    }
    if(images.length > 2 && images.length % 2 === 1) {
      if(index === images.length -  1) {
        return {
          height: '50%',
          width: '100%'
        }
      }
      return {
          height: '50%',
          width: '50%'
        }
    }
    if(images.length === 2) {
      return {
        height: '100%',
        width: '50%'
      }
    }
     return {
        height: '100%',
        width: '100%'
      }
 
  }

  return {
    handleImageWidth
  }
}


export default useImageLayout