import React, {PureComponent,useState} from 'react';
import Header from '../components/Header/Header'
import { Modal, Button, Form, Input } from "antd";
import { render } from 'react-dom';
import VideoRecorder from 'react-video-recorder'
import Footer from '../components/Footer/Footer'
import SideStickyMenu from '../components/SideStickyMenu/SideStickyMenu'
import ModalTextStory from '../components/ModalTextStory/ModalTextStory'

export function try_it() {
    const [visible, setVisible] = useState(false)

    const handleClose = () => setVisible(false);
    const handleShow = () => setVisible(true);

    const [visible2, setVisible2] = useState(false)

    const handleClose2 = () => setVisible2(false);
    const handleShow2 = () => setVisible2(true);

    const [disabled, setDisabled] = useState(true)
    
    const [video, setVideo] = useState(null)

    const test = () =>{
        console.log("Salut", video)
    }
    return(
        <div>
            <div><Header small={true}/></div>
            <div style={{textAlign: '-webkit-center', paddingTop: 61, backgroundColor: '#F6F1EB'}}>
                <section>
                    <div className="container">
                        <div style ={{paddingTop :"50px", paddingBottom:"20px"}}>
                            <h1>Choose your method</h1>
                        </div>
                        <div class = "row" style = {{paddingBottom:"100px"}}>
                            <div class = "col">
                                <Button style={{width:"90%", height:"200px", fontFamily:"Cormorant Garamond",fontSize:"35px", fontWeight:"600", color:"#1F2A56"}} onClick={handleShow}> 
                                    Upload story video 
                                </Button>
                            </div>
                            <div class = "col">
                                <Button  style={{width:"90%",height:"200px" , fontFamily:"Cormorant Garamond", fontSize:"35px", fontWeight:"600",color:"#1F2A56"}} onClick={handleShow2}> 
                                    Upload story audio
                                </Button>
                            </div>
                            <div class = "col">
                                {/*<Button  style={{width:"90%",height:"200px" , fontFamily:"Cormorant Garamond", fontSize:"35px", fontWeight:"600",color:"#1F2A56"}} onClick={handleShow2}> 
                                    Upload story text
                                </Button>*/}
                                <ModalTextStory/>
                            </div>

                        </div>

                    </div>
                </section>
            </div>
            <Modal
                title={null}
                visible={visible}
                footer={null}
                closable={false}
                width={400}
                onCancel={() => setVisible(false)}
                maskClosable={true}
                style={{ borderRadius: 20 }}
                centered
            >
            <div>
                <h3>
                    Upload video story
                </h3>
                <div>
                    <VideoRecorder
                        onRecordingComplete={videoBlob => {
                        // Do something with the video...
                        setDisabled(false)
                        setVideo(videoBlob) 
                        console.log('videoBlob', videoBlob)
                    }}
                    
                />
                <Button disabled={disabled} onClick={test}>Upload</Button>
                </div>
            </div>
            </Modal>
            <Modal
                title={null}
                visible={visible2}
                footer={null}
                closable={false}
                width={400}
                onCancel={() => setVisible2(false)}
                maskClosable={true}
                style={{ borderRadius: 20 }}
                centered
            >
                <h3>
                    Upload audio story
                </h3>
            </Modal>
            <SideStickyMenu/>
            <Footer/> 
            {/*<ModalTextStory/>*/}
        </div>
        
    )
}

export default try_it