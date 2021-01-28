import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { Alert, Button, FormGroup, Spinner } from 'reactstrap';
import { FormField } from '_common';
import * as Yup from 'yup';
import './FeedbackForm.module.scss';

const formSchema = Yup.object().shape({
  problem_description: Yup.string().required('Required')
});

const defaultValues = {
  problem_description: ''
};

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const authenticatedUser = useSelector(state => state.authenticatedUser.user);
  const creating = useSelector(state => state.ticketCreate.creating);
  const creatingError = useSelector(state => state.ticketCreate.creatingError);
  const creatingErrorMessage = useSelector(
    state => state.ticketCreate.creatingErrorMessage
  );

  if (authenticatedUser == null) {
    return <Spinner data-testid="loading-spinner" />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={defaultValues}
      validationSchema={formSchema}
      onSubmit={(values, { resetForm }) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => formData.append(key, values[key]));
        formData.append(
          'name',
          `${authenticatedUser.first_name} ${authenticatedUser.last_name}`
        );
        formData.append('email', authenticatedUser.email);
        formData.append('subject', 'Feedback for the Frontera Portal');
        dispatch({
          type: 'TICKET_CREATE',
          payload: {
            formData,
            resetSubmittedForm: resetForm,
            refreshTickets: true
          }
        });
      }}
    >
      {({ isSubmitting, dirty, isValid, submitCount }) => {
        return (
          <Form styleName="container">
            <FormGroup>
              <FormField
                name="problem_description"
                label="Feedback"
                type="textarea"
                styleName="comments-textarea"
                required
              />
            </FormGroup>
            <div className="ticket-create-button-row">
              {submitCount > 0 && creatingError && (
                <Alert color="warning">
                  Error submitting feedback: {creatingErrorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                color="primary"
                disabled={!dirty || !isValid || isSubmitting || creating}
              >
                {creating && (
                  <Spinner
                    size="sm"
                    color="white"
                    styleName="submit-spinner"
                    data-testid="creating-spinner"
                  />
                )}
                Submit
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FeedbackForm;
