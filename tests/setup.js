// wait 30 seconds before timing out a test 
jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promoise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
