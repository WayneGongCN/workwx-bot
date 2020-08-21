const Sequelize = require('sequelize').Sequelize

const sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    socketPath: '/tmp/mysql.sock',
  },
})

class Chat extends Sequelize.Model {}
Chat.init(
  {
    chatId: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
      primaryKey: true,
      comment: '会话 id',
    },
    name: {
      type: Sequelize.CHAR(64),
      allwoNull: true,
    },
    chatType: {
      type: Sequelize.CHAR(16),
      allwoNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Chat',
    underscored: true,
  }
)
class User extends Sequelize.Model {}
User.init(
  {
    userId: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
      primaryKey: true,
      comment: '会话 id',
    },
    name: {
      type: Sequelize.CHAR(64),
      allwoNull: false,
    },
    alias: {
      type: Sequelize.CHAR(64),
      allwoNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    underscored: true,
  }
)

class Message extends Sequelize.Model {}
Message.init(
  {
    msgId: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
      primaryKey: true,
    },
    msgType: {
      type: Sequelize.CHAR(16),
      allwoNull: false,
    },
    chatId: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
    },
    userId: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
    },
    text: {
      type: Sequelize.TEXT(),
      allwoNull: false,
      comment: 'text message 内容',
    },
  },
  {
    sequelize,
    modelName: 'Message',
    underscored: true,
  }
)

class Group extends Sequelize.Model {}
Group.init(
  {
    name: {
      type: Sequelize.CHAR(64),
      allwoNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Group',
    underscored: true,
  }
)

class Controller extends Sequelize.Model {}
Controller.init(
  {
    name: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
    },
    descript: {
      type: Sequelize.CHAR(255),
      allwoNull: true,
      defaultValue: '',
    },

    keyword: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
    },
    controllerType: {
      type: Sequelize.INTEGER(),
      allwoNull: false,
      comment: '0 Message，1 Http',
    },

    controllerHandlerId: {
      type: Sequelize.INTEGER(),
      allwoNull: true,
    },
    groupId: {
      type: Sequelize.INTEGER(),
      allwoNull: true,
    },
    global: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    status: {
      type: Sequelize.INTEGER(),
      allwoNull: false,
      comment: '0 未应用，1 已应用',
    },
  },
  {
    sequelize,
    modelName: 'Controller',
    underscored: true,
  }
)

class Handler extends Sequelize.Model {}
Handler.init(
  {
    name: {
      type: Sequelize.CHAR(32),
      allwoNull: false,
    },

    descript: {
      type: Sequelize.CHAR(255),
      allwoNull: true,
      defaultValue: '',
    },

    script: {
      type: Sequelize.TEXT(),
      allwoNull: false,
      defaultValue: 'hello world',
    },

    status: {
      type: Sequelize.INTEGER(),
      allwoNull: false,
      comment: '0 未应用，1 已应用',
    },
  },
  {
    sequelize,
    modelName: 'Handler',
    underscored: true,
  }
)

// ----------------------------------------------------------------------------

const ChatUser = sequelize.define('ChatUser', {}, { underscored: true, timestamps: false })
const ChatGroup = sequelize.define('ChatGroup', {}, { underscored: true })
const ControllerHandler = sequelize.define('ControllerHandler', {}, { underscored: true, timestamps: false })

// ----------------------------------------------------------------------------

Chat.hasMany(Message, { foreignKey: 'chatId', targetKey: 'chatId' })

Chat.belongsToMany(User, { through: ChatUser, foreignKey: 'chatId', otherKey: 'userId', as: 'users' })
User.belongsToMany(Chat, { through: ChatUser, foreignKey: 'userId', otherKey: 'chatId', as: 'chats' })

Chat.belongsToMany(Group, { through: ChatGroup, foreignKey: 'chatId', otherKey: 'groupId' })
Group.belongsToMany(Chat, { through: ChatGroup, foreignKey: 'groupId', otherKey: 'chatId', as: 'chats' })

Controller.belongsToMany(Handler, { through: ControllerHandler })
Handler.belongsToMany(Controller, { through: ControllerHandler })

// ----------------------------------------------------------------------------

module.exports = {
  sequelize,
  Chat,
  User,
  Message,
  ChatUser,

  Controller,
  Handler,
  Group,
  ControllerHandler,
  ChatGroup,
}
