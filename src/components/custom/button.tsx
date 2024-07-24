import {ReactElement} from "react";
import styled from "styled-components";

// eslint-disable-next-line no-mixed-operators
const Button = styled.button<{ $bg: string, $color: string, $margin?: string }>`
  padding: 10px 20px;
  border-radius: 8px;
  outline: none;
  border: none;
  text-align: center;
  font-weight: bold;
  background: ${({$bg}) => $bg};
  color: ${({$color}) => $color};
  margin: ${({$margin}) => $margin != null ? $margin : '0'};

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.7;

    &:hover {
      cursor: not-allowed;
    }
  }
`

interface Props {
    bg?: string,
    color?: string,
    label: string,
    onClick?: () => void,
    loading?: boolean
    disabled?: boolean
    margin?: string
}

export function MyButton(props: Props): ReactElement {
    const {bg = '#6495ED', color = '#FFFFFF', label, onClick, loading = false, disabled = false, margin} = props;

    return (
        <Button
            $bg={bg}
            $color={color}
            onClick={onClick}
            disabled={loading || disabled}
            $margin={margin}
        >
            {loading ? 'Loading' : label}
        </Button>
    )
}
