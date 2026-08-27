'use client'

import { useEffect, useState } from 'react'

export function LandingSplash() {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setIsExiting(true), 320)
    const removeTimer = window.setTimeout(() => setIsVisible(false), 520)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`landing-splash${isExiting ? ' landing-splash--exiting' : ''}`}
      aria-hidden="true"
    >
      <div className="landing-splash__grid" />
      <div className="landing-splash__content">
        <div className="landing-splash__mark">
          <img src="/resume-pilot-logo.png" alt="" />
        </div>
        <div className="landing-splash__wordmark">Resume Pilot</div>
        <div className="landing-splash__status">
          <span className="landing-splash__dot" />
          AI-powered resume analysis
        </div>
      </div>
    </div>
  )
}
