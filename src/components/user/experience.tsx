import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { CSkeleton } from '../mui';
import { experienceModel } from '../../models/experience.model'

const ExperienceStyle = styled.div`
  margin-top: 20px;
  border-radius: 12px;
  display: flex;

  .material-symbols-outlined {
    color: ${(props) => props.theme.white40};
    font-size: 30px;
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
  experience?: experienceModel;
  loading?: boolean;
}

export function ExperienceBox(props: Props): ReactElement {

  return (
    <ExperienceStyle>

      <span className='material-symbols-outlined'>work</span>

      <div className={'row'}>
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <strong>{props.experience?.company} <small>({props.experience?.city})</small></strong>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{props.experience?.title}</p>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{props.experience?.startDate?.toString()} - {props.experience?.endDate?.toString()}</p>
        )}
        {props.loading ? (
          <CSkeleton width={100} height={10} borderRadius={'12px'} marginBottom={'3px'} />
        ) : (
          <p>{decodeURIComponent(props.experience?.description ?? '')}</p>
        )}
      </div>
    </ExperienceStyle>
  );
}