import { memo } from "react";
import { Color, Camera } from "@/types/canvas"
import { useSelf, useMutation } from "@/liveblocks.config";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import ColorPicker from "./color-picker";
import { Button } from "@/components/ui/button";
import Hint from "@/components/hint";
import { BringToFront, Trash2, SendToBack } from "lucide-react";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

interface SelectionToolsProps {
    camera: Camera,
    setLastUsedColor: (color: Color) => void,
}

const SelectionTools = ({
    camera,
    setLastUsedColor,
}:SelectionToolsProps) => {
    const deleteLayers = useDeleteLayers();
    const selection = useSelf(me => me.presence.selection);
    const selectionBounds = useSelectionBounds();
    
    const moveToBack = useMutation((
        { storage }
    ) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for(let i = 0; i < arr.length; i++) {
            if(selection.includes(arr[i])) {
                indices.push(i);
            }
        }

        for(let i = 0; i < indices.length; i++) {
            liveLayerIds.move(indices[i], i);
        }
    }, [selection]);

    const moveToFront = useMutation((
        { storage }
        ) => {
        const liveLayerIds = storage.get("layerIds");
        const indices: number[] = [];

        const arr = liveLayerIds.toArray();

        for(let i = 0; i < arr.length; i++) {
            if(selection.includes(arr[i])) {
                indices.push(i);
            }
        }

        for(let i = indices.length -1; i >= 0; i--) {
            liveLayerIds.move(
                indices[i],
                arr.length - 1 - (indices.length - 1 - i),
            );
        }
    }, [selection]);

    const setFill = useMutation((
        { storage },
        fill: Color
        ) => {
        const liveLayers = storage.get("layers");
        setLastUsedColor(fill);
        
        selection.forEach((id) => {
            liveLayers.get(id)?.set("fill", fill);
        });
    }, [selection, setLastUsedColor]);
    
    if(!selectionBounds) {
        return null;
    }
    
    const x = selectionBounds.width/2 + selectionBounds.x + camera.x;
    const y = selectionBounds.y + camera.y;

    return (<div
        className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
        style={{
            transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%)) `
        }}
    >
        <ColorPicker
            onChange={setFill}
        />
        <div className="flex flex-col gap-y-0.5">
            <Hint label="Bring to front">
                <Button
                    variant="board"
                    size="icon"
                    onClick={moveToFront}
                    >
                    <BringToFront/>
                </Button>
            </Hint>
            <Hint label="Send to back" side="bottom">
                <Button
                    variant="board"
                    size="icon"
                    onClick={moveToBack}
                    >
                    <SendToBack/>
                </Button>
            </Hint>
        </div>
        <div
            className="flex items-center pl-2 ml-2 border-l border-neutral-200"
        >
            <Hint label="Delete">
                <Button
                    variant="board"
                    size="icon"
                    onClick={deleteLayers}
                >
                    <Trash2/>
                </Button>
            </Hint>
        </div>
    </div>)
}

export default memo(SelectionTools);