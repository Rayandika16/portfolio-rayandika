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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-4xl focus:bg-popover focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-popover-foreground focus:shadow-md focus:ring-2 focus:ring-ring"
        >
          Lewati ke konten
        </a>
        <Navbar />
        <main id="main">{path === '/projects' ? <ProjectsPage /> : <Home />}</main>
        <Footer />
      </MotionConfig>
    </ContentProvider>
  )
}
