import React from 'react'
import { useState, useEffect } from 'react'
import { User } from '../Interfaces/User'
import { supabase } from '../supabaseClient'

export default function Account({ session }: any) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [website, setWebsite] = useState("")

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const user: User | any = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async ({ username, website }: User) => {
    try {
      setLoading(true)
      const user = supabase.auth.user();
      let updates: any;
      if (user !== null) {
        updates = {
          id: user.id ?? "",
          username,
          website,
          updated_at: new Date(),
        }
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col p-5">
      <h1 className="text-4xl mb-3">Hi, {username}</h1>
      <div className="border-solid border-white border-2 rounded-3xl p-6">
        <div className="flex flex-col my-2">
          <label htmlFor="email">Email</label>
          <input className="text-black" id="email" type="text" value={session?.user?.email} disabled />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="username">Name</label>
          <input
          className="text-black"
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="website">Website</label>
          <input
          className="text-black"
            id="website"
            type="website"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="button p-2 mt-4 rounded-md mx-2 bg-green-600 block primary"
            onClick={() => updateProfile({ username, website })}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
          <button className="button bg-white mt-4 rounded-md mx-2 p-2 text-black" onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
        </div>
      </div>

    </div>
  )
}