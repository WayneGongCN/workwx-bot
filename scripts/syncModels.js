require('dotenv').config()
const { sequelize } = require('../src/models/index')

sequelize.drop().then(() => {
  sequelize.sync()
})
