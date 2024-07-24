import React, { type ReactElement, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { CTextField, type CTextFieldPropType } from '../mui'

interface Props {
  controllerName: string
  controllerInstance: any
  controllerRules?: any
  errors: any
  normal?: boolean
  paddingBottom?: string
  onChange?: () => void
  register?: any
}

export function ControllerTextField(
  props: Omit<CTextFieldPropType, 'value' | 'onChange' | 'helperText'> & Props
): ReactElement {
  const {
    controllerName,
    controllerInstance,
    controllerRules,
    errors,
    normal,
    ...other
  } = props

  const [rules, setRules] = useState<any>()
  useEffect(() => {
    setRules({
      pattern: {
        value: /^[a-zA-Z\s\d`~!@#$%^&*()-_=+[\]{};:'",.<>/?\\|]*$/,
        message: 'Enter English characters',
      },
      ...controllerRules,
    })
  }, [])

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      rules={rules}
      render={({ field: { onChange, value } }) =>
        normal ? (
          <input
            type="text"
            value={value !== undefined ? value : ''}
            onChange={onChange}
            disabled={true}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
            }}
          />
        ) : (
          <CTextField
            value={value !== undefined ? value : ''}
            onChange={props.onChange ?? onChange}
            background={props.background}
            helperText={errors[controllerName]?.message}
            paddingBottom={props.paddingBottom}
            {...other}
          />
        )
      }
    />
  )
}
