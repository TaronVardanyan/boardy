'use client'

import { memo } from 'react'
import { XYWH, Side, LayerType } from '@/types/canvas'
import { HANDLE_WIDTH } from '@/constants'
import { useSelf, useStorage } from '@/liveblocks.config'
import { useSelectionBounds } from '@/hooks/use-selection-bounds'

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void
}

const SelectionBox = ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
  const soleLayerId = useSelf((me) =>
    me.presence.selection.length === 1 ? me.presence.selection[0] : null,
  )

  const isShowingHandles = useStorage(
    (root) =>
      soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path,
  )

  const bounds = useSelectionBounds()

  if (!bounds) {
    return null
  }

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />
      {isShowingHandles && (
        <>
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'nwse-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top + Side.Left, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'ns-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'nesw-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDLE_WIDTH / 2}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Top + Side.Right, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'ew-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Right, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'nwse-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `translate(${bounds.x - HANDLE_WIDTH / 2 + bounds.width}px, ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom + Side.Right, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'ns-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `
               translate(${bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}px,
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'nesw-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `
               translate(${bounds.x - HANDLE_WIDTH / 2}px,
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds)
            }}
          />
          <rect
            className="fill-white stroke-blue-500 stroke-1"
            style={{
              cursor: 'ew-resize',
              width: `${HANDLE_WIDTH}px`,
              height: `${HANDLE_WIDTH}px`,
              transform: `
               translate(${bounds.x - HANDLE_WIDTH / 2}px,
               ${bounds.y - HANDLE_WIDTH / 2 + bounds.height / 2}px)`,
            }}
            x={0}
            y={0}
            width={bounds.width}
            height={bounds.height}
            onPointerDown={(e) => {
              e.stopPropagation()
              onResizeHandlePointerDown(Side.Left, bounds)
            }}
          />
        </>
      )}
    </>
  )
}

export default memo(SelectionBox)
