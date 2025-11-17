import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.js'

export function createRouterInstance() {
  return createRouter({ routeTree })
}

export const router = createRouterInstance()