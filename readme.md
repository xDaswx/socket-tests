I created a simple chat using socket.io with nodejs  of course putting all the necessary protections against XSS on the server side and on the client side
The platform I deployed it to doesn't work very well with websocket system as it's a free platform, http://localhost/ is a better way to test this.

How to run the application:

1 - git clone https://github.com/xDaswx/socket-tests.git

in socket-tests folder:
npm install

npm run dev

after run:
go to http://localhost/



deploy can be made for free on platforms like glitch.com
https://glitch.com/dashboard

my deployment is:
https://everlasting-clover-bird.glitch.me/chat