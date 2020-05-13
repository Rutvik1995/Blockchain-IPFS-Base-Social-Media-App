import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import './file.css'; 
import ReactDOM from 'react-dom'
import Files from 'react-files'

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;


class MainPage  extends Component{

  
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
          buffer:null,
        };       
      }

      async componentWillMount(){
        this.loadData();
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
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }
      checkValue=()=>{
        // console.log(this.props.location.TotalUser);
        // console.log(this.props.location.fullName);
        //console.log()
        console.log(this.state. fullName);
        console.log(this.state.userEmailId);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser);
        console.log("Orginal Value");
        console.log(this.props.location.userBlockchainResultOfParticularUser);
      }

      addFriend=()=>{
       console.log("In create Account");
          this.props.history.push({
            pathname: '/AddFriend',
            data: this.state.currentEmailId,
            name: this.props.location.name   // your data array of objects
          })

      }
      addPost=()=>{
        this.props.history.push({
          pathname: '/addPost',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
      }
      checkFriendRequest=()=>{
        console.log("In check friend request");
        console.log(this.state.userEmailId);
        console.log(this.state.fullName);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser);
           this.props.history.push({
             pathname: '/checkRequest',
             userEmailId: this.state.userEmailId,
             fullName:  this.state. fullName,
             userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
             totalUser:this.state.totalUser,
             userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
           })
 
       }
       openTimeline=()=>{
        console.log("In check friend request");
        var t="adv";
        this.props.history.push({
          pathname: '/Timeline',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }
       postRead=()=>{
         var url ="QmYah59VfHQTNPnhk1f5hwnVqkxRC6CB9xvMjzLro9VBsw";
        this.props.history.push({
          pathname: '/postReader/'+url,
         // data: this.state.currentEmailId,
          //name: this.props.location.name   // your data array of objects
        })
       }

       feed=()=>{

        this.props.history.push({
          pathname: '/Feed',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }
       addProfilePic=()=>{
        this.props.history.push({
          pathname: '/addProfilePic',
          userEmailId: this.state.userEmailId,
          fullName:  this.state. fullName,
          userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
          totalUser:this.state.totalUser,
          userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
        })


     
       }
       searchFriends=()=>{
        console.log("in people");
        this.props.history.push({
          pathname: '/searchFriends',
          userEmailId: this.state.userEmailId,
          fullName:  this.state. fullName,
          userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
          totalUser:this.state.totalUser,
          userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
        })
       }

       friend=()=>{
        this.props.history.push({
          pathname: '/friend',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }
       signOut=()=>{
        this.props.history.push({
          pathname: '/login',
           // your data array of objects
        })
       }
       openPostModel=()=>{
         console.log("inside open");
         this.setState({ showModal: true });
       }
       closePostModel=()=>{
        console.log("inside close");
        this.setState({ showModal: false });
       }
       getPostLink=()=>{
        this.setState({ showModal: true });
      }
      captureFile=(event)=>{
        console.log(ipfs );
        event.preventDefault();
        console.log("file is capture");
        console.log(event);
        console.log(event.target.files[0]);
        var file = event.target.files[0];
        var reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        
  
    
        reader.onloadend = ()=>{
          console.log(reader.result);
          this.setState({buffer:Buffer(reader.result)})
          console.log("buffer",Buffer(reader.result));
        }
        //process the file inside here 
    }
    actuallyPost=()=>{
      window.open( 
              "http://localhost:8888/Facebook-sdk/facebooksdk/?url?=http://localhost:3000/MainPage", "_blank"); 
       
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
      const mystyle2 = {
        padding: "10px",
        fontFamily: "Arial",
        cursor: "pointer",
        borderStyle: "solid",
        color:"while",
        backgroundColor: "#365899",
        color:"#fff"
      };
      const mystyle3={
        paddingLeft:"20px"
      }

      var cardStyle={
        
        padding:"10px 10px 10px 10px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
       // width:"1000px 
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
      height:"280px",
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
      var addPost= {
        float: "right",
        background: "#365899",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        //padding: "10px 15px",
        //borderRadius: "6px"
      }
      var modalPost= {
     
        background: "#365899",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        //padding: "10px 15px",
        //borderRadius: "6px"
      }

      var modalBorder={
        borderStyle: "solid",
        borderColor: "#365899"
      }
      var fileUpload={
        fontSize: "20px",
        height:"40px",
        color:"blue",
        background: "#365899",
        borderStyle: "solid",
        borderColor: "#365899"
      }
      const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};
        // console.log("hello in main page");
        // console.log(this.props);
        // console.log(this.props.location.data['emailId'])
        // console.log("just checking");

        // var t = 'Rutvik';
        //this.setState({displayEmailId:this.props.location.data['emailId']})
        //console.log(this.state.name);
      console.log("Name state object "+this.state.fullName);
        return(
            <div>
                <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                      className="navbar-brand col-sm-3 col-md-2 mr-0 text-center"
                      target="_blank"
                      rel="noopener noreferrer">
                    <h1></h1>
                    <p></p>
                    <div></div>
                    </a>
                 </nav>
                 <br></br>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtRwMIKUhJfgz64gGRnrGmgHWdPsnP4zv_HlocpHesF_3BM8Aw&usqp=CAU"}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" onClick={this.checkFriendRequest}> <span className="fa fa-id-badge"></span>   Check Request</Button></Nav.Link>
                        <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link>
                        </Nav>
                    <Button variant="primary"  style={{marginRight: "10px" }}>
                    
                     {this.state.fullName}
                     
                     </Button>
                    <Button Button variant="light" onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                  
                </Navbar.Collapse>
                </Navbar>

                <div>
                    <div className="row">
                    <div className="col-3">
                      <div style={ mystyle3}>
                      <ListGroup>
                        <ListGroup.Item style={mystyle2}>
                          <div className="row">
                           
                            <div className="col-2">
                              <img style={photo} src={"https://scontent.fsac1-1.fna.fbcdn.net/v/t31.0-8/11951652_1816082501951513_7968710402511981212_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=ZpHVjI_jOdkAX8b8yFK&_nc_ht=scontent.fsac1-1.fna&oh=842fde38a2f75b6610bcc84024cf39a4&oe=5EE0FB2A"} ></img>
                              </div>
                              <div className="col-10">
                              <span style={{fontSize:"20px"}}><h4>{this.state.fullName}</h4></span>
                              </div>
                                                        
                          </div>
                         
                        </ListGroup.Item>
                        <ListGroup.Item style={mystyle} >Friend List</ListGroup.Item>
                        <ListGroup.Item style={mystyle}  >Add Profile Pic</ListGroup.Item>
                        <ListGroup.Item style={mystyle}>About</ListGroup.Item>
                        <ListGroup.Item style={mystyle} >Vestibulum at eros</ListGroup.Item>
                      </ListGroup>
                      </div>
                    </div>
                    <div className="col-7">
                    <div style={cardStyle}>
                        <div style={card} expand="false">
                          <div style={info}>
                              <img style={photo} src={"https://scontent.fsac1-1.fna.fbcdn.net/v/t31.0-8/11951652_1816082501951513_7968710402511981212_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=ZpHVjI_jOdkAX8b8yFK&_nc_ht=scontent.fsac1-1.fna&oh=842fde38a2f75b6610bcc84024cf39a4&oe=5EE0FB2A"} ></img>
                            <div style={name}><h4>{this.state.fullName}</h4></div>
                          </div>
                          <input type="text" style={username} name="username" placeholder="what's on your mind," required />  
                          <hr></hr>
                          <Button style={addPost}  onClick={this.openPostModel}>Add Post</Button>
                        </div>
                    </div>
                    </div>
                  </div>
               </div> 


            <Modal show={this.state.showModal} onHide={this.closePostModel} stye={modalBorder}  size="lg">
                  <Modal.Header closeButton>
                   <Modal.Title>Create Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div style={cardStyle}>
                          <div style={card2} expand="false">
                            <div style={info}>
                                <img style={photo} src={"https://scontent.fsac1-1.fna.fbcdn.net/v/t31.0-8/11951652_1816082501951513_7968710402511981212_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=ZpHVjI_jOdkAX8b8yFK&_nc_ht=scontent.fsac1-1.fna&oh=842fde38a2f75b6610bcc84024cf39a4&oe=5EE0FB2A"} ></img>
                              <div style={name}><h4>{this.state.fullName}</h4></div>
                            </div>
                            <br></br>
                            <MDBInput type="textarea"  rows="5" />     
                          </div>
                    </div>
                    <div>
                    <input type="file"  onChange={this.captureFile}/> 
                    </div>
   
                    <hr></hr>
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

export default MainPage;