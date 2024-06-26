import Main from '../Main/Main';
import './App.css';
import * as Api from './../../utils/utils';
import { useEffect, useState } from 'react';
import { HistoryItem } from '../IconsContainer/IconsContainer';
import { Message } from './../Chat/Chat';

export default function App() {
  const [history, getHistory] = useState<HistoryItem[]>([]);
  const [historyMess, getHistoryMess] = useState<Message[]>([]);
  const [messId, getMessId] = useState<string>('');
  const [chat, setChat] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  function openChat() {
    const chatId = localStorage.getItem('chatId');
    if (chatId) {
      setChat(chatId);
      Api.getChat(chatId).then((data) => {
        getHistory(data.dialogs);
        getMessId(data.dialogs[0]?.id);
      });
    } else {
      Api.postChat()
        .then((data) => {
          setChat(data.id);
          localStorage.setItem('chatId', data.id);
          Api.getChat(data.id).then((data) => {
            getHistory(data?.dialogs);
            getMessId(data.dialogs[0]?.id);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function getChat() {
    const chatId = localStorage.getItem('chatId');
    if (chatId !== null) {
      Api.getHistoryDialog(chatId, messId)
        .then((data) => {
          getHistoryMess(data.messages);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('chatId is null');
    }
  }

  useEffect(() => {
    openChat();
  }, []);

  useEffect(() => {
    const chatId = localStorage.getItem('chatId');
    if (chatId) {
      Api.getDialog(chatId)
        .then((data) => {
          console.log('GET Dialog: ', data);
        })
        .catch((error) => {
          console.error(error);
        });
      Api.postDialog(chatId)
        .then((data) => {
          console.log('POST Dialog: ', data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [chat]);

  function sendMessage(message: string) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageObj: Message = {
        text: message,
        sender_type: 'user',
      };
      socket.send(JSON.stringify(messageObj));
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  useEffect(() => {
    if (chat && messId) {
      const newSocket = new WebSocket(
        `wss://vink-chat.ddns.net/ws/chat/${chat}/dialog/${messId}/`
      );
      setSocket(newSocket);
    }
  }, [chat, messId]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        getHistoryMess((prevMessages) => [...prevMessages, messageData]);
      };
    }
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  return (
    <div className='body'>
      <Main
        openChat={openChat}
        history={history}
        getChat={getChat}
        historyMess={historyMess}
        sendMessage={sendMessage}
      />
    </div>
  );
}
