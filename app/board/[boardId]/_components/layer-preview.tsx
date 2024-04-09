"use client";

import { PointerEvent, memo } from "react";
import {useStorage} from "@/liveblocks.config";
import {LayerType} from "@/types/canvas";
import Rectangle from "./rectangle";

interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: PointerEvent, layerId: string) => void;
    selectionColor?: string
}

const LayerPreview = ({ id, onLayerPointerDown, selectionColor }:LayerPreviewProps) => {
    const layer = useStorage(root => root.layers.get(id));
    
    if(!layer) {
        return
    }
    
    switch (layer.type) {
        case LayerType.Rectangle:
            return (<Rectangle
                id={id}
                layer={layer}
                selectionColor={selectionColor}
                onPointerDown={onLayerPointerDown}
            />);
        case LayerType.Ellipse:
            return <div>Ellipse</div>;
        case LayerType.Text:
            return <div>Text</div>;
        case LayerType.Note:
            return <div>Note</div>;
        default:
            console.warn("Unknown layer type");
            return null;
    }
}

export default memo(LayerPreview);