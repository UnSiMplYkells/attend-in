import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function page() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Student Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}
