

import React, { Component } from 'react'

class about extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {

        let waterMark= {
            position: "absolute",
            color:"red"
          }
          var info={
            display:"flex",
            alignItems:"center",
            height:"40px"
          }
          var photo={
            height:"40px",
            width:"40px",
            backgroundColor:"gray",
            opacity:".8",
            borderRadius:"100%"
          }
        
          var name={
            
              fontWeight:"bold",
              color:"rgb(66, 103, 178)",
              opacity:".9",
              paddingLeft:"20px",
            
          }
          var tagLine={
            fontSize: "20px"
          }
          var signature ={
              marginLeft:"300px",
              fontFamily: "cursive",
              fontSize: "20px",
              color: "#00664b"
          }
          let imageStyle={
            position: "relative",
            maxWidth: "800px",
            margin: "0 auto",
            cursor: "none"
      }
      let text={
        position: "absolute",
        bottom: "0",
        background: "rgb(0, 0, 0)",
        background: "rgba(0, 0, 0, 0.5",
        color: "#f1f1f1", 
       // width: "100%" ,
        padding: "9px",
        marginLeft:"720px",
        border: "3px solid #a6a6a6",
        // borderRadius: "20px"
        fontFamily: "cursive",
        textShadow: "2px 2px 4px #000000",
        fontSize: "19px",
        pointerEvents : "none"
      }

      let border={
        border: "5px solid rgb(54, 88, 153)",
        marginLeft:"300px",
        marginRight:"300px",
        paddingBottom:"50px",
        paddingTop:"30px"
      }
        return (
            <div>
                <h2>In About Component</h2>
                <div style={ border}>
                        <div className="container">
                        <div style={info}>
                        <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                            <div style={name}><h4> {this.state.PostOwnerFullName}</h4></div>
                            <div style={name}><h4>Rutvik</h4></div>
                        </div>
                        <hr></hr>
                        <p style={tagLine}>
                            Hello World I am good to see you well I hope soo 
                            <span style={signature}>RP</span>
                        </p>
                        <hr style={{width:"40px",textAlign:"left",marginLeft:"730px",marginTop:"-15px",  position:"relative",borderTop: "7px solid" }}></hr> 
                        </div>

                        <div className="container" style={imageStyle}>
                            <img src={"https://ipfs.infura.io/ipfs/QmUpYHJj2aJMavzwzBWs27wfmCMy26odpy18zDHg2JvBrj"} style={{height:'700px', width:"100%"}} alt="Notebook" />
                            <div style={text}>
                                <p>RP</p>
                            </div>
                        </div>
                </div>
               
            </div>
        )
    }
}

export default about
