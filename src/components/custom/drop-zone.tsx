import React, { useState, type ReactElement } from 'react';
import styled from 'styled-components';
import { type DropzoneRootProps, useDropzone } from 'react-dropzone';

const getColor = (props: any): string => {
  if (props.isDragAccept === true) {
    return props.theme.blue100;
  }
  if (props.isDragReject === true) {
    return props.theme.red100;
  }
  if (props.isFocused === true) {
    return props.theme.black80;
  }

  return props.theme.black12;
};

const Container = styled.div<DropzoneRootProps & { $marginBottom?: string, $disabled?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  border: 1px solid ${props => getColor(props)};
  background-color: ${props => props.theme.gray40};
  color: ${props => props.theme.black50};
  outline: none;
  transition: all 50ms ease-in-out;
  font-size: 14px;
  height: 220px;
  margin-bottom: ${props => props.$marginBottom ?? '0'};
  border: 1px solid ${props => props.theme.white30};

  &:hover {
    border: 1px solid ${props => props.theme.gray40};
    cursor: ${({ $disabled }) => $disabled === true ? 'not-allowed' : 'pointer'};
  }

  > * {
    &:hover {
      cursor: ${({ $disabled }) => $disabled === true ? 'not-allowed' : 'pointer'};
    }
  }

  &.has-error {
    border-color: ${props => props.theme.red100};
  }

  > .description {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    text-align: right;
  }

  > .files {
    padding: 10px 10px 0 10px;
    display: flex;
    flex-direction: row;

    > .file {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid ${props => props.theme.white30};
      margin-left: 10px;
      margin-bottom: 10px;

      > img {
        width: 200px;
        height: 100px
      }

      &:last-child {
        margin-left: 0;
      }

      > span {
        font-size: 12px;
        color: ${props => props.theme.white100};
        direction: ltr;
      }

      > .icon {
        display: block;
        margin: 0 auto 10px auto;
        text-align: center;
        color: ${props => props.theme.black50};
      }

      &:hover {
        background-color: ${props => props.theme.black8};

        > span {
          font-size: 12px;
          color: ${props => props.theme.black100};
          direction: ltr;
        }
      }
    }
  }
`;

const ErrorText = styled.p`
  text-align: right;
  font-family: Inter;
  font-weight: 500;
  font-size: 10px;
  color: ${({ theme }) => theme.red100};
  margin-right: 8px;
  margin-top: 8px;
`;

export interface DropZoneProps {
  marginBottom?: string;
  disabled?: boolean;
  helperText?: string;
  selectedFiles: File[] | undefined;
  onSelect: (files: File[]) => void;
  acceptedFiles?: string[];
  maxFiles?: number;
  label: string;
  image?: string;
  type?: string;
}

export function DropZone(props: DropZoneProps): ReactElement {
  const {
    marginBottom = 0,
    disabled = false,
    helperText,
    acceptedFiles,
    selectedFiles,
    onSelect,
    maxFiles = 1,
    label,
    image,
    type
  } = props;

  const onDrop = React.useCallback((acceptedFiles: any) => {
    if (!disabled) {
      handleSelect(acceptedFiles);
    }
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop });

  const [errorText, setErrorText] = useState<string>('');

  const handleSelect = (files: File[]): void => {
    setErrorText('');
    let hasError = false;

    if (files.length > maxFiles) {
      setErrorText(`Cannot select more than  ${maxFiles} files`);
      hasError = true;
    } else {
      if (acceptedFiles != null && files.length > 0) {
        for (const file of files) {
          if (!acceptedFiles.includes(file.type)) {
            setErrorText('Selected file is not valid');
            hasError = true;
          }
        }
      }
    }

    if (!hasError) {
      onSelect(files);
    }
  };

  return (
    <>
      <Container
        $marginBottom={marginBottom}
        $disabled={disabled}
        className={`${(helperText !== '' && helperText !== undefined) || errorText !== '' ? 'has-error' : ''}`}
        {...getRootProps({ isFocused, isDragAccept, isDragReject })}
      >
        {!disabled
          ? <input {...getInputProps()} />
          : null}

        <div className='files'>
          {selectedFiles ? selectedFiles?.map((file, i) => (
              <div
                className='file'
                key={i}
                onClick={(e) => {
                  e.stopPropagation();

                  const files = selectedFiles.filter(x => x.name !== file.name && x.size !== file.size);

                  onSelect(files);
                }}
              >
                {file.type.includes('image') ?
                  <img src={URL.createObjectURL(file)} />
                  :
                  <span>{file.name}</span>
                }
                <span className='icon material-symbols-outlined'>delete</span>
              </div>
            )) :
            image ?
              <div className='files'>
                <div className='file'>
                  <img src={image} style={{ width: type === 'avatar' ? '100px' : (type=='cover' ? '500px' : '300px' ), height:type === 'avatar' ? '100px' : (type=='cover' ? '150px' : '150px' ) }} />
                </div>
              </div>
              : null
          }
        </div>

        <div className='description'>
          {
            isDragActive
              ? <p>Drop Your Files Here</p>
              : <p>Drop or Click ({label})</p>
          }
        </div>
      </Container>

      {helperText !== '' && helperText !== undefined
        ? <ErrorText>{helperText}</ErrorText>
        : null}

      {errorText !== ''
        ? <ErrorText>{errorText}</ErrorText>
        : null}
    </>
  );
}
