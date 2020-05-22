import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import './file.css'; 
import ReactDOM from 'react-dom'
import Files from 'react-files'
var CryptoJS = require("crypto-js");

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;


class timeline  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userEmailId:'',
          fullName:'',
          userJsonResultOfParticularUserFromIPFS:null,
          userBlockchainResultOfParticularUser:null,
          totalUser:null,
          isVisible: false,
          showModal:false,
          profilePicModal:false,
          buffer:null,
          profilePicBuffer:'',
          postPicBuffer:'',
          groupInformationListFromBlockChain:[]
        };       
      }


      async componentWillMount(){
       // this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }

      updateModal(isVisible) {
        this.state.isVisible = isVisible;
        this.forceUpdate();
      }
      loadData=()=>{
        console.log("in load data");
       this.setState({fullName:this.props.location.fullName});
       this.setState({userEmailId:this.props.location.userEmailId});
       this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
       this.setState({userInformationListFromBlockChain:this.props.location.userInformationListFromBlockChain});
       this.setState({totalUser:this.props.location.totalUser});
       this.setState({userBlockchainResultOfParticularUser:this.props.location.userBlockchainResultOfParticularUser});
    }

      async loadWeb3(){
        if(window.ethereum){
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        }
        if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider);
        }
        else{
          window.alert("Use Metamask");
        } 
      }

      async loadBlockChainData(){
        const web3_2 = window.web3;
        const accounts =  await web3_2.eth.getAccounts();
        this.setState({account:accounts[0]});
        const networkId = await web3_2.eth.net.getId();
        const networkdata= Meme.networks[networkId];
        if(networkdata){
          const abi =Meme.abi;
          const address = networkdata.address;
          //fetch the contract 
          const contract = web3_2.eth.Contract(abi,address);
          console.log(contract);
          this.setState({contract:contract});
          console.log(contract.methods);
        //  const MemeHash =await contract.methods.get().call();


        //   var tt= await this.state.contract.methods.groupCount().call();
        //   var groupCount=await tt;
        //   groupCount=groupCount.toString();
        //   console.log("group Count");
        //   console.log(groupCount);
        //   for(var i=1;i<=groupCount;i++){
        //     const groupInformationListFromBlockChain= await this.state.contract.methods.groupInformation(i).call();
        //     console.log(groupInformationListFromBlockChain)
        //     if(groupInformationListFromBlockChain.groupEmailId==this.state.userEmailId){
        //       this.setState({
        //         groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
        //      })
        //     }
            
        //   }


        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }


      render(){

        var cardStyle2={
        
            padding:"10px 10px 10px 10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            textAlign:"center"
           // width:"1000px 
        }
        var cardStyle={
        
            padding:"10px 10px 10px 10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
           // width:"1000px 
        }
        var addPost= {
            float: "right",
            background: "#365899",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            //padding: "10px 15px",
            //borderRadius: "6px"
          }
          var username= {
            margin:"15px 0",
            padding:"15px 10px",
            width:"100%",
            outline:"none",
            border:"1px solid #bbb",
            borderRadius:"20px",
            display:"inline-block",
            fontSize:"20px"
            
          }
        var card={
          boxShadow:"0px 0px 0.5px rgba(10,10,10,.3)",
          alignItems:"center",
          position:"relative",
          userSelect:"none",
          overflow:"hidden",
          transition:"all .5s ease",
          padding:"10px",
          width:"850px",
          height:"100%",
          maxWidth:"100%",
          backgroundColor:"white",
          marginBottom:"10px",
          fontSize:"14px",
          borderRadius:"3px",
          borderStyle: "solid",
          borderColor: "#365899"
        }
        var card2={
            boxShadow:"0px 0px 0.5px rgba(10,10,10,.3)",
            alignItems:"center",
            position:"relative",
            userSelect:"none",
            overflow:"hidden",
            transition:"all .5s ease",
            padding:"10px",
            width:"950px",
            height:"280px",
            maxWidth:"100%",
            backgroundColor:"white",
            marginBottom:"10px",
            fontSize:"14px",
            borderRadius:"3px",
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

        return(
            <div>
                 <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtRwMIKUhJfgz64gGRnrGmgHWdPsnP4zv_HlocpHesF_3BM8Aw&usqp=CAU"}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.mainPage}> <span className="fa fa-backward"></span> Main Page</Button></Nav.Link>
                        {/* <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link> */}
                        </Nav>
                    <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}><span className="fa fa-id-badge"  ></span> Rutvik Patel</Button>
                    <Button Button variant="light" onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                </Navbar.Collapse>
                </Navbar>
                <div style={cardStyle2}>
                          <div style={card2} expand="false">
                            <div style={info}> 
                              <div style={{textAlign:"center", marginTop:"240px", marginLeft:"300px"}} >
                               <img src='https://www.biography.com/.image/t_share/MTU0ODUwMjQ0NjIwNzI0MDAx/chris-hemsworth-poses-during-a-photo-call-for-thor-ragnarok-on-october-15-2017-in-sydney-australia-photo-by-mark-metcalfe_getty-images-for-disney-square.jpg'  style={{height: "100%",  width:"300px" }}></img>
                             </div>
                            </div>
                          </div>
                    </div>
                    <div className="text-center">
                        <h2>Rutvik Patel</h2>
                    </div>
                    <div className="row">
                           <div className="col-2">
                               Hello World
                            </div>
                            <div className="col-8">In second div
                             <div style={cardStyle}>
                                 <div style={card} expand="false">
                                    <div style={info}>
                                    <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                                        <div style={name}><h4> Rutvik Patel</h4></div>
                                    </div>
                                    <br></br>
                                   
                                    <p style={{fontSize:"19px",paddingLeft:"7px" }}>Hello In measge of the post</p>
                                    <hr></hr>
                                        <br></br>
                                    <img src='https://ipfs.infura.io/ipfs/Qmd16beEoC2jhSk8nE5otsk3D1iUxu1pJg6n4ePwXwhwA9?fbclid=IwAR27zV3u3oXAC4_iLfi11MKHKS2Q4kX4Y4t0KhWRe2P11wwW2i4wbo2OyVA'  style={{height: "100%",  width:"300px",marginLeft:"200px" }}></img>
                                    <hr></hr>
                                    
                                 </div>
                            </div> 
                            </div>
                            <div  className="col-2">
                                In third div
                            </div>
                    </div>        
                    <hr></hr>
                    <div style={{textAlign:"center"}}>
                    <Button className="LogIn2" onClick={this.uploadProfilePic}>
                           Upload
                    </Button>
                    </div>
            </div>
        );
    }
}

export default timeline;