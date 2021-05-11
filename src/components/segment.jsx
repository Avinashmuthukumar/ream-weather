import React from "react";
const Segment = (props)=>
{
    const base1 = {x:props.base.x-15,y:props.base.y}
    const base2 = {x:props.base.x-5,y:props.base.y}
    const base3 = {x:props.base.x+5,y:props.base.y}
    return(
        <React.Fragment>
            <rect x={base1.x} y={base1.y} height={props.l} width={10} fill={props.color} transform={"rotate("+props.angle+","+props.base.x+","+props.base.y+")"}/>
            <rect x={base2.x} y={base2.y} height={props.l} width={10} fill={props.color} transform={"rotate("+props.angle+","+props.base.x+","+props.base.y+")"}/>
            <rect x={base3.x} y={base3.y} height={props.l} width={10} fill={props.color} transform={"rotate("+props.angle+","+props.base.x+","+props.base.y+")"}/>
        </React.Fragment>
    )
}
export default Segment;