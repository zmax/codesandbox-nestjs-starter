import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import { RenderableResponse } from 'nest-next';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('Index')
  getHello(
    // @Res() res: RenderableResponse
  ) {
    // return this.appService.getHello();
    // return 'Hello World';
    // res.render('Index', {
    //   title: 'Next with Nest'
    // });
    return {
      tile: 'Next with Nest'
    }
  }
}
