import React from 'react';
import { socketOn, socketEmit } from '../helpers/socketEvents';
import { sidebarOpen } from '../helpers/sidebarToggle';
import LoginPage from './LoginPage';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Message from './Message';
import MyMessage from './MyMessage';
import More from 'react-icons/lib/fa/bars';
import Palette from 'react-icons/lib/md/palette';
import Send from 'react-icons/lib/md/send';

class ChatApp extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null,
      users: [],
      room: null,
      rooms: []
    };

    socketOn.updateUser((user) => {
      this.setState({ user: user });
    });

    socketOn.updateUsers((users) => {
      this.setState({ users: users });
    });

    socketOn.updateRoom((room) => {
      this.setState({ room: room.name });
    });

    socketOn.updateRooms((rooms) => {
      this.setState({ rooms: rooms });
    });
  }

  sendMessage = (e) => {
    e.preventDefault();

    const text = e.target.elements.text.value.trim();

    if (text) {
      socketEmit.clientMessage(text, this.state.room);

      e.target.elements.text.value = '';
    }
  }

  switchRoom = (room) => {
    this.setState({ room: room });
  }

  openSidebar = (side) => {
    sidebarOpen(side);
  }

  componentDidUpdate() {
    const messages = document.getElementsByClassName('messages')[0];

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  render() {

    const currentRoom = this.state.rooms.find((room) => room.name === this.state.room);

    if (!this.state.user) {
      return <LoginPage />
    } else {
      return (
        <div className="chat-app">
          <SidebarLeft 
            user={this.state.user}
            users={this.state.users} 
            rooms={this.state.rooms} 
            switchRoom={this.switchRoom}
          />
          <div className="chat-content">
            <div className="topbar">
              <div className="more">
                <button onClick={() => this.openSidebar('left')} title="Show public chats & online users">
                  <More className="icon" size="22px"/>
                </button>
              </div>
              <div className="room-info">
                <p className="room-name">{this.state.room}</p>
                <p className="room-users">{this.state.room && (currentRoom.users.join(', ').length > 30 ? currentRoom.users.join(', ').slice(0, 30) + '...' : currentRoom.users.join(', '))}</p>
              </div>
              <div className="themes">
                <button onClick={() => this.openSidebar('right')} title="Change theme & background">
                  <Palette className="icon" size="24px" />
                </button>
              </div>
            </div>
            <div className="messages">
              {this.state.room && currentRoom.messages.map((message) => {
                if (message.sender.name === this.state.user.name) {
                  return <MyMessage message={message} />
                } else {
                  return <Message message={message} />
                }
              })}
            </div>
            <div className="chat-input">
              <form onSubmit={(e) => this.sendMessage(e)}>
                <input type="text" name="text" placeholder="Write message..." spellCheck="false" autoFocus autoComplete="off" />
                <button>
                  <Send className="send-icon" size="24px" />
                </button>
              </form>
            </div>
          </div>
          <SidebarRight />
        </div>
      );
    }
  }
}

export default ChatApp;