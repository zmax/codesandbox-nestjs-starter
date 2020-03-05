import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RenderModule } from 'nest-next';
// import { Res } from '@nestjs/common';
// import { RenderableResponse } from 'nest-next';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [RenderModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
  it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello().title).toContain('Hello World!');
    });
  });
});
