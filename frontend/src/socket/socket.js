import {io} from 'socket.io-client';
const apiUrl=process.env.REACT_APP_API_URL||'http://localhost:3001/api';
const SOCKET_URL=process.env.REACT_APP_SOCKET_URL||apiUrl.replace('/api', '');

// Vercel Serverless drops WebSockets. We disable autoConnect so it doesn't spam 404s.
const isVercel = SOCKET_URL.includes('vercel.app');

const socket=io(SOCKET_URL, {
  autoConnect: !isVercel,
  reconnection: !isVercel
});

export default socket;
