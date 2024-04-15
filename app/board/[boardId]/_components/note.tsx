import { PointerEvent } from 'react'
import { Kalam } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { cn, colorToCss, getContrastingTextColor } from '@/lib/utils'
import { useMutation } from '@/liveblocks.config'
import { MAX_FONT_SIZE, NOTE_SCALE_FACTOR } from '@/constants'
import { NoteLayer } from '@/types/canvas'

const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
})

const calcFontSize = (width: number, height: number) => {
  const fontSizeBasedOnHeight = height * NOTE_SCALE_FACTOR
  const fontSizeBasedOnWidth = width * NOTE_SCALE_FACTOR

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, MAX_FONT_SIZE)
}

interface NoteProps {
  id: string
  layer: NoteLayer
  onPointerDown: (e: PointerEvent, id: string) => void
  selectionColor?: string
}

const Note = ({ id, layer, selectionColor, onPointerDown }: NoteProps) => {
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
        backgroundColor: fill ? colorToCss(fill) : '#000',
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        html={value || 'Text'}
        onChange={handleContentChange}
        className={cn(
          'h-full w-full flex items-center justify-center text-center ouline-none',
          font.className,
        )}
        style={{
          color: fill ? getContrastingTextColor(fill) : '#000',
          fontSize: calcFontSize(width, height),
        }}
      />
    </foreignObject>
  )
}

export default Note
