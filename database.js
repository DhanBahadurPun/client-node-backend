const mongoose = require("mongoose");
const config = require("./config/index");
mongoose.Promise = global.Promise;

mongoose
  .connect(`${config.app.dbUrl}/${config.app.dbName}`)
  .then(done =>
    console.log(`successfully connected to database ${config.app.dbName}`)
  )
  .catch(err =>
    console.log(`connection to database ${config.app.dbName} fails`)
  );

module.exports = mongoose;
