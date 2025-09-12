"use client"

import { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'

export default function DebugCookies() {
  const [cookieInfo, setCookieInfo] = useState<any>(null)

  useEffect(() => {
    const checkCookies = () => {
      console.log('=== DEBUG COOKIES ===')
      console.log('Document cookie:', document.cookie)
      
      const userCookie = getCookie('user')
      console.log('getCookie user:', userCookie)
      
      const allCookies = document.cookie.split(';').map(c => c.trim())
      console.log('All cookies:', allCookies)
      
      const userCookieFromDoc = allCookies.find(c => c.startsWith('user='))
      console.log('User cookie from document:', userCookieFromDoc)
      
      setCookieInfo({
        documentCookie: document.cookie,
        getCookieUser: userCookie,
        allCookies,
        userCookieFromDoc
      })
    }

    checkCookies()
    
    // Check again after a delay
    setTimeout(checkCookies, 1000)
  }, [])

  if (!cookieInfo) return <div>Loading cookie debug info...</div>

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      background: 'white', 
      border: '1px solid red', 
      padding: '10px', 
      zIndex: 9999,
      maxWidth: '400px',
      fontSize: '12px'
    }}>
      <h4>Cookie Debug Info:</h4>
      <pre>{JSON.stringify(cookieInfo, null, 2)}</pre>
    </div>
  )
} 