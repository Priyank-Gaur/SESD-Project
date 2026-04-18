import {io} from 'socket.io-client';
const apiUrl=process.env.REACT_APP_API_URL||'http://localhost:3001/api';
const SOCKET_URL=process.env.REACT_APP_SOCKET_URL||apiUrl.replace('/api', '');
const socket=io(SOCKET_URL, {autoConnect: true});
export default socket;
