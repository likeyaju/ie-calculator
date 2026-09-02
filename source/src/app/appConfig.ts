/**
 * 在线二维码访问令牌：轮换二维码时只修改这一处，然后重新构建在线版。
 * 这只是轻量防扩散参数，不是安全认证或密码。
 */
export const ONLINE_ACCESS_TOKEN = 'IEV11-2026-08-30'

/** offline-single 构建专供本地双击使用，不检查在线访问参数。 */
export const ONLINE_ACCESS_REQUIRED = import.meta.env.MODE !== 'offline-single'
