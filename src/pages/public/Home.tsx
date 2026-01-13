import Hero from '../../components/sections/Hero'
import HowItWorks from '../../components/sections/HowItWorks'
import Transparency from '../../components/sections/Transparency'

interface HomeProps {
  onOpenModal: () => void
}

export default function Home({ onOpenModal }: HomeProps) {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <HowItWorks onOpenModal={onOpenModal} />
      <Transparency />
    </>
  )
}