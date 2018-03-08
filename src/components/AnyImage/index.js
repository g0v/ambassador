import React, { Component } from 'react'
import { Image as UIImage } from 'semantic-ui-react'
import placeholder from '~/images/placeholder.png'

class AnyImage extends Component {
  static defaultPorps = {
    images: []
  }

  constructor(props) {
    super(props)

    this.state = {
      url: null
    }
  }

  testImage(src) {
    const img = new Image()

    let f, g
    const p =  new Promise(function (resolve, reject) {
      img.addEventListener('load', f = function() {
        img.removeEventListener('load', f)
        resolve(src)
      })
      img.addEventListener('error', g = function() {
        img.removeEventListener('error', g)
        reject(new Error(`Fail to load ${src}`))
      })
    })

    img.src = src

    return p
  }

  componentDidMount() {
    let { src, images = [] } = this.props

    if (src) images.unshift(src)

    this.loadImages(images)
  }

  componentDidUpdate(prev) {
    let { src, images = [] } = this.props

    if (prev.src !== src || prev.images !== images) {
      if (src) images.unshift(src)

      this.loadImages(images)
    }
  }

  loadImages = async (images) => {
    // test images one by one until we find an accessible image
    for (const image of images) {
      try {
        const url = await this.testImage(image)
        this.setState({ url })
        return
      } catch (err) {
        console.warn(err)
      }
    }
  }

  render() {
    const { src, images, ...props } = this.props
    const { url } = this.state

    return (
      <UIImage
        {...props}
        src={url || placeholder}
        style={{ backgroundColor: "#fff" }}
      />
    )
  }
}

export default AnyImage
