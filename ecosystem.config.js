module.exports = {
  apps: [
    {
      name: process.env.BOT_NAME,
      script: 'bin/www',
      max_memory_restart: '100M',

      watch: true,
      ignore_watch: ['node_modules', '.git', '*.log'],
    },
  ],
}
