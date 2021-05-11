import React from "react";
import Segment from "./segment";
const Arm = (props)=>
{
    const l1=150;
    const l2=150;
    const base=props.base;
    const angle1 = parseInt(props.angle1);
    const angle2 = parseInt(props.angle2);
    const base2 = {
        x:base.x-l1*Math.sin(Math.PI*(angle1/180)),
        y:base.y+l1*Math.cos(Math.PI*(angle1/180))
    }
    return(
        <React.Fragment>
            <Segment base={base} l={l1} angle={angle1} color={props.color1}/>
            <Segment base={base2} l={l1} angle={angle2+angle1} color={props.color2}/>
            {/* <rect x={base.x-2.5} y={base.y} height={l1} width={5} fill="red" transform={"rotate("+angle1+","+base.x+","+base.y+")"}/>
            <rect x={base2.x-2.5} y={base2.y} height={l2} width={5} fill="red" transform={"rotate("+(angle2+angle1)+","+base2.x+","+base2.y+")"}/> */}
        </React.Fragment>
    )
}
export default Arm;