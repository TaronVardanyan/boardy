import { PointerEvent } from 'react'
import { EllipseLayer } from '@/types/canvas'
import { colorToCss } from '@/lib/utils'

interface EllipseProps {
  id: string
  layer: EllipseLayer
  onPointerDown: (e: PointerEvent, id: string) => void
  selectionColor?: string
}

const Ellipse = ({
  id,
  layer,
  selectionColor,
  onPointerDown,
}: EllipseProps) => {
  const { x, y, width, height, fill } = layer

  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : '#CCCCCC'}
      stroke={selectionColor || 'transparent'}
    />
  )
}

export default Ellipse
