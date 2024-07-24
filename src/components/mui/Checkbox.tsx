import { Checkbox } from '@mui/material'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'
import FormControlLabel, { type FormControlLabelProps } from '@mui/material/FormControlLabel'
import validator from 'validator'

const CFormControlLabelStyle = styled(FormControlLabel)<FormControlLabelProps>`
  && {
    margin-right: 0;

    &.Mui-disabled > span > svg {
      fill: ${({ theme }) => theme.blue60};
    }
  }
  
  && .MuiTypography-root {
    margin-right: 0;
    font-family: Inter;
    font-weight: bold;
    font-size: 14px;
    color: ${({ theme }) => theme.black80};
  }
`

const CCheckboxStyle = styled(Checkbox)`
  && svg {
    fill: ${({ theme }) => theme.blue100};
  }
`

const Text = styled.span`
  font-size: 10px;
  font-family: Inter;
  font-weight: normal;
  color: ${({ theme }) => theme.red120};
  display: block;
  margin: 3px 14px 0 14px;
`

export interface CCheckboxPropTypes extends Omit<FormControlLabelProps, 'control'> {
  helperText?: string
  marginBottom?: string
  defaultChecked?: boolean
  label: string
}

export function CCheckbox (props: CCheckboxPropTypes): ReactElement {
  const { helperText, marginBottom, defaultChecked, ...other } = props

  return (
        <div style={{ marginBottom }} >
            <CFormControlLabelStyle
                {...other}
                control={<CCheckboxStyle defaultChecked={defaultChecked ?? false} disableRipple={true} />}
            />
            {(helperText != null) && !validator.isEmpty(helperText)
              ? <Text>{helperText}</Text>
              : null
            }
        </div>
  )
}
