const hbs = require( 'express-handlebars');
const express = require('express');
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser')

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const session = require('express-session')({
  secret: 'fesmkfei3jriu48uhfhe834u83u8sfu8e',
  cookie: {}
});


const loginRouter = require('./routes/login');
const dashboardRouter = require('./routes/dashboard');

const messages = require('./controllers/messages');

const port = 3000;

app.use(session);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

io.use(sharedsession(session, {
  autoSave:true
})); 
// view engine setup
app.set('view engine', 'hbs');

app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultView: 'default',
  defaultLayout: 'notLogged'
}));
app.use(loginRouter);
app.use(dashboardRouter);

const userSockets = [];

//only logged in  users will connect to socket
io.on('connection', (socket) => {
  if(socket.handshake.session.user) {
    console.log('a user connected');
    let userID = socket.handshake.session.user.id;
    if(!userSockets[userID]) {
      userSockets[userID] = [];
    }
    userSockets[userID].push(socket.id);
    
    messages.getConversations(userID, (conversations) => {
      socket.emit('conversations', conversations);
    })

    socket.on('getChat', (id) => {
      messages.getMessages(id, userID, (messages) => {
        socket.emit('chat', messages);
      })
    })
    socket.on('newMessage', (receiverID, message) => {
      if(!receiverID) {
        return;
      }
      if(!message) {
        return;
      }
      messages.insertMessage(userID, receiverID, message);
      let messageObj = {
        senderID: userID,
        receiverID: receiverID,
        read: 0,
        message: message,
        creation: new Date(),
        receiver: 0
      }
      socket.emit('message', messageObj);
      if(userSockets[receiverID]) {
        messageObj.receiver = 1;
        userSockets[receiverID].forEach((recSock) => {
          io.to(recSock).emit('message', messageObj);
        })
      }
    })
    socket.on('disconnect', () => {
      userSockets[userID] = userSockets[userID].filter(item => item !== socket.id);
      console.log('socket disconnected');
    })

  }
});

http.listen(port, () => console.log(`App listening on port ${port}!`))