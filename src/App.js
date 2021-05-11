import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify, { button, PubSub, } from 'aws-amplify';
import Arm from "./components/arm";
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID
  }
});
Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: process.env.REACT_APP_REGION,
  aws_pubsub_endpoint: `wss://${process.env.REACT_APP_MQTT_ID}.iot.${process.env.REACT_APP_REGION}.amazonaws.com/mqtt`,
}));
const color1 = "red";
const color2 = "yellow";
const color3 = "green";
const color4 = "grey";
const base1 = {x:450,y:100};
const base2 = {x:250,y:100};
const commonTopic = "aws/iot/available";
const srspbuttons = [
  {
    //topic:"Front_left_arm/motorStartService",
    name:"front left toggle",
    srValue:"Start_FL",
    spValue:"Stop_FL",
    color:color2,
  },
  {
    //topic:"Rear_left_arm/motorStartService",
    name:"rear left toggle",
    srValue:"Start_RL",
    spValue:"Stop_RL",
    color:color1,
  },
  {
    //topic:"Rear_right_arm/motorStartService",
    name:"rear right toggle",
    srValue:"Start_RR",
    spValue:"Stop_RR",
    color:color3,
  },
  {
    //topic:"Front_right_arm/motorStartService",
    name:"front right toggle",
    srValue:"Start_FR",
    spValue:"Stop_FR",
    color:color4,
  },
]
const stopbuttons = [
  {
    //topic:"Front_left_arm/motorStartService",
    name:"front left start",
    value:"Stop_FL",
  },
  {
    //topic:"Rear_left_arm/motorStartService",
    name:"rear left start",
    value:"Stop_RL",
  },
  {
    //topic:"Rear_right_arm/motorStartService",
    name:"rear right start",
    value:"Stop_RR",
  },
  {
    //topic:"Front_right_arm/motorStartService",
    name:"front right start",
    value:"Stop_FR",
  },
]
const dirbuttons = [
  {
    //topic:"Front_left_arm/DirectionChangeService",
    name:"front left direction toggle",
    value:"Direction_Toggle_FL",
    color:color2,
  },
  {
    //topic:"Rear_left_arm/DirectionChangeService",
    name:"rear left direction toggle",
    value:"Direction_Toggle_RL",
    color:color1,
  },
  {
    //topic:"Rear_right_arm/DirectionChangeService",
    name:"rear right direction toggle",
    value:"Direction_Toggle_RR",
    color:color3,
  },
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"front right direction toggle",
    value:"Direction_Toggle_FR",
    color:color4,
  },
]
const otherbuttons = [
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"Collection mode",
    value:"Collection Mode",
  },
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"Homing",
    value:"Homing",
  },
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"Anchor mode",
    value:"Anchor Mode",
  },
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"Cruise mode",
    value:"Cruise mode",
  },
  {
    //topic:"Front_right_arm/DirectionChangeService",
    name:"KILL",
    value:"KILL",
  },
]
const sliders = {
  FL:{
    topic:"/FRONT_LEFT_ARM/speedValues"
  },
  FR:{
    topic:"/FRONT_RIGHT_ARM/speedValues"
  }
}
async function Publish(topic,val)
{
  const ret = val
  const top = topic?topic:commonTopic;
  await Amplify.PubSub.publish(top, ret);
//   console.log({
//     topic:top,
//     value:ret,
//   });
}
const Avinash = ()=>{
    const [messages,setMessages] = useState();
    const [FLSlider,setFLSlider] = useState(1750);
    const [FRSlider,setFRSlider] = useState(1750);
    const [FLDisabled, setFLDisabled] = useState();
    const [FRDisabled, setFRDisabled] = useState();
    const [date,setDate] = useState(new Date());
    const [angle1,setAngle1] = useState(((date.getHours()%12)/12)*360);
    const [angle2,setAngle2] = useState((date.getMinutes()/60)*360);
    const [angle3,setAngle3] = useState(((date.getHours()%12)/12)*360);
    const [angle4,setAngle4] = useState((date.getMinutes()/60)*360);
    var c = 0;
    var d = 0;
    const [dis,setDis] = useState([1,1,1,1]);
    // Amplify.PubSub.subscribe('logger/machine').subscribe({
    //     next: data => {setMessages([...messages,data.value.data]);},
    //     error: error => console.error(error),
    //     close: () => console.log('Done'),
    // });
    useEffect(()=>{
    Amplify.PubSub.subscribe('/sensorValues/positionValues').subscribe({
        next: data => {
            setAngle1(data.value.positionValues[0]);
            setAngle2(data.value.positionValues[1]);
            setAngle3(data.value.positionValues[2]);
            setAngle4(data.value.data.positionValues[3]);
            setMessages(data.value);
           
        },
        error: error => console.error(error),
        close: () => console.log('Done'),
    });})
    const handleFL = (e)=>
    {
      var val = parseInt(e.target.value)
      setFLSlider(val);
      Publish(sliders.FL.topic,val);
    }
    const handleFR = (e)=>
    {
      var val = parseInt(e.target.value)
      setFRSlider(val);
      Publish(sliders.FR.topic,val);
    }
    const handlePress = (b)=>
    {
      Publish(commonTopic,b.value);
    }
    const handleToggle = (e,b)=>
    {
        var i = parseInt(e.target.id);
        var k = 0;
        setDis(dis.map(di=>{return i===k++?di===0?1:0:di;}));
        if(e.target.checked)
        {
            Publish(commonTopic,b.srValue);
        }
        else
        {
            Publish(commonTopic,b.spValue);
        }
    }
    return (
      <div className="App">
        <input type="Number" onChange={e=>setAngle1(e.target.value)}value={angle1}/>
        <input type="Number" onChange={e=>setAngle2(e.target.value)}value={angle2}/>
        <input type="Number" onChange={e=>setAngle3(e.target.value)}value={angle3}/>
        <input type="Number" onChange={e=>setAngle4(e.target.value)}value={angle4}/>
        <svg height="400" width="800">
            <Arm angle1={90-angle1} angle2={180-angle2} base={base1} color1={color1} color2={color2}/>
            <Arm angle1={angle3-90} angle2={angle4-180} base={base2} color1={color3} color2={color4}/>
            <rect x={base2.x} y={base2.y-20} height={40} width={base1.x-base2.x} fill={"blue"}/>
        </svg>
        <div className="Inputs">
          <ul>
            {srspbuttons.map(b=><li><label class="switch"><input type="checkbox" id={c++} onClick={(e)=>{handleToggle(e,b)}}/><span class="toggle" style={{backgroundColor:b.color}}></span></label></li>)}
          </ul>
          {/* <ul>
            {stopbuttons.map(b=><li><button onClick={()=>{handlePress(b)}}>{b.name}</button></li>)}
          </ul> */}
        <ul>
            {dirbuttons.map(b=><li><button style={{backgroundColor:b.color}} class="dir" disabled={dis[d++]} onClick={()=>{handlePress(b)}}></button></li>)}
        </ul>
        <ul style={{display:"table"}}>
          <li>
            <label>FR speed: {FRSlider}</label>
            <input disabled={FRDisabled} type="range" min="1750" max="3500" value={FRSlider} onChange={handleFR}/>
            <button onClick={(e)=>{Publish(commonTopic,!FRDisabled?"FRONT_RIGHT_ARM_speedEnabled_False":"FRONT_RIGHT_ARM_speedEnabled_True");setFRDisabled(!FRDisabled); }}>slider on/off</button>
          </li>
          <li>
            <label>FL speed: {FLSlider}</label>
            <input disabled={FLDisabled} type="range" min="1750" max="3500" value={FLSlider} onChange={handleFL}/>
            <button onClick={()=>{Publish(commonTopic,!FLDisabled?"FRONT_LEFT_ARM_speedEnabled_False":"FRONT_LEFT_ARM_speedEnabled_True"); setFLDisabled(!FLDisabled);}}>slider on/off</button>
          </li>
        </ul>
        <ul>
            {otherbuttons.map(b=><li><button onClick={()=>{handlePress(b)}}>{b.name}</button></li>)}
        </ul>
        </div>
        <h1>Sensor Data</h1>
        <div>
          <p>
          {JSON.stringify(messages)}
          </p>
        </div>
        </div>
    );
}
export default Avinash;