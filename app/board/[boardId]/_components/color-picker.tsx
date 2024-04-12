"use client";

import { Color } from "@/types/canvas";
import {colorToCss} from "@/lib/utils";

interface ColorPickerProps {
    onChange: (color: Color) => void;
}

interface ColorButtonProps {
    onClick: (color: Color) => void;
    color: Color;
}

const ColorButton = ({
    color,
    onClick
}:ColorButtonProps) => {
    return (<button
        className="w-8 h-8 flex items-center justify-center hover:opacity-75 transition"
        onClick={() => onClick(color)}
        >
        <div
            className="w-8 h-8 rounded-md border border-neutral-300"
            style={{ background: colorToCss(color) }}
        />
    </button>)
};

const ColorPicker = ({onChange}:ColorPickerProps) => {
    return <div
        className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200"
    >
        <ColorButton
            onClick={onChange}
            color={{
                r: 243,
                g: 82,
                b: 35,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 255,
                g: 249,
                b: 177,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 68,
                g: 202,
                b: 99,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 39,
                g: 142,
                b: 237,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 155,
                g: 105,
                b: 245,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 252,
                g: 142,
                b: 42,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 0,
                g: 0,
                b: 0,
            }}
        />
        <ColorButton
            onClick={onChange}
            color={{
                r: 255,
                g: 255,
                b: 255,
            }}
        />
    </div>
}

export default ColorPicker;