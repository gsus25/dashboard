
import './App.css'

import Grid from '@mui/material/Grid2' 
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';

import Item from './interface/Item';

{/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  let [items, setItems] = useState<Item[]>([])

  {/* Variable de estado y función de actualización */}
  let [indicators, setIndicators] = useState<Indicator[]>([])

  {/* Hook: useEffect */}
  useEffect( ()=>{
    let request = async () => { 

      {/* Request */}
      let API_KEY = "3c7331b4775fca795c7568b401f3fca9"
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
      let savedTextXML = await response.text();

      {/* XML Parser */}
      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      {/* Arreglo para agregar los resultados */}

      let dataToIndicators : Indicator[] = new Array<Indicator>();

      let dataToItems: Item[] = [];

      {/* 
          Análisis, extracción y almacenamiento del contenido del XML 
          en el arreglo de resultados
      */}

      let name = xml.getElementsByTagName("name")[0].innerHTML || ""
      dataToIndicators.push({"title":"Location", "subtitle": "City", "value": name})

      let location = xml.getElementsByTagName("location")[1]

      let latitude = location.getAttribute("latitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Latitude", "value": latitude })

      let longitude = location.getAttribute("longitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Longitude", "value": longitude })

      let altitude = location.getAttribute("altitude") || ""
      dataToIndicators.push({ "title": "Location", "subtitle": "Altitude", "value": altitude })

      console.log( dataToIndicators )

      const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toTimeString().split(' ')[0];
      };

      const timeNodes = xml.getElementsByTagName("time");
      for (let i = 0; i < Math.min(6, timeNodes.length); i++) {
        const timeNode = timeNodes[i];

        const from = timeNode.getAttribute("from") || "";
        const to = timeNode.getAttribute("to") || "";

        const precipitation = timeNode.querySelector("precipitation")?.getAttribute("probability") || "";
        const humidity = timeNode.querySelector("humidity")?.getAttribute("value") || "";
        const clouds = timeNode.querySelector("clouds")?.getAttribute("all") || "";

        dataToItems.push({ 
          dateStart: formatTime(from), 
          dateEnd: formatTime(to), 
          precipitation, 
          humidity, 
          clouds 
        });
      }

      {/* Modificación de la variable de estado mediante la función de actualización */}
      setIndicators( dataToIndicators )
      setItems(dataToItems);



    }

        request();

  }, [] )
  let renderIndicators = () => {

    return indicators
            .map(
                (indicator, idx) => (
                    <Grid key={idx} size={{ xs: 12, xl: 3 }}>
                        <IndicatorWeather 
                            title={indicator["title"]} 
                            subtitle={indicator["subtitle"]} 
                            value={indicator["value"]} />
                    </Grid>
                )
            )
     
  } 

  return (
    <Grid container spacing={5}>

        {/* Indicadores
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 1'} subtitle={'Unidad 1'} value={"1.23"} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 2'} subtitle={'Unidad 2'} value={"3.12"}/></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 3'} subtitle={'Unidad 3'} value={"2.31"}/></Grid>
        <Grid size={{ xs: 12, md: 3 }}><IndicatorWeather title={'Indicator 4'} subtitle={'Unidad 4'} value={"3.21"}/></Grid> */}
        
        {renderIndicators()}

        {/* Tabla */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Grid Anidado */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <ControlWeather/>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <TableWeather itemsIn={items}/>
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, md: 4 }}>
          <LineChartWeather/>
        </Grid>

        
       
    </Grid>
)
}

export default App
