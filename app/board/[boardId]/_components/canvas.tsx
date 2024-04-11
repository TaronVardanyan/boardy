"use client";

import {
    useCallback,
    useState,
    WheelEvent,
    PointerEvent,
    useMemo
} from "react";
import { MAX_LAYERS } from "@/constants";
import { nanoid } from "nanoid";
import LayerPreview from "./layer-preview";
import {
    useHistory,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStorage, useOthersMapped,
} from "@/liveblocks.config";
import {
    connectionIdToColor,
    pointerEventToCanvasPoint,
} from "@/lib/utils";
import {
    Color,
    Camera,
    CanvasMode,
    CanvasState,
    LayerType,
    Point,
    XYWH,
    Side,
} from "@/types/canvas";

import Info from "./info";
import Toolbar from "./toolbar";
import Participants from "./participants";
import CursorsPresence from "./cursors-presence";
import {LiveObject} from "@liveblocks/client";

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

    const onPointerMove = useMutation((
        { setMyPresence },
        e: PointerEvent
        ) => {
        e.preventDefault();

        const current = pointerEventToCanvasPoint(e, camera);

        setMyPresence({ cursor: current });
    },[camera]);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const onPointerUp = useMutation(({}, e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if(canvasState.mode === CanvasMode.Inserting) {
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
            >
                {layerIds.map(layerId => (<LayerPreview
                    key={layerId}
                    id={layerId}
                    onLayerPointerDown={onLayerPointerDown}
                    selectionColor={layerIdsToColorSelection[layerId]}
                />))}
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