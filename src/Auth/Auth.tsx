import React from 'react';
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import "./Auth.css";

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { user, session, error } = await supabase.auth.signIn({ email });
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex justify-center bg-image">
      <div className="self-center h-2/5 bg-green-500 glassmorphism p-6">
        <h1 className="text-3xl">Supabase React App</h1>
        <p className="description">Sign in via only email!</p>
        <div>
          <input
            className="my-3 rounded-sm text-black	w-full"
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
            className={'button block w-full'}
            disabled={loading}
          >
            <button className="bg-green-500 rounded-md p-2 w-full">{loading ? "Loading" : "Send Email"}</button>
          </button>
        </div>
      </div>
    </div>
  )
}