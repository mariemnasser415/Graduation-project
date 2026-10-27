 
const API_URL = 'http://localhost:5000/api/auth'

export const authService = {
  // إنشاء حساب
  async register({ fullName, identifier, password }) {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, identifier, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء إنشاء الحساب')
    }

    return data
  },

  // تسجيل الدخول
  async login({ identifier, password }) {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'فشل تسجيل الدخول')
    }

    // حفظ بيانات المستخدم لو السيرفر بيرجعها
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    return data
  },

  // نسيت كلمة السر
  async forgotPassword({ email }) {
    const res = await fetch(`${API_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'تعذر إرسال رمز استعادة كلمة السر')
    }

    return data
  },

  // تسجيل الخروج
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}
