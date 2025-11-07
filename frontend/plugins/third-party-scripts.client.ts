declare global {
  interface Window {
    dataLayer?: any[]
  }
}

export default defineNuxtPlugin(() => {
  // Goftino Chat
  const loadGoftino = () => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.goftino.com/widget/nitfxT'
    document.head.appendChild(script)
  }

  // Google Tag Manager
  const loadGTM = () => {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-T9H262KB'
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })
  }

  // Load after page is interactive
  if (process.client) {
    setTimeout(() => {
      loadGoftino()
      loadGTM()
    }, 2000) // Delay 2s to prioritize main content
  }
})
