import '@/styles/globals.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {

  const [progress, setProgress] = useState(0)
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setProgress(Math.floor(Math.random() * 40))
    })
    router.events.on('routeChangeComplete', () => {
      setProgress(100)
    })
    return () => {
      router.events.on('routeChangeStart', () => {
        setProgress(Math.floor(Math.random() * 40))
      })
      router.events.on('routeChangeComplete', () => {
        setProgress(100)
      })
    }
  }, [router.events])
  return <>
    <LoadingBar
      color='#740606e0'
      progress={progress}
      waitingTime={400}
      shadow={true}
      height={4}
      onLoaderFinished={() => setProgress(0)}
    />
    <Component {...pageProps} />
    <ToastContainer />
  </>
}
