import React from 'react'
import { Switch, type SwitchProps } from '@mui/material'
import styled from 'styled-components'

export const CSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))`
    && {
        width: 36px;
        height: 20px;
        padding: 0;

        & .MuiSwitch-switchBase {
            padding: 0;
            margin: 2px;
            transition-duration: 300ms;
            color: ${props => props.theme.black40} !important;

            &.Mui-checked {
                transform: translateX(16px);
                color: ${props => props.theme.blue100} !important;

                & + .MuiSwitch-track {
                    background-color: ${props => props.theme.lightBlue60} !important;
                    opacity: 1;
                    border: 0;
                }

                &.Mui-disabled + .MuiSwitch-track {
                    opacity: 0.5;
                }
            }

            &.Mui-focusVisible .MuiSwitch-thumb {
                color: ${props => props.theme.blue100} !important;
                border: 6px solid ${props => props.theme.blue100} !important;
            }

            &.Mui-disabled .MuiSwitch-thumb {
                color: ${props => props.theme.black8} !important;
            }

            &.Mui-disabled + .MuiSwitch-track {
                opacity: 0.7;
            }
        }

        & .MuiSwitch-thumb {
            box-sizing: 'border-box';
            width: 16px;
            height: 16px;
        }

        & .MuiSwitch-track {
            border-radius: 10px;
            background-color: ${props => props.theme.black8} !important;
            opacity: 1;
            transition: background-color 500ms;
        }
    }
`
