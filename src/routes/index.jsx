import { createFileRoute } from '@tanstack/react-router'
import { HeroHeader } from '../components/header'
import HeroSection from '../components/hero-section'
import ContentSection from '../components/content-1'
import MICCurriculum from '../components/MICCurriculum'
import Contact from '../components/contact'
import FooterSection from '../components/footer'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <ContentSection />
      <MICCurriculum />
      <Contact />
      <FooterSection />
    </>
  )
}
