import React, { ReactElement } from 'react';
import styled from 'styled-components';

export interface StyledInputType {
  $background: string;
  $height: string;
  $color: string;
  $border: string;
}

const Input = styled.div <StyledInputType>`
  display: flex;
  border: 1px solid ${({ theme, $border }) => theme[$border]};
  border-radius: 8px;
  align-items: center;
  width: 100%;

  > label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    color: ${({ theme, $color }) => theme[$color]};
  }

  > input {
    width: 100%;
    outline: none;
    height: ${({ $height }) => $height}px;
    color: ${({ theme, $color }) => theme[$color]};
    background: ${({ theme, $background }) => theme[$background]};
    padding: 0 10px;
    border: none;
  }

  > .material-symbols-outlined {
    background: ${({ theme, $background }) => theme[$background]};
    color: ${({ theme, $color }) => theme[$color]};
    height: ${({ $height }) => $height}px;
    padding: 5px;
  }
`;

interface Props {
  name: string,
  placeholder: string,
  label: string,
  onChange?: (value: any) => void,
  onClick?: () => void,
  disabled?: boolean,
  type?: 'text' | 'email' | 'password' | 'file',
  value?: any
  icon?: string,
  background?: string,
  height?: string,
  color?: string,
  border?: string,
}

export function MyInput(props: Props): ReactElement {
  const {
    name,
    label,
    placeholder,
    onChange,
    onClick,
    disabled = false,
    type = 'text',
    value,
    icon,
    background = 'white100',
    height = '35',
    color = 'black100',
    border = 'black100'
  } = props;

  return (
    <Input $background={background}
           $height={height}
           $border={border}
           $color={color}
           onClick={onClick}>
      <label>{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={'off'}
        onChange={(e) => {
          if (onChange != null) {
            if (type === 'file') {
              onChange(e.target.files);
            } else {
              onChange(e.target.value);
            }
          }
        }}
        type={type}
        value={value}
      />
      {icon != null ? <span className='material-symbols-outlined'>{icon}</span> : null}
    </Input>
  );
}
