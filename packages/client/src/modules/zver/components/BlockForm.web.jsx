import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const blockFormSchema = {
  inv: [required],
  content: [required]
};

const validate = values => validateForm(values, blockFormSchema);

const BlockForm = ({ values, handleSubmit, submitting, t }) => {
  return (
    <Form name="block" onSubmit={handleSubmit}>
      <Field name="inv" component={RenderField} type="text" label={t('block.field.title')} value={values.inv} />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label={t('block.field.content')}
        value={values.content}
      />
      <Button color="primary" type="submit" disabled={submitting}>
        {t('block.btn.submit')}
      </Button>
    </Form>
  );
};

BlockForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  block: PropTypes.object,
  t: PropTypes.func
};

const BlockFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    inv: props.block && props.block.inv,
    content: props.block && props.block.content
  }),
  validate: values => validate(values),
  handleSubmit(
    values,
    {
      props: { onSubmit }
    }
  ) {
    onSubmit(values);
  },
  enableReinitialize: true,
  displayName: 'BlockForm' // helps with React DevTools
});

export default translate('zver')(BlockFormWithFormik(BlockForm));
