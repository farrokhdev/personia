import { type ReactElement } from 'react';
import { Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface Props {
  controllerName: string;
  controllerInstance: any;
  controllerRules?: any;
  label: string;
}

export function ControllerDaypickerField(props: Props): ReactElement {
  const { label, controllerName, controllerInstance, controllerRules } = props;
  return (
    <div className={'datepicker'}>
      <Controller
        name={controllerName}
        control={controllerInstance}
        rules={controllerRules}
        render={({ field: { onChange, value } }) => {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DemoItem label={label}>
                  <DatePicker
                    defaultValue={value != null ? dayjs(value) : null}
                    className={'datepicker'}
                    onChange={(val) => {
                      onChange(
                        val
                          ? `${val?.toDate()?.getFullYear()}-${(
                            val?.toDate()?.getMonth() + 1
                          )
                            ?.toString()
                            ?.padStart(2, '0')}-${val
                            .toDate()
                            ?.getDate()
                            .toString()
                            .padStart(2, '0')}`
                          : null
                      );
                    }}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          );
        }}
      />
    </div>
  );
}
