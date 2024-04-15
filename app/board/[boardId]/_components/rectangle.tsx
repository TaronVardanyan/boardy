import { PointerEvent } from 'react'
import { RectangleLayer } from '@/types/canvas'
import { colorToCss } from '@/lib/utils'

interface RectangleProps {
  id: string
  layer: RectangleLayer
  onPointerDown: (e: PointerEvent, id: string) => void
  selectionColor?: string
}

const Rectangle = ({
  id,
  layer,
  selectionColor,
  onPointerDown,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      width={width}
      height={height}
      strokeWidth={1}
      fill={fill ? colorToCss(fill) : '#CCCCCC'}
      stroke={selectionColor || 'transparent'}
    />
  )
}

export default Rectangle
