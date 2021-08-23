import { useState } from 'react'
import { supabase } from '../supabaseClient.js'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { user, session, error } = await supabase.auth.signIn({ email });
      console.log("user, ", user);
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex">
      <div className="p-3">
        <p className="description">Sign in via only email cuz we're cool like that</p>
        <div>
          <input
            className="my-3 rounded-md text-black	"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className={'button block'}
            disabled={loading}
          >
            {loading ? <button className="bg-green-500 rounded-md p-2">Loading</button> : <button className="bg-green-500 rounded-md p-2">Send magic link to ma butt</button>}
          </button>
        </div>
      </div>
    </div>
  )
}