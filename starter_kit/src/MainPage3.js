import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';

import './MainPage.css';

//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

//Crypto
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");




class MainPage3  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          fullName:'',
          userEmailId:'',
          userId:'',
          profilePicHash:'',
          userInformationListFromBlockChain:'',
          userInformationFromIPFS:'',
          showModal:false,
        };       
      }


      async componentWillMount(){
        this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }

      loadData=()=>{
        var url =window.location.href;
        console.log(url);
        var secondUrl=url.substring(32,url.length);
        console.log(secondUrl);
        this.setState({userId:secondUrl});
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
        var tt= await this.state.contract.methods.userCount().call();
        var userCount=await tt;

        for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            console.log(userInformationListFromBlockChain)
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })

            //console.log(this.state.userInformationListFromBlockChain)
            
              ipfs.files.read("/user/"+userInformationListFromBlockChain.userId+"/userInformationTable",(error,result)=> {
               // console.log(result[0]);
                 var userJsonResult = JSON.parse(result);
                 //console.log(userJsonResult);
                 this.setState({
                    userInformationFromIPFS:[...this.state.userInformationFromIPFS, userJsonResult]
                  })
                  if(userJsonResult.userId==this.state.userId)
                  {
                   // console.log(userJsonResult);
                    this.setState({fullName:userJsonResult.fullName});
                    this.setState({profilePicHash:userJsonResult.profilePicHash});
                  }
            });

          }

            console.log(this.state.userId);
        
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }



      openPostModel=()=>{
        console.log("inside open");
        this.setState({ showModal: true });
      }

      closePostModel=()=>{
        console.log("inside close");
        this.setState({ showModal: false });
       }

       
       searchFriends=()=>{
        console.log("in people");
        this.props.history.push({
          pathname: '/searchFriends3/'+this.state.userId,

        })
       }
       checkFriendRequest=()=>{
        this.props.history.push({
          pathname: '/checkRequest3/'+this.state.userId,

        })
       }
       signOut=()=>{
        this.props.history.push({
          pathname: '/login2',
           // your data array of objects
        })
       }
    


      render(){
        const mystyle = {
          padding: "20px",
          fontFamily: "Arial",
          cursor: "pointer",
          borderStyle: "solid",
          borderColor: "#365899",
          fontSize:"20px",
          textAlign: "center"
         
        };
        return(
            <div>
                  <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                  <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0 text-center"target="_blank"rel="noopener noreferrer">
                    <h1></h1>
                    <p></p>
                    <div></div>
                    </a>
                 </nav>
                 <br></br>

                 <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={this.state.profilePicHash}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.checkFriendRequest}> <span className="fa fa-id-badge"></span>   Check Request</Button></Nav.Link>
                        <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link>
                        </Nav>
                            <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}>{this.state.fullName}</Button>
                            <Button Button variant="light"  onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                  
                     </Navbar.Collapse>
                </Navbar>


                <div>
                    <div className="row">
                    <div className="col-3">
                      <div className="mystyle3">
                      <ListGroup>
                        <ListGroup.Item className="mystyle2">
                          <div className="row">
                            <div className="col-2">
                              <img className="photo"  src= {this.state.profilePicHash} ></img>
                              </div>
                              <div className="col-10">
                              <span style={{fontSize:"20px"}}><h4>{this.state.fullName}</h4></span>
                              </div>
                                                        
                          </div>
                         
                          </ListGroup.Item>
                         {/* <ListGroup.Item style={mystyle} onClick={this. getFriendsInform} >Friend List</ListGroup.Item>  */}
                        <ListGroup.Item style={mystyle} onClick={this.addProfilePic} >Add Profile Pic</ListGroup.Item>
                        {/* <ListGroup.Item style={mystyle} onClick={this.about}>About</ListGroup.Item> */}
                        <ListGroup.Item style={mystyle}  onClick={this.getFriendsInform} >Friends</ListGroup.Item>
                      </ListGroup>
                      </div>
                    </div>
                    <div className="col-7">
                    <div className="cardStyle">
                        <div className="card" expand="false">
                          <div className="info">
                              <img className="photo" src={this.state.profilePicHash} ></img>
                            <div className="name"><h4>{this.state.fullName}</h4></div>
                          </div>
                          <input type="text" className="username" name="username" placeholder="what's on your mind," required />  
                          <hr></hr>
                          <div>
                          <Button className="addPost"  id="addPost"  onClick={this.openPostModel}  >Add Post</Button>
                          </div>
                          
                          {/* <button type="button" id="addPost" >Click Me!</button> */}
                        </div>
                    </div>
                    </div>
                  </div>
               </div> 

               <Modal show={this.state.profilePicModal} onHide={this.closeProfilPicModel}  size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title style={{color:"#205663", paddingLeft:"310px"}}>Add Profile Picture</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="cardStyle2">
                          <div className="card2" expand="false">
                            <div className="info">
                                <img className="photo" src={this.state.profilePicHash} ></img>
                              <div className="name"><h4>{this.state.fullName}</h4></div>
                              <div style={{textAlign:"center", marginTop:"280px"}} >
                               <img src={this.state.profilePicHash}  style={{height: "100%",  width:"300px" }}></img>
                             </div>
                            </div>
                          </div>
                    </div>
                   
                     
                    <div>
                    <input type="file" onChange={this.captureProfilePicFile}/> 
                    </div>
   
                    <hr></hr>
                    <div style={{textAlign:"center"}}>
                    <Button className="LogIn2" onClick={this.uploadProfilePic}>
                           Upload
                    </Button>
                    </div>
                    
                  </Modal.Body>
                  <Modal.Footer>
                  <Button onClick={this.closeProfilPicModel}>Done</Button>
                </Modal.Footer>
              </Modal>


              <Modal show={this.state.showModal} onHide={this.closePostModel}   size="lg">
                  <Modal.Header closeButton>
                   <Modal.Title  style={{textAlign:"center"}} > Create Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="cardStyle">
                          <div className="card2" expand="false">
                            <div className="info">
                                <img className="photo" src={this.state.profilePicHash} ></img>
                              <div className="name"><h4>{this.state.fullName}</h4></div>
                            </div>
                            <br></br>
                           
                            <MDBInput type="textarea"  id="postTextArea" rows="5" />    
                            {/* <textarea className="textAreaStyle" class="cstTextarea" id="postTextArea" rows="4" cols="50" placeholder="what's on you"></textarea> */}
                          </div>
                          {/* <div class="clearfix" style={signatureButton}>
                            <div class="pull-right">
                            <Button variant="primary" size="sm" >Add Signature</Button>
                            <div style={postSignature}>
                                RP
                            </div>
                            </div>
                          </div> */}
                          <div class=" clearfix" className="signatureSession">
                            <div class="float-left" className="signatureButton">
                              <button type="button" class="btn btn-primary btn-sm" onClick={this.about3}  >Add Signature</button>
                            </div>
                            <div class="float-right">
                            <span className="postSignature">{this.state.signatureText}</span>
                            </div>
                          </div>
                           <hr style={{width:"40px",textAlign:"left",marginLeft:"710px",marginTop:"-15px",  position:"relative",borderTop: "7px solid" }}></hr> 
                          {/* //style={{textAlign:"center"}} */}
                          {/* <div className="btn-group" role="group" aria-label="Basic example" >
                            <button type="button" className="btn btn-primary"  onClick={this.about}>Image</button>
                            <button type="button" className="btn btn-secondary" 
        
                            style={{backgroundColor: "white",borderColor:"white"  }}
                            >Middle</button>
                            <button type="button" className="btn btn-secondary"onClick={this.about2}>Video</button>
                        </div> */}
                    </div>
                    <div>
                    <input type="file"  onChange={this.capturePostFile}/> 
                    </div>
   
                    <hr></hr>
                    
                    <div style={{textAlign:"center",padding:"15px"}}>
                      <h4>Caption</h4>
                      <p className="name">
                          {this.state.captionSetter}
                      </p>
                    </div>


                    <div style={{textAlign:"center"}}>


                    <Button className="LogIn2" alt="#" onClick={this.actuallyPost}>
                           Post
                    </Button>
                    </div>

                  </Modal.Body>
                  <Modal.Footer>
                  <Button onClick={this.closePostModel}>Done</Button>
                </Modal.Footer>
              </Modal>



            </div>
        );
    }
}

export default MainPage3;