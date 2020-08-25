const Sequelize = require('sequelize').Sequelize

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
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
    controllerType: {
      type: Sequelize.INTEGER(),
      allwoNull: false,
      comment: '0 Message，1 Http',
    },
    descript: {
      type: Sequelize.CHAR(255),
      allwoNull: true,
      defaultValue: '',
    },
    global: {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
    },
    status: {
      type: Sequelize.INTEGER(),
      allwoNull: false,
      comment: '0 禁用，1 启用',
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
      comment: '0 禁用，1 启用',
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
const ChatGroup = sequelize.define('ChatGroup', {}, { underscored: true, timestamps: false })
const ControllerGroup = sequelize.define('ControllerGroup', {}, { underscored: true, timestamps: false })
const ControllerHandler = sequelize.define('ControllerHandler', {}, { underscored: true, timestamps: false })
const HandlerGroup = sequelize.define('HandlerGroup', {}, { underscored: true, timestamps: false })

// ----------------------------------------------------------------------------

// User:Message 1:N
User.hasMany(Message, { foreignKey: 'userId', targetKey: 'userId', as: 'messages' })
// Message:User N:1
Message.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId', as: 'user' })

// Chat:Message 1:N
Chat.hasMany(Message, { foreignKey: 'chatId', targetKey: 'chatId', as: 'messages' })
// Message:Chat N:1
Message.belongsTo(Chat, { foreignKey: 'chatId', targetKey: 'chatId', as: 'chat' })

// Chat:User N:M
Chat.belongsToMany(User, { through: ChatUser, foreignKey: 'chatId', otherKey: 'userId', as: 'users' })
User.belongsToMany(Chat, { through: ChatUser, foreignKey: 'userId', otherKey: 'chatId', as: 'chats' })

// Chat:Group N:M
Chat.belongsToMany(Group, { through: ChatGroup, foreignKey: 'chatId', otherKey: 'groupId' })
Group.belongsToMany(Chat, { through: ChatGroup, foreignKey: 'groupId', otherKey: 'chatId', as: 'chats' })

// Controller:Group N:M
Controller.belongsToMany(Group, { through: ControllerGroup, foreignKey: 'controllerId', otherKey: 'groupId', as: 'groups' })
Group.belongsToMany(Controller, { through: ControllerGroup, foreignKey: 'groupId', otherKey: 'controllerId', as: 'controllers' })

// Controller:Handler N:M
Controller.belongsToMany(Handler, { through: ControllerHandler, foreignKey: 'controllerId', otherKey: 'handlerId', as: 'handlers' })
Handler.belongsToMany(Controller, { through: ControllerHandler, foreignKey: 'handlerId', otherKey: 'controllerId', as: 'controllers' })

// Controller:Group N:M
Handler.belongsToMany(Group, { through: HandlerGroup, foreignKey: 'handlerId', otherKey: 'groupId', as: 'groups' })
Group.belongsToMany(Handler, { through: HandlerGroup, foreignKey: 'groupId', otherKey: 'handlerId', as: 'handlers' })

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
