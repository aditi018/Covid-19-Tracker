import React, { useEffect, useState } from "react";
import { 
  MenuItem, 
  FormControl, 
  Select,
  Card, 
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js"
import {sortData,prettyPrintStat} from "./utils.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            code: country.countryInfo.iso3,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === "Worldwide" ? 
    "https://disease.sh/v3/covid-19/all" : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  };
  console.log("Country Info >>>",countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID - 19 - Tracker...</h1>
          <FormControl className="appDropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem 
                value={country.code}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
          
          active = {casesType === "cases"}
          onClick={e => setCasesType("cases")}
          title="Coronavirus Cases" 
          total={prettyPrintStat(countryInfo.cases)} 
          cases={prettyPrintStat(countryInfo.active)} />
          <InfoBox 
          active = {casesType === "recovered"}
          onClick={e => setCasesType("recovered")}
          title="Recovered" 
          total={prettyPrintStat(countryInfo.population)} 
          cases={prettyPrintStat(countryInfo.recovered)} />
          <InfoBox 
          
          active = {casesType === "deaths"}
          onClick={e => setCasesType("deaths")}
          title="Deaths" 
          total={prettyPrintStat(countryInfo.population)} 
          cases={prettyPrintStat(countryInfo.deaths)} />
        </div>
        <Map 
        casesType= {casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
          <CardContent>
            <h2>Live cases by Country</h2>
            <Table countries={tableData}/>
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
