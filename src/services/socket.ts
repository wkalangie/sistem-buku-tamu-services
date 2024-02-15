import { Server } from 'socket.io';
import { config } from '../config';
import Logging from '../utils/Logging';
import AuthGuard from '../middleware/authentication';

let elements: any[] = [];

const updateElementInElements = (elementData: any) => {
  const index = elements.findIndex((element) => element.id === elementData.id && element.room === elementData.room);
  if (index === -1) return elements.push(elementData);

  elements[index] = elementData;
};

export default class socketConnection {
  public static socketConnect = (server: any, option: any) => {
    const io = new Server(server, option);
    io.use(AuthGuard.checkAccessSocketToken);

    io.on('connection', (socket) => {
      console.log('user connected', socket.id);

      // ======================== WHITEBOARD SERVICES  ======================== //
      // io.to(socket.id).emit('whiteboard-state', elements);
      socket.on('join-room', (room) => {
        socket.join(room);
        socket.emit(
          'whiteboard-state',
          elements.filter((i) => i.room === room)
        );
      });

      socket.on('leave-room', (room) => {
        socket.leave(room);
        socket.to(room).emit('user-disconnected', socket.id);
      });

      socket.on('element-update', (elementData) => {
        updateElementInElements(elementData);
        socket.to(elementData.room).emit('element-update', elementData);
      });

      socket.on('whiteboard-clear', (room) => {
        elements = [];
        socket.to(room).emit('whiteboard-clear');
      });

      socket.on('cursor-position', (cursorData) => {
        socket.to(cursorData.room).emit('cursor-position', { ...cursorData, userId: socket.id });
      });

      socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', socket.id);
      });
    });

    const PORT = config.server.port;

    // server.listen(PORT, '192.168.1.101', () => Logging.info(`Server is running on port ${config.server.port}.`));
    server.listen(PORT, () => Logging.info(`Server is running on port ${config.server.port}.`));
  };
}
