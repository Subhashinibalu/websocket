import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './adapter/adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
   app.enableCors({
    origin: "*",
    methods: ['GET', 'POST'], 
    credentials: true,
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(3007);
  console.log('Microservice is listening');
}
bootstrap();
