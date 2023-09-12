const TokenKey = 'Access-Token'
const UserKey = 'User-Id'

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUserId() {
  return localStorage.getItem(UserKey)
}

export function setUserId(userId) {
  return localStorage.setItem(UserKey, userId)
}

export function removeUserId() {
  return localStorage.removeItem(UserKey)
}

