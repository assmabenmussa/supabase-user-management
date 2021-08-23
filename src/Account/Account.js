import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function Account({ session }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

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

  async function updateProfile({ username, website }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        updated_at: new Date(),
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
      <h2>Hi, {username}</h2>
      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input className="text-black" id="email" type="text" value={session.user.email} disabled />
      </div>
      <div className="flex flex-col">
        <label htmlFor="username">Name</label>
        <input
        className="text-black"
          id="username"
          type="text"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="website">Website</label>
        <input
        className="text-black"
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex">
        <button
          className="button p-2 mt-4 bg-green-600 block primary"
          onClick={() => updateProfile({ username, website })}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <button className="button bg-white mt-4 p-2 text-black" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}