import Cropper from 'cropperjs'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CButton } from '../mui'
import { SuperImageCropper } from 'super-image-cropper'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;

  > img {
    max-width: 100%;
    max-height: 500px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex: 1;
  align-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 15px;

  > .grow {
    flex-grow: 1;
  }
`

interface Props {
  src: string
  aspectRatio: number
  onCrop: (blob: Blob | null) => void
  setSelectedFile: (item: any) => void
  aspectRatioEditable: boolean
  submitLoading?: boolean
  selectedFile?: any
}

export function CropperJs(props: Props) {
  const {
    src,
    aspectRatio,
    onCrop,
    setSelectedFile,
    aspectRatioEditable = true,
    submitLoading = false,
    selectedFile,
  } = props

  const id = Math.round(Math.random() * 1000000) + '-cropper'
  var cropper: Cropper = null

  useEffect(() => {
    const image = document.getElementById(id)

    cropper = new Cropper(image as HTMLImageElement, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      dragMode: 'move',
      initialAspectRatio: aspectRatio,
      rotatable: false,
      scalable: false,
    })
  })

  const imageCropper = new SuperImageCropper()

  const handleSaveCroppedFile = () => {
    if (selectedFile.type.includes('gif')) {
      imageCropper
        .crop({
          cropperInstance: cropper,
          outputType: 'blob', // optional, default blob url
        })
        .then((blob: Blob) => {
          onCrop(blob)
        })
    } else {
      cropper.getCroppedCanvas({ fillColor: '#fff', maxWidth: 1080 })?.toBlob(
        blob => {
          onCrop(blob)
        },
        'image/jpeg',
        80
      )
    }
  }

  return (
    <Wrapper key={1000}>
      <img src={src} className={'profile-cropper'} id={id}  alt={''}/>

      <ButtonGroup>
        {aspectRatioEditable ? (
          <>
            <CButton
              background="navy25"
              color="white100"
              backgroundHover="navy25"
              backgroundDisabled="navy25"
              size={'s'}
              onClick={() => {
                cropper.rotate(90)
              }}
            >
              Rotate
            </CButton>
          </>
        ) : null}

        <div className="grow" />

        <CButton
          background={'red130'}
          color="white100"
          backgroundHover={'red130'}
          backgroundDisabled={'red130'}
          size={'s'}
          onClick={() => {
            setSelectedFile(null)
          }}
          margin={'0 15px 0 0'}
          loading={submitLoading}
          disabled={submitLoading}
        >
          Cancel
        </CButton>
        <CButton
          size={'s'}
          background="navy25"
          color="white100"
          backgroundHover="navy25"
          backgroundDisabled="navy25"
          onClick={handleSaveCroppedFile}
          loading={submitLoading}
          disabled={submitLoading}
        >
          Submit
        </CButton>
      </ButtonGroup>
    </Wrapper>
  )
}
