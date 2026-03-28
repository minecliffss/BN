import { Icon } from '@iconify/react'

const stats = [
  { label: 'Total Photos', value: '1,248', change: '+12%', icon: 'solar:camera-linear', color: 'bg-blue-50 text-blue-600' },
  { label: 'Portfolio Works', value: '86', change: '+4', icon: 'solar:gallery-wide-linear', color: 'bg-amber-50 text-amber-600' },
  { label: 'Happy Clients', value: '88', change: '+3 this month', icon: 'solar:users-group-two-rounded-linear', color: 'bg-green-50 text-green-600' },
  { label: 'Avg. Rating', value: '5.0', change: '88 reviews', icon: 'solar:star-linear', color: 'bg-purple-50 text-purple-600' },
]

const recentWorks = [
  { title: 'Aisha & Rahul Wedding', category: 'Wedding', date: 'Mar 22, 2024', photos: 342, status: 'Delivered', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop' },
  { title: 'Corporate Gala Night', category: 'Event', date: 'Mar 18, 2024', photos: 128, status: 'In Edit', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400&auto=format&fit=crop' },
  { title: 'Kerala Festival 2024', category: 'Festival', date: 'Mar 10, 2024', photos: 215, status: 'Delivered', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400&auto=format&fit=crop' },
  { title: 'Priya Pre-Wedding', category: 'Pre-Wedding', date: 'Mar 5, 2024', photos: 98, status: 'Review', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop' },
]

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  'In Edit': 'bg-amber-100 text-amber-700',
  Review: 'bg-blue-100 text-blue-700',
}

export default function DashboardHome() {
  return (
    <div className="p-8 space-y-8">
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
                <p className="mt-2 text-3xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>{stat.value}</p>
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
          <a href="/dashboard/portfolio" className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors flex items-center gap-1">
            View all <Icon icon="solar:arrow-right-linear" />
          </a>
        </div>
        <div className="divide-y divide-neutral-50">
          {recentWorks.map((work) => (
            <div key={work.title} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img src={work.img} alt={work.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{work.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{work.category} • {work.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-neutral-700">{work.photos} photos</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[work.status]}`}>
                  {work.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Upload Photos', icon: 'solar:upload-linear', desc: 'Add new photos to library', color: 'hover:border-amber-300 hover:bg-amber-50' },
          { label: 'New Portfolio Entry', icon: 'solar:add-square-linear', desc: 'Add to selected works', color: 'hover:border-blue-300 hover:bg-blue-50' },
          { label: 'Export Gallery', icon: 'solar:download-linear', desc: 'Download client deliverables', color: 'hover:border-green-300 hover:bg-green-50' },
        ].map((action) => (
          <button key={action.label} className={`bg-white border border-neutral-100 rounded-2xl p-5 text-left transition-all shadow-sm ${action.color} group`}>
            <Icon icon={action.icon} className="text-2xl text-neutral-700 group-hover:scale-110 transition-transform" />
            <p className="mt-3 text-sm font-medium text-neutral-900">{action.label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
