const { Server } = require('socket.io');
const User = require('../models/User');
const Dealership = require('../models/Dealership');

class ServerIO {
  constructor() {
    this.io = null;
  }

  init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:8080", "http://localhost:8081"]
      }
    })
    // start the socket
    this.io.on("connection", async (socket) => {
      // get the user id from the socket headers
      const userId = socket.handshake.headers.user_id
      // initialize the rooms to join
      const rooms = [];

      // if no user id passed in the headers, disconnect the socket
      if (!userId) {
        console.log("No userId found, disconnecting socket.");
        socket.disconnect();
      } else {
        // get the user
        const user = await User.findById(userId);

        // if no user found, disconnect the socket
        if (!user) {
          console.log("No user found, disconnecting socket.");
          socket.disconnect();
        } else {
          // if the user is an admin, we need to get all the dealerships that are registered to this admin
          // and join each room
          if (user.role == "Administration") {
            // find all the dealerships registered to this admin
            const dealerships = await Dealership.find({ admin: userId });
            // add all the dealerships IDs to the rooms array
            dealerships.forEach(dealership => {
              rooms.push(dealership._id.toString());
            })
          } else {
            // get the dealership ID from this user and add it to the rooms array
            rooms.push(user.dealership.toString())
          }

          // join every room inside the rooms array
          this.subscribe({ socket, rooms });
          // rooms.forEach(room => {
          //   socket.join(room);
          // })
        }
      }
      socket.emit("connected", "Connected to server socket");
    });
    this.io.on("disconnect", (socket) => {
      console.log("Socket " + socket.id + " disconnected.");
    });
  }

  subscribe(subscriber) {
    subscriber.rooms.forEach(room => {
      subscriber.socket.join(room);
      console.log("Joined room " + room);
    });
  }

  notifySubscribers(event) {
    const room = event.dealership.toString();

    this.io.to(room).emit(event.event_type, event);
  }

  getServerIO() {
    return this.io;
  }
}

class IO {
  constructor() {
    throw new Error('Use the getInstance() method on the singleton object');
  }

  static getInstance() {
    if (!IO.instance) {
      IO.instance = new ServerIO();
    }

    return IO.instance;
  }
}

module.exports = IO;
