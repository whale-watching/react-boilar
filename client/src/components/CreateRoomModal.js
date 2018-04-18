import React from 'react';
import Modal from 'react-modal';
import { socketEmit } from '../socketEvents';

class CreateRoomModal extends React.Component {

  createRoom = (e) => {
    e.preventDefault();

    const roomName = e.target.elements.roomName.value;
    e.target.elements.roomName.value = '';

    socketEmit.joinRoom(roomName);

    this.props.onRequestClose();
  }

  render() {
    return (
      <Modal
        className="login-modal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <form onSubmit={this.createRoom}>
          <h3>Enter room name</h3>
          <input type="text" name="roomName" autoFocus />
        </form>
      </Modal>
    )
  }
}

export default CreateRoomModal;