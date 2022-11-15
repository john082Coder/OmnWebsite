import React, {PureComponent,useState}  from "react"
import { Modal, Button } from 'antd'

export default class ModalTextStory extends React.Component {
    
    constructor(props) {
        super()
        this.state = {
            visible: false
        }
        //this.handleChange = this.handleChange.bind(this);
    }

    setVisible() {
        if(this.state.visible) this.setState({ visible : false})
        else{
            this.setState({ visible : true})
        }
    }

    handleChange(value){
        this.setState({
             text: value
        });
        console.log(this.state.text)
    }

    componentDidMount(){
        this.setState({visible:false})
    }

    render(){

        return(
            <div>
            <Button  style={{width:"90%",height:"200px" , fontFamily:"Cormorant Garamond", fontSize:"35px", fontWeight:"600",color:"#1F2A56"}} onClick={this.setVisible.bind(this)}> 
                    Upload story text
            </Button>
            <Modal
                title={null}
                visible={this.state.visible}
                footer={null}
                closable={false}
                width={400}
                onCancel={this.setVisible.bind(this)}
                maskClosable={true}
                style={{ borderRadius: 20 }}
                centered
            >
            <h3>Text</h3>
            <textarea style={{width : "100%", height :"100px"}} onChange={e => this.handleChange(e.target.value)}>
                
            </textarea>

            </Modal>
            </div>
        )
    }

}