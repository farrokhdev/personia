import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSkeleton } from '../mui'
import YouTube from 'react-youtube'

const isValidUrlProp = (props, propName, componentName) => {
  if (!props) {
    return new Error(`Required parameter URL was not passed.`)
  }
  if (!isValidUrl(props[propName])) {
    return new Error(
      `Invalid prop '${propName}' passed to '${componentName}'. Expected a valid url.`
    )
  }
}

const isValidUrl = url => {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
  const validUrl = regex.test(url)
  return validUrl
}

function LinkPreview(props) {
  const [loading, setLoading] = useState(true)
  const [preview, setPreviewData] = useState({
    img: undefined,
    description: undefined,
  })
  const [isUrlValid, setUrlValidation] = useState(false)

  const {
    url,
    width,
    maxWidth,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    onClick,
    customDomain,
  } = props

  const style = {
    width,
    maxWidth,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
  }

  const [isVideo, setIsVideo] = useState(false)
  const [videoId, setVideoId] = useState('')

  function matchYoutubeUrl(url: string) {
    var p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    if (url.match(p)) {
      return url.match(p)[1]
    }
    return false
  }

  const checkYoutube = (url: string) => {
    if (matchYoutubeUrl(url)) {
      setIsVideo(true)

      var r,
        rx =
          /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
      r = url.match(rx)
      setVideoId(r.length > 0 ? r[1] : '')
      return true
    }
    return false
  }

  useEffect(() => {
    function fetchData() {
      if (!checkYoutube(url)) {
        const fetch = window.fetch
        if (isValidUrl(url)) {
          setUrlValidation(true)
        } else {
          return null
        }
        setLoading(true)
        fetch(customDomain, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })
          .then(result => {
            result
              .json()
              .then(data => {
                setPreviewData(data)
                setLoading(false)
              })
              .catch(error => {
                setLoading(false)
              })
          })
          .catch(error => {
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return url !== '' ? (
    loading ? (
      <CSkeleton width={'100%'} height={200} borderRadius={'8px'} />
    ) : isVideo ? (
      <div style={{ width: '100%', marginTop: '10px' }}>
        <YouTube style={{width: '100%'}} iframeClassName={'w-100'} videoId={videoId} />
      </div>
    ) : (
      preview && preview.img && (
        <img
          src={preview.img}
          style={{ marginTop: '10px' }}
          alt={preview.description}
        />
      )
    )
  ) : null
}

LinkPreview.defaultProps = {
  onClick: () => {},
  width: '90%',
  maxWidth: '700px',
  marginTop: '18px',
  marginBottom: '18px',
  marginRight: 'auto',
  marginLeft: 'auto',
  customDomain: 'https://lpdg-server.azurewebsites.net/parse/link',
}

LinkPreview.propType = {
  url: isValidUrlProp,
  onClick: PropTypes.func,
  render: PropTypes.func,
  width: PropTypes.string,
  maxWidth: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  marginRight: PropTypes.string,
  marginLeft: PropTypes.string,
  customDomain: PropTypes.string,
}

export default LinkPreview
