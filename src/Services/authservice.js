// وضع تجريبي لحد ما الـ Backend يجهز (غيّره بـ VITE_USE_MOCK=false في ملف .env)
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
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


  // تسجيل الدخول (مؤقت بدون Backend)
  async login({ identifier, password }) {

    // محاكاة اتصال بالـ API
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = {
      success: true,
      user: {
        identifier: identifier
      },
      token: "fake-token"
    }

    // حفظ بيانات المستخدم
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)

    return data
  },


  // نسيت كلمة السر
  async forgotPassword({ email }) {
    if (USE_MOCK) {
      await wait(600)
      return { message: 'تم إرسال الرمز' }
    }

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


  // التحقق من رمز الاستعادة
  async verifyCode({ email, code }) {
    if (USE_MOCK) {
      await wait(600)
      if (code !== '123456') {
        throw new Error('رمز التحقق غير صحيح (الرمز التجريبي: 123456)')
      }
      return { message: 'تم التحقق' }
    }

    const res = await fetch(`${API_URL}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'رمز التحقق غير صحيح')
    }

    return data
  },


  // تعيين كلمة سر جديدة
  async resetPassword({ email, code, password }) {
    if (USE_MOCK) {
      await wait(600)
      return { message: 'تم تغيير كلمة السر' }
    }

    const res = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'تعذر تغيير كلمة السر')
    }

    return data
  },


  // تسجيل الخروج
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  },
}