const ACTION_NAME_MAP = {
  open: '打开',
  close: '关闭',
  create: '创建',
  reopen: '重新打开',
  invite: '邀请',
  merge: '合并',
  update: '更新',
  approve: '通过',
}
const EVENT_NAME_MAP = ACTION_NAME_MAP

const repoTemplate = ({ name, homepage }) => `[${name}](${homepage})`
const userTemplate = ({ username, web_url }) =>
  web_url ? `**[${username}](${web_url})**` : `**${username}**`
const objTemplateMap = {
  merge_request: data => {
    const { action, iid, title, url, source_branch, target_branch } = data.object_attributes
    return `${ACTION_NAME_MAP[action]}了 MR [#${iid}](${url})\n标题：[${title}](${url})\n分支：${source_branch} --> ${target_branch}`
  },
  issue: data => {
    const { action, iid, title, url } = data.object_attributes
    return `${ACTION_NAME_MAP[action]}了 Issue [#${iid}](${url})\n标题：[${title}](${url})`
  },
  note: data => {
    const { noteable_type, url } = data.object_attributes
    const { commit, merge_request, review, issue } = data
    const noteTypeTemplateMap = {
      Commit: () => `[Commit ${commit.id.slice(0, 8)}](${commit.url})`,
      MergeRequest: () => `MR #${merge_request.iid}`,
      Issue: () => `Issue #${issue.iid}`,
      Review: () => {
        // TODO: 对 MergeRequest\Review 评论时 noteable_type 都为 Review
        if (review) return ` Review #${review.iid} `
        else if (merge_request) return ` MR #${merge_request.iid} `
      },
    }
    return `对${noteTypeTemplateMap[noteable_type]()} 添加了[评论](${url})`
  },
}

const refParser = ref => {
  if (!ref) return ''
  const refArray = ref.split('/')
  const refLen = refArray.length
  if (!refLen) return ''
  return refArray[refLen - 1]
}

const eventHandleMap = {
  'Push Hook': {
    name: '',
    handle: data => {
      const user = data.user_name
      const ref = refParser(data.ref)
      // const commitLen = data.commits.length
      // const repo = repoTemplate(data.repository)
      // return `${user} Push ${commitLen} 个 Commit 到 ${repo} 的 **${ref}** 分支`
      return `${user} Push 代码到 **${ref}** 分支`
    },
  },
  'Tag Push Hook': {
    name: '',
    handle: data => {
      const user = data.user_name
      const ref = refParser(data.ref)
      const repo = repoTemplate(data.repository)
      return `${user} Push Tag **${ref}** 到${repo}`
    },
  },
  'Issue Hook': {
    name: '',
    handle: data => {
      const user = userTemplate(data.user)
      const repo = repoTemplate(data.repository)
      const obj = objTemplateMap[data.object_kind](data)
      return `${user} 在 ${repo} ${obj}`
    },
  },
  'Merge Request Hook': {
    name: '',
    handle: data => {
      const user = userTemplate(data.user)
      const obj = objTemplateMap[data.object_kind](data)
      return `${user} ${obj}`
    },
  },
  'Review Hook': {
    name: '',
    handle: data => {
      let { author, event, iid, reviewers } = data
      event = event || 'create' // TODO: 发起代码评审时 event 为 null
      const eventName = EVENT_NAME_MAP[event]
      const user = userTemplate(author)
      const mention = reviewers.map(x => `<@${x.reviewer.username}>`).join('、')
      return `${user} ${eventName}评审 #${iid}\n评审人：${mention}`
    },
  },
  'Note Hook': {
    name: '',
    handle: data => {
      const user = userTemplate(data.user)
      const obj = objTemplateMap[data.object_kind](data)
      return `${user} ${obj}`
    },
  },
}

const handleGitEvent = (event, data) => {
  const handle = eventHandleMap[event] && eventHandleMap[event].handle
  return (handle && handle(data)) || `未知事件 ${event}: ${JSON.stringify(data)}`
}

module.exports = handleGitEvent
