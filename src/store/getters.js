const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  uid: state => state.user.uid,
  avatar: state => state.user.avator,
  name: state => state.user.name,
  nick: state => state.user.nick,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  visitor: state => state.user.visitor,
  setting: state => state.user.setting,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  theme: state => state.app.theme,
  fullScreen: state => state.app.fullScreen,
}
export default getters
