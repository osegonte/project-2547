import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="text-center space-y-4">
          <div className="text-2xl font-serif font-bold">
            Hope Catalyst Scholarship
          </div>
          <p className="text-white/70 text-sm max-w-md mx-auto">
            Supporting Nigerian students with verified school fee payments.
          </p>
          
          <div className="pt-6 border-t border-white/10 mt-8">
            <p className="text-sm text-white/60">
              © 2025 Hope Catalyst Scholarship. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}