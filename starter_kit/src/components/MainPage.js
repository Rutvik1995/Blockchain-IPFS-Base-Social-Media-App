import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form, Button, Container,Row,Col,FormGroup, FormControl, ControlLabel,Card,ButtonToolbar } from "react-bootstrap";
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
          totalUser:null
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
        // console.log("hello in main page");
        // console.log(this.props);
        // console.log(this.props.location.data['emailId'])
        // console.log("just checking");

        // var t = 'Rutvik';
        //this.setState({displayEmailId:this.props.location.data['emailId']})
        //console.log(this.state.name);
console.log("Name state object "+this.state.fullName);
        return(

            <div className="container">
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
                  </p>
                  </Jumbotron>

          


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

            </div>
            </div>

            
        );
    }
}

export default MainPage;