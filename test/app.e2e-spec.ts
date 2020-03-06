import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();
  });

  afterAll(done => {
    app.close();
    done();
  });

  it('/ (GET)', done => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .end((err, res) => {
        expect(res.text).toContain('Hello World!');
        done();
      });
  });
});
