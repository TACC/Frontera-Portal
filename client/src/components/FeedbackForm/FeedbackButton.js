import React, { useEffect } from 'react';
import { Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import FeedbackModal from './FeedbackModal';
import './FeedbackButton.module.scss';

const FeedbackButton = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const creatingSuccess = useSelector(
    state => state.ticketCreate.creatingSuccess
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    if (creatingSuccess && mounted) {
      const toast = {
        pk: 'feedback-toast',
        event_type: 'generic',
        message: 'Feedback submitted',
        extra: {}
      };
      dispatch({
        type: 'ADD_TOAST',
        payload: toast
      });
      setOpenModal(false);
    }
    return () => (mounted = false);
  }, [creatingSuccess]);

  return (
    <>
      <Button
        styleName="button"
        color="link"
        data-testid="feedback-button"
        onClick={() => setOpenModal(true)}
      >
        Leave Feedback
      </Button>
      {openModal && (
        <FeedbackModal
          isOpen={openModal}
          toggle={() => setOpenModal(!openModal)}
        />
      )}
    </>
  );
};

export default FeedbackButton;
