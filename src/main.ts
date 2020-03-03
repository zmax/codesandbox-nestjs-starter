import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { RenderModule } from 'nest-next';
import Next from 'next';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const app = Next({ dev });
  await app.prepare();
  
  const server = await NestFactory.create(AppModule);
  server.useWebSocketAdapter(new WsAdapter(server));

  const renderer = server.get(RenderModule);
  renderer.register(server, app);
  
  await server.listen(process.env.PORT || 3000);
}

bootstrap();
