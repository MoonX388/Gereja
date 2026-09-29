"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

/**
 * FIXED: this page previously tried to RE-VERIFY the SSO signature
 * client-side using a fake "base64" scheme that didn't match the backend's
 * real HMAC-SHA256 signature at all — that comparison always failed
 * ("Signature tidak valid"), and even if it hadn't, the next step called
 * `POST /auth/sso-login`, an endpoint that never existed on the gpanel
 * backend.
 *
 * The REAL flow: landing-page redirects the browser to gpanel's BACKEND
 * (`GET /auth/v1/secure/sso-verification`), which verifies the HMAC
 * signature itself, issues a gpanel-local JWT, and 302-redirects the
 * browser here with that already-valid token attached as `sso_token`.
 * By the time this page runs, verification is DONE — there is nothing
 * left to check. This page's only job is: read the token, store it the
 * same way normal login does, then hard-navigate to the real destination
 * so AuthProvider re-mounts and picks up the session via `/auth/profile`.
 */
export default function SSOReceiverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ssoToken = searchParams.get("sso_token")
    const ssoError = searchParams.get("sso_error")
    const next = searchParams.get("next") || "/admin"

    if (ssoError) {
      setError(decodeURIComponent(ssoError))
      return
    }

    if (!ssoToken) {
      setError("Token SSO tidak ditemukan pada URL.")
      return
    }

    // Same storage mechanism as normal login (auth-context.tsx setAuthToken).
    localStorage.setItem("token", ssoToken)
    document.cookie = `auth_token=${ssoToken}; path=/; max-age=${604800}`

    // Hard navigation (not router.push) so AuthProvider re-mounts fresh and
    // picks up the newly stored token via its normal /auth/profile bootstrap.
    window.location.href = next
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">SSO Login Gagal</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Mengautentikasi via SSO...</p>
      </div>
    </div>
  )
}
