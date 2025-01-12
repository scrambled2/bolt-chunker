import { createApp } from './app.js'
    import './style.css'

    document.addEventListener('DOMContentLoaded', () => {
      const app = createApp()
      document.body.appendChild(app)
    })
