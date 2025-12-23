'use client'

import { motion, useViewportScroll, useTransform } from 'framer-motion'
import MenuItem from './MenuItem'

export default function ParallaxMenuItem({ item }) {
  const { scrollY } = useViewportScroll()
  const y = useTransform(scrollY, [0, 500], [0, 15]) // smaller parallax to reduce jump

  return (
    <div className="relative w-full h-full">
      <MenuItem item={item} parallaxY={y} />
    </div>
  )
}
