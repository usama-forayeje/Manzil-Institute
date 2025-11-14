import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/campus')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/campus"!</div>
}
