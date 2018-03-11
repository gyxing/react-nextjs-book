import dynamic from 'next/dynamic'
import '../../static/css/components.less'

export const Icon = dynamic(import('./Icon'), {ssr: false});

export { default as Header } from './Header'
export { default as Footer } from './Footer'
export { default as Image } from './Image'
export { default as ZScroll } from './ZScroll'