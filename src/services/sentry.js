const handleSentryEvent = event => {
  const { project_name, url, level, message } = event
  return `**Sentry ${project_name} ${level}**\n${message}\n**[Detail](${url})**`
}

module.exports = handleSentryEvent
