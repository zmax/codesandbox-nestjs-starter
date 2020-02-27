import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<html><head><script>
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = function() {
      console.log('Connected');
      socket.send(
        JSON.stringify({
          event: 'events',
          data: 'test',
        }),
      );
      socket.onmessage = function(data) {
        console.log(data);
      };
    };
  </script>
</head>

<body>Hello World!</body>
</html>`;
  }
}
