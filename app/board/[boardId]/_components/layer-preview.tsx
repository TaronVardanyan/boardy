"use client";

import { PointerEvent, memo } from "react";
import {useStorage} from "@/liveblocks.config";
import {LayerType} from "@/types/canvas";
import Rectangle from "./rectangle";
import Ellipse from "./ellipse";
import Text from "./text";
import Note from "./note";

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
            return (<Ellipse
                id={id}
                layer={layer}
                selectionColor={selectionColor}
                onPointerDown={onLayerPointerDown}
            />);
        case LayerType.Text:
            return <Text
                id={id}
                layer={layer}
                selectionColor={selectionColor}
                onPointerDown={onLayerPointerDown}
            />;
        case LayerType.Note:
            return <Note
                id={id}
                layer={layer}
                selectionColor={selectionColor}
                onPointerDown={onLayerPointerDown}
            />;
        default:
            console.warn("Unknown layer type");
            return null;
    }
}

export default memo(LayerPreview);