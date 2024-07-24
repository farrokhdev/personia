import React, { type ReactElement } from 'react'
import { Controller } from 'react-hook-form'
import { DropZone, type DropZoneProps } from '../custom'

interface Props {
  controllerName: string
  controllerInstance: any
  controllerRules?: any
  errors: any
}

export function ControllerDropZone (
  props: Omit<DropZoneProps, 'onSelect' | 'selectedFiles'> & Props
): ReactElement {
  const { controllerName, controllerInstance, controllerRules, errors, ...other } = props

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      rules={controllerRules}
      render={({ field: { onChange, value } }) => (
        <DropZone
            selectedFiles={value}
            onSelect={(files) => { onChange(files) }}
            helperText={errors[controllerName]?.message}
            {...other}
        />
      )}
    />
  )
}
