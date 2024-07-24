import React, {ReactElement} from "react";
import styled from "styled-components";

const Box = styled.div<{ $margin: string, $padding: string }>`
  background: ${props => props.theme.gray80};
  border-radius: 8px;
  margin: ${({ $margin }) => $margin};
  padding: ${({ $padding }) => $padding};
  
  > span.material-symbols-outlined {
    display: block;
    margin: 0 auto 15px auto;
    text-align: center;
    color: ${props => props.theme.white100};
  }
  
  > span.title {
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.white100};
    text-align: center;
    display: block;
  }
`

interface Props {
    icon: string
    title: string
    margin?: string
    padding?: string
}

export function NothingFound(props: Props): ReactElement {
    const { icon, title, margin = '0 auto', padding = '15px' } = props;

    return(
        <Box $margin={margin} $padding={padding} className={'nothing-found'}>
            <span className='material-symbols-outlined'>{icon}</span>
            <span className='title'>{title}</span>
        </Box>
    )
}
