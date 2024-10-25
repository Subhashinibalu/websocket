import { WebSocketGateway, WebSocketServer, OnGatewayInit, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
      origin: 'http://localhost:5173', // Replace with your React app's URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
handlesendMessage(@MessageBody() data:any) {
  console.log("<---------------------------->",{data}); 
 this.server.emit("message","Welcome ")
}
}
