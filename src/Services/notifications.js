const STORAGE_KEY = 'activityNotifications'

export function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function addNotification(message) {
  const notifications = getNotifications()

  const newNotification = {
    id: `${Date.now()}-${Math.random()}`,
    message,
    date: new Date().toISOString(),
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([newNotification, ...notifications]),
  )

  window.dispatchEvent(new Event('notifications-updated'))
}