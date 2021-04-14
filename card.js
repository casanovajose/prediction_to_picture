window.myp5 = p5


function cardSketch ({ imageSrc, label, probability, downloadBtn }) {

  return p => {

    let image
    let canvas
    let labelSize = 50

    p.preload = () => {
      image = p.loadImage(imageSrc)
    }

    p.setup = () => {
      canvas = p.createCanvas(600, 600 + labelSize)
      p.background('#fafafa')

      p.fill('#333')
      p.textSize(18)
      p.textAlign(p.LEFT, p.CENTER)
      p.text(label, 16, p.height - labelSize/2)

      p.fill('#999')
      p.textAlign(p.RIGHT, p.CENTER)
      p.text(probability, p.width - 16, p.height - labelSize/2)

      setupImage()

      downloadBtn.addEventListener("click", downloadCard)
    }

    p.draw = () => { }

    let setupImage = () => {
      placeImage(image)
      p.noLoop()
    }

    let placeImage = function(img) {
      let x, y, cropWidth, cropHeight
      if(img.width/img.height > p.width/(p.height-labelSize)) {
        y = 0
        cropHeight = img.height
        cropWidth = p.width/(p.height-labelSize)*img.height
        x = (img.width-cropWidth)/2
      } else {
        x = 0
        cropWidth = img.width
        cropHeight = (p.height-labelSize)/p.width*img.width
        y = (img.height-cropHeight)/2
      }
      x = parseInt(x)
      y = parseInt(y)
      cropWidth = parseInt(cropWidth)
      cropHeight = parseInt(cropHeight)
      p.copy(img, x, y, cropWidth, cropHeight, 0, 0, p.width, (p.height-labelSize))
    }

    let downloadCard = () => {
      p.save(`${label}.png`); 
    }
  }
}