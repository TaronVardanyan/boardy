"use client";

import {PointerEvent, useCallback, useMemo, useState, WheelEvent} from "react";
import {MAX_LAYERS} from "@/constants";
import {nanoid} from "nanoid";
import LayerPreview from "./layer-preview";
import {useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage,} from "@/liveblocks.config";
import {connectionIdToColor, pointerEventToCanvasPoint, resizeBounds,} from "@/lib/utils";
import {Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH,} from "@/types/canvas";

import Info from "./info";
import Toolbar from "./toolbar";
import Participants from "./participants";
import CursorsPresence from "./cursors-presence";
import {LiveObject} from "@liveblocks/client";
import SelectionBox from "./selection-box";

interface CanvasProps {
    boardId: string;
}

const Canvas = ({
    boardId,
}: CanvasProps) => {
    const layerIds = useStorage(root => root.layerIds);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 0,
        g: 0,
        b: 0,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note,
        position: Point,
        ) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYERS) {
            return;
        }

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor
        });

        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer as any);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setCanvasState({ mode: CanvasMode.None });
}, [lastUsedColor]);

    const translateSelectedLayer = useMutation((
        { storage, self },
        point: Point,
    ) => {
        if(canvasState.mode !== CanvasMode.Translating) {
            return;
        }

        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        };

        const liveLayers = storage.get("layers");

        for(const id of self.presence.selection) {
            const layer = liveLayers.get(id);

            if(layer) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                })
            }
        }

        setCanvasState({
            mode: CanvasMode.Translating,
            current: point,
        })
    }, [canvasState]);

    const unselectLayers = useMutation((
        {self, setMyPresence},
    ) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const resizeSelectedLayer = useMutation((
        {storage, self},
        point: Point,
    ) => {
        if(canvasState.mode !== CanvasMode.Resizing) {
            return
        }

        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point);

        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0]);

        if (layer) {
            layer.update(bounds);
        }
    }, [canvasState]);

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds,
            corner,
        });
    }, [history]);

    const onWheel = useCallback((e: WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerDown = useCallback((e: PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if(canvasState.mode === CanvasMode.Inserting){
            return;
        }

        //TODO add case for drawing
        setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }, [camera, canvasState]);

    const onPointerMove = useMutation((
        { setMyPresence },
        e: PointerEvent
        ) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayer(current)
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        }

        setMyPresence({ cursor: current });
    },[
        camera,
        canvasState,
        resizeSelectedLayer,
        translateSelectedLayer,
    ]);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Pressing
        ) {
            unselectLayers();
            setCanvasState({ mode: CanvasMode.None });
        } else if(canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        } else {
            setCanvasState({ mode: CanvasMode.None });
        }

        history.resume();
    }, [
        camera,
        history,
        insertLayer,
        canvasState,
        unselectLayers,
    ]);

    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation((
        { self, setMyPresence},
        e: PointerEvent,
        layerId: string,
        ) => {

        if(
            canvasState.mode === CanvasMode.Pencil ||
            canvasState.mode === CanvasMode.Inserting
        ) {
            return;
        }

        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if(!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [
        canvasState.mode,
        setCanvasState,
        camera,
        history
    ]);

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for(const user of selections) {
            const [connectionId, selection] = user;

            for(const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection;
    }, [selections]);

    return (
        <main
            className="h-full w-full relative bg-neutral-100 touch-none"
            >
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history.undo}
                redo={history.redo}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerLeave}
                onPointerDown={onPointerDown}
            >
                {layerIds.map(layerId => (<LayerPreview
                    key={layerId}
                    id={layerId}
                    onLayerPointerDown={onLayerPointerDown}
                    selectionColor={layerIdsToColorSelection[layerId]}
                />))}
                <SelectionBox
                    onResizeHandlePointerDown={onResizeHandlePointerDown}
                />
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`
                    }}
                    >
                    <CursorsPresence />
                </g>
            </svg>
        </main>
        );
};

export default Canvas;