import {Server} from 'socket.io';
export const initAlertSocket=(io: Server): void=>{
  io.on('connection', (socket)=>{
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', ()=>{
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
