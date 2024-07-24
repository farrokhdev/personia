import React, { type ReactElement } from 'react'
import { Controller } from 'react-hook-form'
import { CTextField, type CTextFieldPropType } from '../mui'

interface Props {
  controllerName: string
  controllerInstance: any
  controllerRules?: any
  errors: any
  normal?: boolean
  paddingBottom?: string
  onChange?: (event: any) => void
  register?: any
  marginTop?: string
}

export function ControllerFileField(
  props: Omit<CTextFieldPropType, 'value' | 'onChange' | 'helperText'> & Props
): ReactElement {
  const {
    controllerName,
    controllerInstance,
    controllerRules,
    errors,
    normal,
    marginTop,
    ...other
  } = props

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      rules={controllerRules}
      render={({ field: { onChange, value } }) => (
        <CTextField
          type={'file'}
          marginTop={marginTop}
          // value={value !== undefined ? value : ''}
          onChange={(event: any) => {
            onChange(event.target.files)
          }}
          background={props.background}
          helperText={errors[controllerName]?.message}
          paddingBottom={props.paddingBottom}
          {...other}
        />
      )}
    />
  )
}
