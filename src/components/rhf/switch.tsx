import React, { type ReactElement } from 'react'
import { Controller } from 'react-hook-form'
import { CFormControlLabel, CSwitch, type CCheckboxPropTypes } from '../mui'

interface Props {
  label: string
  whenTrue: any
  whenFalse: any
  controllerName: string
  controllerInstance: any
  controllerRules?: any
  errors: any
  disabled?: boolean
}

export function ControllerSwitch (
  props: Omit<CCheckboxPropTypes, 'value' | 'onChange' | 'helperText'> & Props
): ReactElement {
  const { disabled, label, whenTrue, whenFalse, controllerName, controllerInstance, controllerRules } = props

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      rules={controllerRules}
      render={({ field: { onChange, value } }) => (
        <CFormControlLabel
          control={
            <CSwitch
              checked={value !== undefined ? (value === whenTrue) : false}
              onChange={(e) => { onChange(e.target.checked ? whenTrue : whenFalse) }}
            />
          }
          label={label}
          disabled={disabled}
        />
      )}
    />
  )
}
