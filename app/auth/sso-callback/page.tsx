"use client"

import { useEffect } from "react"

/**
 * DEPRECATED: this route duplicated /sso/page.tsx with the same broken
 * client-side re-verification logic. Consolidated into one receiver page
 * to avoid the two drifting out of sync again. Forwards to /sso, preserving
 * all query params (sso_token, next, sso_error, etc.)
 */
export default function DeprecatedSsoCallbackPage() {
  useEffect(() => {
    const target = `/sso${window.location.search}`
    window.location.replace(target)
  }, [])

  return null
}
