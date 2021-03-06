import './index.scss'
import { useState, useEffect } from 'react'
import Auth from './Auth/Auth'
import Account from './Account/Account'
import { supabase } from './supabaseClient'

export default function Home() {
  const [session, setSession] = useState<any>({});

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      return setSession(session)
    })
  }, [])

  return (
    <div>
      {!session ? <Auth /> : <Account key={session?.user?.id} session={session} />}
    </div>
  )
}