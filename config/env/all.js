const path = require('path'),
  rootPath = path.normalize(`${__dirname}/../..`);

const keys = `${rootPath}/keys.txt`;

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.NODE_ENV === 'test' ? process.env.MONGOHQ_URL_TEST : process.env.MONGOHQ_URL,
  token: process.env.TOKEN_SECRET
};
