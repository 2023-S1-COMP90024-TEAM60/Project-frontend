import '@/styles/globals.scss'
import 'mapbox-gl/dist/mapbox-gl.css';
import AppLayout from '../components/AppLayout';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  )
}
