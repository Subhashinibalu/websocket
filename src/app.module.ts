import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageGateway } from './gateway/message.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';



@Module({
  imports: [ ClientsModule.register([
    {
      name: 'COMMON_SERVICE',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port:  3003,
      },
    },])],
  controllers: [AppController],
  providers: [AppService, MessageGateway],
})
export class AppModule {}
