import { Suspense, lazy } from 'react'
import { MotionConfig } from 'framer-motion'
import { useRouter } from './router'
import { ContentProvider } from './content/ContentContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'

const Admin = lazy(() => import('./admin/Admin'))

export default function App() {
  const { path } = useRouter()

  if (path === '/admin') {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <ContentProvider>
      <MotionConfig reducedMotion="user">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Lewati ke konten
        </a>
        <Navbar />
        <main id="main">{path === '/projects' ? <ProjectsPage /> : <Home />}</main>
        <Footer />
      </MotionConfig>
    </ContentProvider>
  )
}
