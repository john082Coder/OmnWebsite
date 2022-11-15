import SignedInHeader from "../../components/SignedInHeader/SignedInHeader";
import React, {useEffect,useState} from "react";
import {getCookies} from "cookies-next";
import Head from "next/head";
import WordCloud from 'react-d3-cloud';
import countries from "../../utils/world_countries.json";

const ReactApexChart = loadable(() => import('react-apexcharts'));
import image from "../../assets/images/fakeNotePhoto.jpg"
import NoteBar from "../../components/NoteBar/NoteBar";
import loadable from "loadable-components";

import { Tabs, Select, Space } from 'antd';
import {privateRoute} from "../../components/privateRoute";
import {Bar, Line, Scatter, Bubble, Doughnut} from 'react-chartjs-2';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {getDashboardData,searchByYearMonth} from "../../api";
import Calendar from '../../components/Calendar/Calendar';
import DatePicker from 'react-datepicker';
import { getMonth, getYear } from 'date-fns';
import Separator from "../../components/Separator/Separator";
import {ResponsiveChoropleth} from "@nivo/geo";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Tooltip,
    Filler,
    ArcElement
  } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler, Title, Legend,);

const { TabPane } = Tabs;
const { Option } = Select;


function handleChange(value) {
    console.log(`selected ${value}`);
}

function NoteAda2(props) {
    const [zoom, setZoom] = useState(100)
    const [movV, setMovV] = useState(0.5)
    const [movH, setMovH] = useState(0.7)
    const fontSizeMapper = word => word.value*15;
    const [data, setData] = useState({});
    const [storyTypes, setStoryTypes] = useState([]);
    const [storyPercentage, setStoryPercentage] = useState([]);
    const [usersPerWeek, setUsersPerWeek] = useState([]);
    const [IngredientsItem, setIngredientsItem] = useState([]);
    const [IngredientsPercentage, setIngredientsPercentage] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [words, setWords] = useState([]);
    const [selectedNum, setSelectedNum] = useState(0);
    const [altWords, setAltWords] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    
    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        getDataByYearMonth();
    }, [startDate]);
    const getData = async() => {
        const data = await getDashboardData(props.token);
        setData(data);
        setUpdateData(data);
    }
    const getDataByYearMonth = async() => {
        let year = getYear(startDate);
        let month = getMonth(startDate)+1;
        const dataByYearMonth = await searchByYearMonth(year, month, props.token);
        setData(dataByYearMonth);
        setUpdateData(dataByYearMonth);
    }
    
    const setUpdateData = (data) =>{
        let arrType = [];
        let arrPercentage = [];
        let arrUserPerWeek = [];
        let arrIngredientsPercentage = [];
        let arrUserPerCountry = [];
        let arrWords = [];
        data.storyTypes && data.storyTypes.map((item, i) => {
            arrType.push(item.storyType);
            arrPercentage.push(item.percentage);
        })
        data.usersPerWeek && data.usersPerWeek.map((item, i) => {
            arrUserPerWeek.push(item.users);
        })
        data.mostSelectedNotesPercentage && data.mostSelectedNotesPercentage.map((item, i) => {
            arrIngredientsPercentage.push(item.percentage);
        })
        data.usersPerCountry && data.usersPerCountry.map((item, i) => {
            arrUserPerCountry[i] = {
                "id": item.countryId,
                "value": item.users
            }
        })
        data.mostSelectedNotesWords && data.mostSelectedNotesWords.map((item, i) => {
            arrWords[i] = [];
            item.words.map((navItem,j)=>{
                let altWords = {};
                altWords = {
                    "text": navItem.word,
                    "value": navItem.frequency
                }
                arrWords[i].push(altWords);
            })
        })
        setStoryTypes(arrType);
        setStoryPercentage(arrPercentage);
        setUsersPerWeek(arrUserPerWeek);
        setIngredientsItem(data.mostSelectedNotesPercentage);
        setIngredientsPercentage(arrIngredientsPercentage);
        setMapData(arrUserPerCountry);
        arrWords && setAltWords(arrWords);
        arrWords && setWords(arrWords[selectedNum]);
    }
    const handleClick = (e, value) => {
        setSelectedNum(value);
        setWords(altWords[value]);
        console.log("words",words);
    }
    const horizontalSeries= [{
        data: IngredientsPercentage
      }];
    const horizontalOptions= {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        colors: ["#CFB992"],
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: IngredientsPercentage
        },
        scales: {
            xaxis:{
                display:false,
            }
        }
    };
    const lineseries= [{
        name: 'number of users',
        data: usersPerWeek
      }];
    const lineoptions= {
        chart: {
          height: 250,
          type: 'line',
          zoom: {
            autoScaleYaxis: true
          },
        },
        colors: ["#552B32"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        xaxis: {
          type: 'weeks',
          categories: ["week1", "week2", "week3", "week4", "week5"]
        },
        tooltip: {
          x: {
            format: 'week'
          },
        },
      };
    const arcdata = {
        labels: storyTypes,
        datasets: [
            {
                label:"Audience Segments",
                data: storyPercentage,
                backgroundColor: [
                    "#552B32",
                    "#CFB992",
                    "#1F2A56",
                ],
                hoverOffset: 4,
            },
        ],
    };
    const arcconfig = {
        elements: {
            arc: {
                weight:0.5,
                borderWidth:3,
            },
        },
        cutout:"80%",
    };
    const tooltip = (e) => {
        return <div style={{zIndex: 9999, padding: 10, justifyContent: 'space-between'}}
                    className={'tooltipCard flexColumn'}>
            <span className={'smallTitle'}>{e && e.feature && e.feature.properties.name}</span>

            <span className={'bigText'}>{e.feature.data && e.feature.data.value && e.feature.data.value}</span>
        </div>
    }
    const MyResponsiveChoropleth = ({data}) => {
        return <ResponsiveChoropleth
            data={data}
            features={countries.features}
            colors="blues"
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={zoom}
            projectionTranslation={[movV, movH]}
            enableGraticule={false}
            graticuleLineColor="#dddddd"
            borderWidth={0.5}
            borderColor="#152538"
            tooltip={(e) => tooltip(e)}
            domain={[0, 100]}
        />
    }
    return (
        <>
        <div style={{height: '100%', backgroundColor:'white' , borderRadius:20}}>
            <SignedInHeader type={1} title='Note'/>
            <div className={'flexColumn'} >
                <div style={{justifyContent: 'space-between', position: 'relative', margin: '1% 1% 1% 1%', padding: '0 30px 10px 30px', border:'solid',borderWidth:2,borderColor:'#eaeaea',borderRadius:20}}>
                    <Tabs tabPosition={'top'}>                        
                        <TabPane tab="Summary" key="1">
                            <div className="client-list-header">
                                <h2 className="client-list-title" style={{fontSize:35, fontWeight:'700'}}>Summary products insights</h2>
                                <Separator />
                            </div>
                            <div className="client-list">
                                <div style={{display:'flex', justifyContent: 'flex-start', margin: '2% 0 0 4%', fontSize:15}}>
                                    <div style={{paddingTop:2,paddingLeft:10,marginRight:5,cursor: "pointer"}} onClick={getData}>SeeAll</div>
                                    <div style={{paddingTop:2,paddingLeft:20,marginRight:5}}>Month/Year</div>
                                    <DatePicker
                                        style={{marginTop: 20}}
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                    />
                                </div>
                                <Row style={{ position: 'relative', margin: '1% 5% 1% 5%', fontSize:30, fontWeight:'700',paddingLeft:'10%',paddingRight:'10%',color:'white'}}>
                                    <Col md={3} style={{border:'solid',borderWidth:2,borderColor:'white',borderRadius:20, background:'#CFB992'}}><Row style={{justifyContent:'center', fontFamily: 'auto'}}>Users</Row><Row style={{fontSize:15,fontWeight:'700',justifyContent:'center',marginBottom:10}}>{data.users}</Row></Col>
                                    <Col md={4} style={{border:'solid',borderWidth:2,borderColor:'white',borderRadius:20, background:'#CFB992'}}><Row style={{justifyContent:'center', fontFamily: 'auto'}}>Recommends</Row><Row style={{fontSize:15,fontWeight:'700',justifyContent:'center',marginBottom:10}}>NA</Row></Col>
                                    <Col md={3} style={{border:'solid',borderWidth:2,borderColor:'white',borderRadius:20, background:'#CFB992'}}><Row style={{justifyContent:'center', fontFamily: 'auto'}}>Likes</Row><Row style={{fontSize:15,fontWeight:'700',justifyContent:'center',marginBottom:10}}>0</Row></Col>
                                </Row>
                                <div style={{margin:10 , position: 'relative', margin: '0 5% 0 5% '}}>
                                        <Row>
                                            <Col md={5} className={"interestCard"}>
                                                <div style={{color:'#1F2A56',fontSize:25, fontWeight:600, paddingLeft:15, paddingBottom:15}}>Stroy Types</div>
                                                <Doughnut data={arcdata} width={50} height={50} options={arcconfig} />
                                            </Col>
                                            <Col md={7} className={"interestCard"}>
                                                <div style={{color:'#1F2A56',fontSize:25, fontWeight:600, paddingLeft:15, paddingBottom:15}}>Users PerCountry</div>
                                                <div style={{position: 'relative', width: '100%', height: "427px"}}>
                                                    <MyResponsiveChoropleth data={mapData}/>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className={"interestCard"}>
                                                <div style={{color:'#1F2A56',fontSize:25, fontWeight:600, paddingLeft:15, paddingBottom:10}}>Users PerWeek</div>
                                                <ReactApexChart options={lineoptions} series={lineseries} type="line" height={250} />
                                            </Col>
                                            <Col style={{marginLeft:15}} className={"interestCard"}>
                                                <div style={{color:'#1F2A56',fontSize:25, fontWeight:600, paddingLeft:15, paddingBottom:10}}>Emotional Cloud</div>
                                                {words ? <WordCloud
                                                    data={words}
                                                    fontSizeMapper={fontSizeMapper}
                                                    padding={2}
                                                    width={504}
                                                    height={267}
                                                />
                                                : ""}
                                            </Col>
                                        </Row>
                                        <Row style={{justifyContent: 'center', position: 'relative',color:'#1F2A56', marginTop:30, fontSize:25, fontWeight:700}}>
                                            10 Trendy Notes
                                        </Row>
                                        <Row style={{justifyContent: 'center', position: 'relative'}}>
                                            <div className={'flexColumn'} style={{paddingTop:30}}>
                                                {
                                                    IngredientsItem ? 
                                                    IngredientsItem.map((item, i) => {
                                                            return (
                                                                <div className={'flexRow'} style={{margin:1, fontSize:20, cursor:'pointer'}} key={i} onClick={event => handleClick(event,i)}>{item.note}</div>
                                                            )
                                                        })
                                                    : ""
                                                }
                                            </div>
                                            <div className={'flexColumn'} style={{marginLeft:10}}>
                                                <ReactApexChart options={horizontalOptions} series={horizontalSeries} type="bar" height={405} />
                                            </div>
                                        </Row>
                                        
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Products" key="2">
                        </TabPane> 
                    </Tabs>
                </div>
            </div>
        </div>
        </>
    )
}

export default privateRoute(NoteAda2)