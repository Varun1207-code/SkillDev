import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight, Users, ClipboardList, Settings } from 'lucide-react';

export default async function AdminPanel() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) redirect('/login');
    const payload = await verifyJWT(token);
    if (payload?.email !== 'admin@skilldev.com') redirect('/login');
  } catch {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400">
              Admin Panel
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome, Admin!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <Link
            href="/admin/users"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-red-600 dark:text-red-400" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Users</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">View, edit, and manage platform users.</p>
              <span className="inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                Manage Users <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Assessments Management */}
          <Link
            href="/admin/assessments"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ClipboardList className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Assessments</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Review, edit, and publish assessments.</p>
              <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Manage Assessments <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Settings */}
          <Link
            href="/admin/settings"
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Settings className="w-24 h-24 text-green-600 dark:text-green-400" />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Configure platform-wide options.</p>
              <span className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                Manage Settings <ArrowRight className="ml-1 w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
