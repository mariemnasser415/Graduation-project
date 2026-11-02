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
