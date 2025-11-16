import { createRouter } from '@tanstack/react-router'

// Import the routes
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as admissionRoute } from './routes/admission'
import { Route as curriculumRoute } from './routes/curriculum'
import { Route as campusRoute } from './routes/campus'
import { Route as applyRoute } from './routes/apply'
import { Route as addmissionFormRoute } from './routes/addmissionForm'

// Create the route tree using the proper TanStack Router v1 structure
const routeTree = rootRoute.addChildren([
  indexRoute,
  admissionRoute,
  curriculumRoute,
  campusRoute,
  applyRoute,
  addmissionFormRoute,
])

// Create a new router instance
export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
})

// Export for backwards compatibility
export const getRouter = () => router
