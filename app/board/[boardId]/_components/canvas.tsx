"use client";

import { useCallback, useState, WheelEvent, PointerEvent } from "react";

import {
    useHistory,
    useCanUndo,
    useCanRedo,
    useMutation,
} from "@/liveblocks.config";
import {
    pointerEventToCanvasPoint,
} from "@/lib/utils";
import {
    Camera,
    CanvasMode,
    CanvasState,
} from "@/types/canvas";

import Info from "./info";
import Toolbar from "./toolbar";
import Participants from "./participants";
import CursorsPresence from "./cursors-presence";

interface CanvasProps {
    boardId: string;
}

const Canvas = ({
    boardId,
}: CanvasProps) => {
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

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
                >
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