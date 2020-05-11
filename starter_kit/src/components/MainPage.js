import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form, Button, Container,Row,Col,Navbar,Nav,ListGroup } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron'
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
        };       
      }

      async componentWillMount(){
        this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
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

    render(){
      const mystyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "10px",
        fontFamily: "Arial",
        cursor: "pointer"
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
                    <Button variant="primary"  style={{marginRight: "10px" }}><span className="fa fa-id-badge"  ></span>  {this.state.fullName}</Button>
                    <Button Button variant="light" onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                  
                </Navbar.Collapse>
                </Navbar>

                <div>
                    <div className="row">
                    <div className="col-2">
                    <ListGroup>
                        <ListGroup.Item style={{ fontWeight: "bold",cursor: "pointer"  }}><h4>{this.state.fullName}</h4></ListGroup.Item>
                        <ListGroup.Item style={mystyle} ><h4>Friend List</h4></ListGroup.Item>
                        <ListGroup.Item  >Add Profile Pic</ListGroup.Item>
                        <ListGroup.Item style={mystyle}>About</ListGroup.Item>
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                  </ListGroup>
                    </div>
                    <div className="col-8">
                    <Jumbotron>
                   <h1>Hello,{this.state.fullName} </h1>
                  <p>
                  
                  </p>
                   <p>
                  {/* <Button variant="primary">Learn more</Button> */}
                  </p>
                  </Jumbotron>
                    </div>
                  </div>
               </div> 

         


  {/* <div className="container">
                            <div>
                <p></p>
                <p></p>
                <br></br>
                <br></br>
                <button variant="primary" type="button" onClick={this.signOut}>Sign out</button>
                <p></p> 
                <br></br>
                  <Jumbotron>
                   <h1>Hello,{this.state.fullName} </h1>
                  <p>
                  
                  </p>
                   <p>
                  {/* <Button variant="primary">Learn more</Button> */}
                  {/* </p> */}
                  {/* </Jumbotron> */}

          

{/* 
                  <Container>
                    <Row>
                      <Col> <Button variant="primary" onClick={this.addPost}>Add Post</Button></Col>
                      <Col><Button variant="secondary" onClick={this.addFriend} >Add Friend</Button></Col>
                      <Col> <Button variant="success" onClick={this.openTimeline}>Timeline</Button></Col>
                     <Col><Button variant="primary" onClick={this.addProfilePic}>Add Profile Pic</Button></Col>
                    </Row>
                    <Row>
                      <Col></Col>
                      <Col><h4></h4></Col>
                      <Col><h4></h4></Col>
                      <Col><h4></h4></Col>
                      <Col><h4></h4></Col>
                    </Row>
                    <Row>
                      <Col><Button variant="primary" onClick={this.checkFriendRequest}>Check Request</Button></Col>
                      <Col><Button variant="primary" onClick={this.searchFriends}>Find Friends</Button></Col>
                      <Col><Button variant="primary" onClick={this.feed}>Feeds</Button></Col>
                      <Col><Button variant="primary" onClick={this.friend}>Friends</Button></Col>
                      <Col><Button variant="primary" onClick={this.checkValue}>Value</Button></Col>
                    </Row>
                   
                  </Container>

            </div> */}
            {/* </div> */} 
            </div>
          

            
        );
    }
}

export default MainPage;