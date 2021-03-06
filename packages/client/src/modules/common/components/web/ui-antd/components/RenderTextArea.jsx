import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { FormItem } from './index';

const { TextArea } = Input;

export default class RenderTextArea extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
    formItemLayout: PropTypes.object,
    hasTypeOf: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  render() {
    const {
      input,
      label,
      formItemLayout,
      meta: { touched, error }
    } = this.props;

    let validateStatus = '';
    if (touched && error) {
      validateStatus = 'error';
    }

    return (
      <FormItem label={label} {...formItemLayout} validateStatus={validateStatus} help={touched && error}>
        <div>
          <TextArea {...input} placeholder={label} autosize />
        </div>
      </FormItem>
    );
  }
}
