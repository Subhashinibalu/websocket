import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
    cors: {
      origin: '*', 
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
  export class MessageGateway {
    @WebSocketServer()
    server: Server; 
  
    private connectedUsers = new Map<string, Socket>();
  
    constructor(@Inject('COMMON_SERVICE') private client: ClientProxy) {}
  
    @SubscribeMessage('join')
    async handleJoin(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
      socket.join(data.id);
      
      if (data.who === "user") {
        console.log(data.id);
        this.connectedUsers.set(data.id, socket);
        socket.join("user");
  
        try {
        
            const result = await this.client.send({ cmd: 'upsert_ticket' }, {sessionId:data.id}).toPromise();
            console.log('Upsert result:', result); 
        } catch (error) {
          console.error("Error sending to microservice:", error);
        }
      } else if (data.who === "admin") {

        socket.join("admin"); 
      }
    }
  
    @SubscribeMessage('message')
   async handleSendMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
      console.log("Received message:", data);    
  
      if (data.who === "user") {
        socket.to("admin").emit("message", { message: data.message, from: data.id, email: data.from });   
        try {
           
            const result = await this.client.send({ cmd: 'upsert_chat' }, { message: data.message, from: data.id, email: data.from  }).toPromise();
            console.log('Upsert :', result); 
          } catch (error) {
            console.error("Error sending to microservice:", error);
          }  
    } else if (data.who === "admin") {
        console.log(data);
//         const result = await this.client.send({ cmd: 'upsert_admin_chat' }, { message: data.message, from: data.id, email: data.from ,who:data.who }).toPromise();
//   console.log(result);   
        socket.to(data.to).emit("message", { message: data.message, from: data.id, email: data.from });
        socket.to("admin").emit("message", { message: data.message, from: data.id, email: data.from });       
      }
    }
  }
  