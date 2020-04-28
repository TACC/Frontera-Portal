import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { Formik, Form } from 'formik';
import { object as obj, string as str } from 'yup';
import { pick, isEmpty } from 'lodash';
import { LoadingSpinner } from '_common';
import { bool } from 'prop-types';
import { ManageAccountInput } from './ManageAccountFields';

const RequiredInformationFormBody = ({ canSubmit }) => {
  const isEditing = useSelector(state => state.profile.editing);
  return (
    <Form>
      {/* TAS Fields - Text */}
      <ManageAccountInput label="First Name" name="firstName" />
      <ManageAccountInput label="Last Name" name="lastName" />
      <ManageAccountInput label="Email Address" name="email" />
      <ManageAccountInput label="Phone Number" name="phone" />
      {/* TAS Fields - Select */}
      <ManageAccountInput
        label="Institution"
        name="institutionId"
        type="select"
      />
      <ManageAccountInput label="Position/Title" name="title" type="select" />
      <ManageAccountInput label="Residence" name="countryId" type="select" />
      <ManageAccountInput
        label="Citizenship"
        name="citizenshipId"
        type="select"
      />
      {/* Django Fields */}
      <ManageAccountInput label="Ethnicity" name="ethnicity" type="select" />
      <ManageAccountInput label="Gender" name="gender" type="select" />
      <Button
        type="submit"
        className="manage-account-submit-button"
        disabled={!canSubmit}
      >
        {isEditing ? <LoadingSpinner placement="inline" /> : 'Submit'}
      </Button>
    </Form>
  );
};
RequiredInformationFormBody.propTypes = { canSubmit: bool.isRequired };

export default function() {
  const { initialValues, fields } = useSelector(({ profile }) => {
    const { data } = profile;
    const { demographics } = data;
    const initial = pick(demographics, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'ethnicity',
      'gender',
      'institutionId',
      'countryId',
      'citizenshipId',
      'title',
      'institutionId'
    ]);
    return {
      fields: profile.fields,
      initialValues: {
        ...initial,
        institution: initial.institutionId,
        country: initial.countryId,
        citizenship: initial.citizenshipId
      },
      isEditing: profile.editing
    };
  });
  const dispatch = useDispatch();
  const formSchema = obj().shape({
    firstName: str()
      .min(2)
      .required('Please enter your first name'),
    lastName: str()
      .min(1)
      .required('Please enter your last name'),
    email: str()
      .required('Please enter your email address')
      .email('Please enter a valid email address'),
    phone: str().matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      'Phone number is not valid'
    )
  });
  const handleSubmit = (values, { setSubmitting }) => {
    dispatch({
      type: 'EDIT_REQUIRED_INFORMATION',
      values
    });
    setSubmitting(false);
  };
  const hasErrors = errors => isEmpty(Object.keys(errors));
  if (!fields.ethnicities) return <LoadingSpinner />;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
    >
      {({ errors }) => (
        <RequiredInformationFormBody canSubmit={hasErrors(errors)} />
      )}
    </Formik>
  );
}
