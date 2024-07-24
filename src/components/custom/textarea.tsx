import {ReactElement} from "react";
import styled from "styled-components";

const TextArea = styled.div`
  margin-bottom: 20px;

  > label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  > textarea {
    width: 100%;
    outline: none;
    border: 1px solid #cdcdcd;
    height: 200px;
    border-radius: 8px;
    padding: 10px;
    background: #FFFFFF;
  }
`

interface Props {
    name: string,
    placeholder: string,
    label: string,
    onChange?: (value: any) => void,
    disabled?: boolean,
    value?: any
    rows?: number
}

export function MyTextArea(props: Props): ReactElement {
    const {name, label, placeholder, onChange, disabled = false, value, rows = 5} = props;

    return (
        <TextArea>
            <label>{label}</label>
            <textarea
                rows={rows}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => {
                    if (onChange != null) {
                        onChange(e.target.value)
                    }
                }}
                value={value}
            />
        </TextArea>
    )
}
