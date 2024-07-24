import styled from 'styled-components'

export interface SwitchComponentType {
  label: string
  checked: boolean
  onChange: (event: any) => void
}

const Switch = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
  right: 0;
  margin-top: 12px;

  > label {
    display: flex;

    > input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    > .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${({ theme }) => theme.white30};
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    > .slider:before {
      position: absolute;
      content: '';
      height: 14px;
      width: 14px;
      left: 4px;
      bottom: 5px;
      background-color: ${({ theme }) => theme.gray100};
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    > input:checked + .slider {
      background-color: ${({ theme }) => theme.white100};
    }

    > input:focus + .slider {
      box-shadow: 0 0 1px ${({ theme }) => theme.gray100};
    }

    > input:checked + .slider:before {
      -webkit-transform: translateX(14px);
      -ms-transform: translateX(14px);
      transform: translateX(14px);
    }

    /* Rounded sliders */

    > .slider.round {
      border-radius: 400px;
    }

    > .slider.round:before {
      border-radius: 50%;
    }

    > .label {
      margin-left: 50px;
      color: ${({ theme }) => theme.white100};
      font-family: Inter;
    }
  }
`

export default function SwitchComponent(props: SwitchComponentType) {
  return (
    <Switch>
      <label>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={props.onChange}
        />
        <span className="slider round"></span>
        <span className={'label'}>{props.label}</span>
      </label>
    </Switch>
  )
}
