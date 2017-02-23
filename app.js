var express = require("express");
var app = express();
var port = 3700;
var path = require("path");
var static = require("serve-static");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

var index = require(path.join(__dirname,"routes/index.js"));
var room = require(path.join(__dirname,"routes/room.js"));

app.use("/",index);
app.use("/room",room);

app.use(static(path.join(__dirname,"bower_components")));
app.use(static(path.join(__dirname,"public")));

///////////////////////////////////

var users = [];
var users_sockets = [];
var messages=[];

var io = require('socket.io').listen(app.listen(port,function() {

  console.log("socket io connected");

}));



io.sockets.on('connection', function (socket) {

  socket.on('join', function (data) {

    add_new_user(data,socket);
    send_last_messages(socket);

  });

  socket.on('user_message', function (data) {

    messages[messages.length] = data;
   
    notify_users_new_msg(data);

  });

  socket.on('private_message', function (data) {


       send_private_message(data);

  });

  socket.on('close_chat', function (data) {


     disconnect_user(data);

  });

  socket.on('vu', function (data) {


    set_vu(data);

  });
});


app.listen(8071,function() {

  console.log("server connected")

})

  function add_new_user(data,socket) {

    console.log("add_new_user")

    if (!user_exist(data)) {

      users.push({username : data});

      users_sockets[users_sockets.length] = socket;

    }else {

      var index = get_user_index(data);

      users_sockets[index] = socket;

    }

    notify_users_list();

  }

  function notify_users_list() {

    console.log("notify_users_list")

    for (var i = 0; i < users.length; i++) {

      if (users[i].username != null)
      users_sockets[i].emit('users-list', users);
    }

  }

    function user_exist(username) {

      var i;

      for(i=0;i<users.length;i++) {
        if (users[i].username == username) break;
      }

      if (i==users.length) return false;
      else return true;


    }

    function get_user_index(username) {


      var i;

      for(i=0;i<users.length;i++) {
        if (users[i].username == username) break;
      }


      return i;
    }

   function notify_users_new_msg(msg) {

     var username = msg.split(":");
     username = username[0].trim();

     console.log(username)
     for (var i = 0; i < users.length; i++) {

       if (users[i].username != username && users[i].username != null) {
         users_sockets[i].emit('new_message', msg);
       }else {
         console.log("sender")
       }

     }

   }

  function send_last_messages(socket) {

    var last_msgs = [];

    var val=0;

    if (messages.length > 5) val =  messages.length -5;

    for(var i=val;i<messages.length;i++) {

      last_msgs.push(messages[i]);
    }

    socket.emit("last_messages",last_msgs);

  }


function send_private_message(msg) {

  var msg_info = msg.split(":");

  var receiver = msg_info[0];
  var sender = msg_info[1];
  var msg = msg_info[2];

  for(var i=0;i<users.length;i++) {

    console.log(users[i].username+":"+receiver)
    if(users[i].username == receiver) {



      users_sockets[i].emit("new_private_message",sender+" : "+msg);
      console.log("send msg success to"+receiver)
      break;
    }
  }
}

function disconnect_user(username) {

  for(var i=0;i<users.length;i++) {

    if(users[i].username == username) {

       users[i].username = null;
       users_sockets[i] = null;

      notify_users_list();
    }


  }

}


function set_vu(data) {

  var user = data.split(":");

  var receiver = user[0];
  var sender = user[1];


  for(var i=0;i<users.length;i++) {


    if(users[i].username == receiver) {

      users_sockets[i].emit("user_vu",sender);
      console.log(sender)
      break;
    }
  }

}
