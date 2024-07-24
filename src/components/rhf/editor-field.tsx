import React, {
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Controller } from 'react-hook-form'
import { CTextField, type CTextFieldPropType } from '../mui'
import ReactQuill, { Quill } from 'react-quill'
import '../../assets/editor.css'
import { create as createIPFS, IPFSHTTPClient } from 'ipfs-http-client'
import { MyBlobToBuffer } from '../../utils/file'
import ImageResize from 'quill-image-resize-module-react'
import ImageUploader from 'quill-image-uploader'
import BlotFormatter from 'quill-blot-formatter'

interface Props {
  controllerName: string
  controllerInstance: any
  controllerRules?: any
  errors: any
  normal?: boolean
  showLinkPreview?: boolean
  paddingBottom?: string
  onChange?: () => void
  register?: any
}

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageUploader', ImageUploader)
Quill.register('modules/blotFormatter', BlotFormatter)

export function ControllerEditorField(
  props: Omit<CTextFieldPropType, 'value' | 'onChange' | 'helperText'> & Props
): ReactElement {
  const {
    controllerName,
    controllerInstance,
    controllerRules,
    errors,
    normal,
    showLinkPreview = false,
    ...other
  } = props

  const [rules, setRules] = useState<any>(null)
  useEffect(() => {
    setRules({
      // pattern: {
      //   value: /^[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%\^&*|']*$/i,
      //   message: 'Enter English characters',
      // },
      ...controllerRules,
    })
  }, [])

  // Initialize IPFS
  let ipfs: IPFSHTTPClient | undefined
  try {
    ipfs = createIPFS({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
        authorization:
          'Basic ' +
          btoa(
            process.env.REACT_APP_INFURA_PROJECT_ID +
            ':' +
            process.env.REACT_APP_INFURA_API_KEY_SECRET
          ),
      },
    })
  } catch (error) {
    ipfs = undefined
  }

  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        [{ table: [] }],
        ['clean'],
      ],
      imageUploader: {
        upload: file => {
          return new Promise((resolve, reject) => {
            MyBlobToBuffer(file, async (err, buff) => {
              if (err) {
              } else {
                let upload

                if (buff != null) {
                  upload = await ipfs?.add(buff)
                  resolve(`https://greenia.infura-ipfs.io/ipfs/${upload.path}`)
                }
              }
            })
          })
        },
      },
      clipboard: {
        matchVisual: false,
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize'],
      },
      blotFormatter: {},
    }),
    []
  )

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      render={({ field: { onChange, value } }) => (
        <>
          <ReactQuill
            style={{
              height: '300px',
              border: errors.description ? '1px solid red' : '',
            }}
            theme={'snow'}
            className={'editor'}
            value={value}
            placeholder={props.placeholder}
            onChange={onChange}
            modules={modules}
          />
        </>
      )}
    />
  )
}
