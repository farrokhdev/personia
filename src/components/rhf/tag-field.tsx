import React, { type ReactElement, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form';
import { type CTextFieldPropType } from '../mui';
import { WithContext as ReactTags } from 'react-tag-input';

interface Props {
  controllerName: string;
  controllerInstance: any;
  controllerRules?: any;
  errors: any;
  normal?: boolean;
  tags: Array<{ id: string, text: string }>;
  handleDelete: (index: number) => void;
  handleAddition: (tag: any) => void;
}

export function ControllerTagField(
  props: Omit<CTextFieldPropType, 'value' | 'onChange' | 'helperText'> & Props
): ReactElement {
  const {
    controllerName,
    controllerInstance,
    controllerRules,
    normal,
    tags,
    handleDelete,
    handleAddition,
  } = props;

  return (
    <Controller
      name={controllerName}
      control={controllerInstance}
      rules={controllerRules}
      render={({ field: { onChange, value } }) => (
        normal ?
          <input type='text' value={value !== undefined ? value : ''}
                 onChange={onChange} disabled={true}
                 style={{ background: 'transparent', border: 'none', color: '#ffffff' }} />
          :
          <ReactTags
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            placeholder={props.placeholder}
            inputFieldPosition='top'
            allowDragDrop={false}
            autocomplete
            autofocus={false}
          />
      )}
    />
  );
}
