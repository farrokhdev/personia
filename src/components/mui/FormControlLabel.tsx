import React from 'react'
import { type FormControlLabelProps, FormControlLabel } from '@mui/material'
import styled from 'styled-components'

export const CFormControlLabel = styled((props: FormControlLabelProps) => (
    <FormControlLabel {...props} />
))`
    && {
        margin-left: 0;
        margin-right: 15px;
        flex-direction: row;

        > .MuiFormControlLabel-label {
            font-family: Inter;
            font-size: 16px;
            font-weight: 400;
            color: ${props => props.theme.black80};
            margin-right: 0;
            margin-left: 15px;
        }
    }
`
