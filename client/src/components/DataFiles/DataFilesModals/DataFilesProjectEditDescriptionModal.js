import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import FormField from '_common/Form/FormField';
import { LoadingSpinner } from '_common';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './DataFilesProjectEditDescription.module.scss';

const DataFilesProjectEditDescriptionModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.files.modals.editproject);
  const { title, description } = useSelector(state => state.projects.metadata);
  const isUpdating = useSelector(state => {
    return (
      state.projects.operation &&
      state.projects.operation.name === 'editDescription' &&
      state.projects.operation.loading
    );
  });
  const updatingError = useSelector(state => {
    return (
      state.projects.operation &&
      state.projects.operation.name === 'editDescription' &&
      state.projects.operation.error
    );
  });

  const initialValues = useMemo(
    () => ({
      title,
      description
    }),
    [title, description]
  );

  const toggle = () => {
    dispatch({
      type: 'DATA_FILES_TOGGLE_MODAL',
      payload: { operation: 'editproject', props: {} }
    });
  };

  const editProject = values => {
    dispatch({
      type: 'PROJECTS_EDIT_METADATA',
      payload: {
        title: values.title,
        description: values.description
      }
    });
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(1)
      .required('Please enter a title.'),
    description: Yup.string()
  });

  return (
    <Modal size="lg" isOpen={isOpen} toggle={toggle} className="dataFilesModal">
      <ModalHeader toggle={toggle}>Edit Descriptions</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          onSubmit={editProject}
          validationSchema={validationSchema}
        >
          <Form>
            <FormField name="title" label="Workspace Title" />
            <FormField
              name="description"
              label="Workspace Description"
              type="textarea"
              styleName="description-textarea"
            />
            <div styleName="button-container">
              <Button
                type="submit"
                className="data-files-btn"
                styleName="update-button"
                disabled={isUpdating}
              >
                {isUpdating && <LoadingSpinner placement="inline" />}
                {updatingError && (
                  <FontAwesomeIcon icon={faExclamationCircle} />
                )}
                Update Changes
              </Button>
            </div>
          </Form>
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default DataFilesProjectEditDescriptionModal;
