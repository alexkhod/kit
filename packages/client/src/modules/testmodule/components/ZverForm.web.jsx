import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import translate from '../../../i18n';
import Field from '../../../utils/FieldAdapter';
import { Form, RenderField, Button } from '../../common/components/web';
import { required, validateForm } from '../../../../../common/validation';

const zverFormSchema = {
  inv: [required],
  content: [required]
};

const validate = values => validateForm(values, zverFormSchema);

const ZverForm = ({ values, handleSubmit, submitting, t }) => {
  return (
    <Form name="zver" onSubmit={handleSubmit}>
      <Field name="inv" component={RenderField} type="text" label={t('zver.field.title')} value={values.inv} />
      <Field
        name="content"
        component={RenderField}
        type="text"
        label={t('zver.field.content')}
        value={values.content}
      />
      <Button color="primary" type="submit" disabled={submitting}>
        {t('zver.btn.submit')}
      </Button>
    </Form>
  );
};

ZverForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  values: PropTypes.object,
  zver: PropTypes.object,
  t: PropTypes.func
};

const ZverFormWithFormik = withFormik({
  mapPropsToValues: props => ({
    inv: props.zver && props.zver.inv,
    content: props.zver && props.zver.content
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
  displayName: 'ZverForm' // helps with React DevTools
});

export default translate('zver')(ZverFormWithFormik(ZverForm));
