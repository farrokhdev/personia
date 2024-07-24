import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { CSkeleton } from '../mui';
import { educationModel } from '../../models/education.model'

const EducationStyle = styled.div`
  margin-top: 20px;
  border-radius: 12px;
  display: flex;

  .material-symbols-outlined {
    color: ${(props) => props.theme.white40};
    font-size: 35px;
    margin-right: 10px;
  }

  > .row {
    display: block;

    > label {
      color: ${(props) => props.theme.white40};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
      margin-top: 10px;
      margin-bottom: 10px;
      margin-right: 10px;
      text-align: center;
    }

    > p {
      color: ${(props) => props.theme.white40};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-top: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      white-space: pre-line;
    }

    > strong {
      color: ${(props) => props.theme.white40};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px;
      margin-top: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    > small {
      color: ${(props) => props.theme.white40};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: 22px;
      margin-top: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
`;

interface Props {
  education?: educationModel;
  loading?: boolean;
}

export function EducationBox(props: Props): ReactElement {

  return (
    <EducationStyle>
      <span className='material-symbols-outlined'>school</span>

      <div className={'row'}>
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <strong>{props.education?.school} <small>({props.education?.city})</small></strong>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{props.education?.title}</p>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{props.education?.startDate?.toString()} - {props.education?.endDate?.toString()}</p>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{decodeURIComponent(props.education?.description ?? '')}</p>
        )}
      </div>
    </EducationStyle>
  );
}