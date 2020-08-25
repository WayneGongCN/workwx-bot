require('dotenv').config()
module.exports = {
  apps: [
    {
      name: process.env.BOT_NAME,
      script: 'bin/www',
      max_memory_restart: '100M',

      watch: false,
      ignore_watch: ['node_modules', '.git', '*.log'],
    },
  ],
}
