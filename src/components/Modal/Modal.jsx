import { ModalWindow, ModalWindowImg, Overlay } from './Modal.styled';
import PropTypes from 'prop-types';

export const Modal = ({ largeImage, overlayClick }) => {
  return (
    <Overlay onClick={overlayClick}>
      <ModalWindow>
        <ModalWindowImg src={largeImage} alt={largeImage} />
      </ModalWindow>
    </Overlay>
  );
};

Modal.propTypes = {
  largeImage: PropTypes.string.isRequired,
  overlayClick: PropTypes.func.isRequired,
};
