import React from "react";
import numeral from "numeral";
import { Circle,Popup } from "react-leaflet";


const casesTypeColor ={
    cases:{
        hex:"#cc1034",
        multiplier:100,
    },
    recovered:{
        hex:"#7dd71d",
        rgb:"rgb(125,215,29)",
        half_op:"rgba(125,215,29,0.5)",
        multiplier:120,
    },
    deaths:{
        hex:"#fb4443",
        multiplier:150,
    },
};

export const sortData = (data)=>{
    const sortedData = [...data];


    return sortedData.sort((a,b) => (a.cases>b.cases) ? -1 :1 );
}

export const showDataOnMap = (data,casesType="cases") =>(
 data.map((country) =>(
    <Circle 
    center={[country.countryInfo.lat,country.countryInfo.long]}
    fillOpacity={0.4}
    color={casesTypeColor[casesType].hex}
    fillColor={casesTypeColor[casesType].hex}
    radius={
        Math.sqrt(country[casesType]) * casesTypeColor[casesType].multiplier
    }
    >
        <Popup>
            <div className="info-container">
                <div classname="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`,height:"100px", width:"100%", backgroundSize:"cover",borderRadius:"8px"}}></div>
                <div className="info-name" style={{fontSize:"20px",fontWeight:"bold",color:"#555"}}>{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths" style={{fontSize:"16px",marginTop:"5px"}}>Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>

    </Circle>
 ))
)

export const prettyPrintStat = (stat) =>
    stat? `+${numeral(stat).format("0,0a")}`: "+0";
