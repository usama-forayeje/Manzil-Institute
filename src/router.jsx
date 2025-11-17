import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouterInstance() {
  return createRouter({ routeTree })
}

export const router = createRouterInstance()