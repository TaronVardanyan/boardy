import { PointerEvent } from 'react'
import { Kalam } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { cn, colorToCss } from '@/lib/utils'
import { useMutation } from '@/liveblocks.config'
import { MAX_FONT_SIZE, TEXT_SCALE_FACTOR } from '@/constants'
import { TextLayer } from '@/types/canvas'

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
})

const calcFontSize = (width: number, height: number) => {
  const fontSizeBasedOnHeight = height * TEXT_SCALE_FACTOR
  const fontSizeBasedOnWidth = width * TEXT_SCALE_FACTOR

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, MAX_FONT_SIZE)
}

interface TextProps {
  id: string
  layer: TextLayer
  onPointerDown: (e: PointerEvent, id: string) => void
  selectionColor?: string
}

const Text = ({ id, layer, selectionColor, onPointerDown }: TextProps) => {
  const { x, y, width, height, fill, value } = layer

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get('layers')

    liveLayers.get(id)?.set('value', newValue)
  }, [])

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value)
  }

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
      }}
    >
      <ContentEditable
        html={value || 'Text'}
        onChange={handleContentChange}
        className={cn(
          'h-full w-full flex items-center justify-center text-center drop-shadow-md ouline-none',
          font.className,
        )}
        style={{
          color: fill ? colorToCss(fill) : '#000',
          fontSize: calcFontSize(width, height),
        }}
      />
    </foreignObject>
  )
}

export default Text
