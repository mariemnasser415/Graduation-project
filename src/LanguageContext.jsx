import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext(null)

const translations = {
  ar: {
    settings: 'الإعدادات',
    home: 'الرئيسية',
    contracts: 'سجل العقود',
    assistant: 'المساعد الذكي',
    profile: 'الملف الشخصي',
    editProfile: 'تعديل البيانات',
    changePassword: 'تغيير كلمة السر',
    createContract: 'إنشاء عقد الآن',
    notifications: 'الإشعارات',
    language: 'اللغة',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
  },
  en: {
    settings: 'Settings',
    home: 'Home',
    contracts: 'Contract history',
    assistant: 'AI assistant',
    profile: 'Profile',
    editProfile: 'Edit profile',
    changePassword: 'Change password',
    createContract: 'Create a contract',
    notifications: 'Notifications',
    language: 'Language',
    logout: 'Log out',
    login: 'Log in',
    register: 'Create account',
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') === 'en' ? 'en' : 'ar'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  function t(key) {
    return translations[language][key] || translations.ar[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage لازم يُستخدم داخل LanguageProvider')
  }

  return context
}