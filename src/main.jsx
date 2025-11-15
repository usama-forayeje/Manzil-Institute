import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './styles.css'

const router = createRouter({ routeTree })

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<RouterProvider router={router} />)