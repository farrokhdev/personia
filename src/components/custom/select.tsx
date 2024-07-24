import {ReactElement} from "react";
import styled from "styled-components";

const Select = styled.div`
  margin-bottom: 20px;

  > label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  > select {
    width: 100%;
    outline: none;
    border: 1px solid #cdcdcd;
    height: 45px;
    border-radius: 8px;
    padding: 0 10px;
    background: #FFFFFF;
  }
`

interface Props {
    name: string,
    label: string,
    onChange?: (value: any) => void,
    disabled?: boolean,
    value?: any,
    options: { value: string | number, text: string }[]
}

export function MySelect(props: Props): ReactElement {
    const {name, label, onChange, disabled = false, options = [], value} = props;

    return (
        <Select>
            <label>{label}</label>
            <select disabled={disabled}
                    name={name}
                    onChange={(e => {
                        if (onChange) {
                            onChange(e.target.value)
                        }
                    })}>
                {options.map((option, i) => (
                    <option key={i} selected={value === option.value} value={option.value}>{option.text}</option>
                ))}
            </select>

        </Select>
    )
}
