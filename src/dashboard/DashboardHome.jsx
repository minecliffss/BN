import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { supabase } from '../lib/supabase'

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  'In Edit': 'bg-amber-100 text-amber-700',
  Review: 'bg-blue-100 text-blue-700',
}

export default function DashboardHome() {
  const [stats, setStats] = useState([
    { label: 'Total Photos', value: '...', change: '...', icon: 'solar:camera-linear', color: 'bg-blue-50 text-blue-600' },
    { label: 'Portfolio Works', value: '...', change: '...', icon: 'solar:gallery-wide-linear', color: 'bg-amber-50 text-amber-600' },
    { label: 'Happy Clients', value: '...', change: '...', icon: 'solar:users-group-two-rounded-linear', color: 'bg-green-50 text-green-600' },
    { label: 'Avg. Rating', value: '...', change: '...', icon: 'solar:star-linear', color: 'bg-purple-50 text-purple-600' },
  ])
  const [recentWorks, setRecentWorks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      // Fetch Portfolio Works
      const { data: works, error: worksErr } = await supabase
        .from('portfolio_works')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch Reviews
      const { data: reviews, error: reviewsErr } = await supabase
        .from('reviews')
        .select('*')

      if (works) {
        setRecentWorks(works.slice(0, 5))
        
        const totalPhotos = works.reduce((acc, w) => acc + (w.photos || 0), 0)
        const avgRating = reviews?.length > 0 
          ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
          : '5.0'

        setStats([
          { label: 'Total Photos', value: totalPhotos.toLocaleString(), change: '+0%', icon: 'solar:camera-linear', color: 'bg-blue-50 text-blue-600' },
          { label: 'Portfolio Works', value: works.length.toString(), change: `+${works.length}`, icon: 'solar:gallery-wide-linear', color: 'bg-amber-50 text-amber-600' },
          { label: 'Happy Clients', value: (reviews?.length || 0).toString(), change: 'Clients', icon: 'solar:users-group-two-rounded-linear', color: 'bg-green-50 text-green-600' },
          { label: 'Avg. Rating', value: avgRating, change: `${reviews?.length || 0} reviews`, icon: 'solar:star-linear', color: 'bg-purple-50 text-purple-600' },
        ])
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Real-time subscriptions
    const worksSub = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_works' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchData)
      .subscribe()

    return () => {
      supabase.removeChannel(worksSub)
    }
  }, [])

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
          Good evening, Studio 👋
        </h1>
        <p className="mt-1 text-sm text-neutral-500 font-light">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{stat.label}</p>
                <p className="mt-2 text-3xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {loading ? '...' : stat.value}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon icon={stat.icon} className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Works Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-900">Recent Works</h2>
          <a href="/dashboard/portfolio" className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors flex items-center gap-1 cursor-pointer">
            View all <Icon icon="solar:arrow-right-linear" />
          </a>
        </div>
        <div className="divide-y divide-neutral-50">
          {recentWorks.length === 0 && !loading && (
            <div className="px-6 py-8 text-center text-neutral-400 text-sm italic">No works found yet.</div>
          )}
          {recentWorks.map((work) => (
            <div key={work.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-100">
                {work.img_url ? (
                  <img src={work.img_url} alt={work.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Icon icon="solar:gallery-linear" className="text-xl" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{work.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{work.category} • {work.location || 'Unknown'}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-neutral-700">{work.photos || 0} photos</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[work.status] || 'bg-neutral-100 text-neutral-600'}`}>
                  {work.status || 'Delivered'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Upload Photos', icon: 'solar:upload-linear', desc: 'Add new photos to library', color: 'hover:border-amber-300 hover:bg-amber-50', link: '/dashboard/photos' },
          { label: 'New Portfolio Entry', icon: 'solar:add-square-linear', desc: 'Add to selected works', color: 'hover:border-blue-300 hover:bg-blue-50', link: '/dashboard/portfolio' },
          { label: 'Manage Reviews', icon: 'solar:star-linear', desc: 'View client testimonials', color: 'hover:border-green-300 hover:bg-green-50', link: '/dashboard/reviews' },
        ].map((action) => (
          <a key={action.label} href={action.link} className={`bg-white border border-neutral-100 rounded-2xl p-5 text-left transition-all shadow-sm ${action.color} group cursor-pointer block`}>
            <Icon icon={action.icon} className="text-2xl text-neutral-700 group-hover:scale-110 transition-transform" />
            <p className="mt-3 text-sm font-medium text-neutral-900">{action.label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{action.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
