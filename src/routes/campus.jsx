import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLanguageStore } from '../lib/store'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/campus')({
  component: RouteComponent,
})

function RouteComponent() {
  const { language } = useLanguageStore()
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate({ to: '/' })
  }

  return (
    <div className='text-center flex flex-col items-center justify-center h-screen mx-auto px-4'>
      <p className='text-lg mb-6'>{language === 'bn' ? 'ক্যাম্পাস সেকশনের কাজ চলছে' : 'We are working on Campus'}!</p>
      <Button onClick={handleGoBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
      </Button>
    </div>
  )
}
