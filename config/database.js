const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`Database Connected on port ${conn.connection.port}...`);
    })

};

module.exports = dbConnection;
