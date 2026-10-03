import type { RouteObject } from 'react-router-dom'
import { useRoutes, useParams } from 'react-router-dom'

import Home from '@/pages/Home'
import Artists from '@/pages/Artists'
import Companies from '@/pages/Companies'
import SocialProjects from '@/pages/SocialProjects'
import About from '@/pages/About'
import SignUp from '@/pages/SingUp'

import Katz from './Katz/Katz.tsx'
import Obra from './Katz/Obras.tsx'
import { obras } from './Katz/Obras.ts'
import Mazz from './Mazz/Mazz.tsx'

function ObraKatz() {
  const { obraId } = useParams()

  const obra = obras[obraId as keyof typeof obras]

  if (!obra) {
    return <h1>Obra não encontrada</h1>
  }

  return (
    <Obra
      titulo={obra.titulo}
      imagem={obra.imagem}
      alt={obra.alt}
      descricao={obra.descricao}
    />
  )
}

// Used in @/prerender.tsx
export const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/artists', element: <Artists /> },
  { path: '/companies', element: <Companies /> },
  { path: '/social-projects', element: <SocialProjects /> },
  { path: '/about', element: <About /> },
  { path: '/signup', element: <SignUp /> },

  { path: '/katz', element: <Katz /> },
  { path: '/katz/:obraId', element: <ObraKatz /> },

  { path: '/Mazz', element: <Mazz /> }
]

function App() {
  return useRoutes(routes)
}

export default App