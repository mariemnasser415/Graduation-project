 // كل دالة بترجع نص الخطأ، أو '' لو القيمة سليمة

export const validateFullName = (v) =>
  v.trim().length < 3 ? 'اكتبي الاسم كامل' : ''

export const validateIdentifier = (v) => {
  const x = v.trim()
  const isEmail = /^\S+@\S+\.\S+$/.test(x)
  const isPhone = /^01[0125]\d{8}$/.test(x) // موبايل مصري
  return isEmail || isPhone ? '' : 'اكتبي بريد إلكتروني أو رقم موبايل صحيح'
}

export const validatePassword = (v) =>
  v.length < 8 ? 'كلمة السر لازم تكون 8 أحرف على الأقل' : ''

export const validateConfirm = (password, confirm) =>
  password !== confirm ? 'كلمتا السر غير متطابقتين' : ''