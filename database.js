const mongoose = require("mongoose");
const config = require("./config/index");
mongoose.Promise = global.Promise;

mongoose
  .connect(`${config.dbUrl}/${config.dbName}`)
  .then(done =>
    console.log(`successfully connected to database ${config.dbName}`)
  )
  .catch(err =>
    console.log(`connection to database ${config.dbName} fails`)
  );

module.exports = mongoose;
