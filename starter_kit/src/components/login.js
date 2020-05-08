import React, { Component } from 'react';
//import logo from '../logo.png';
import Web3 from 'web3';
import {BrowserRouter,Route} from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron'
import './App.css';
import Meme from '../abis/Meme.json';
import { MDBCol, MDBInput } from "mdbreact";
import { Crypt, RSA } from 'hybrid-crypto-js';
import Feed  from './Feed.js';
import { Form, Button, FormGroup, FormControl, ControlLabel,Card,ButtonToolbar } from "react-bootstrap";
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var crypt = new Crypt();
var rsa = new RSA();

class login extends Component {

    async componentWillMount(){
     
      await this.loadWeb3();
      await this.loadBlockChainData();
    }
    constructor(props){
      super(props);
      this.state={
        account:'',
        buffer:null,
        Contract:null,
        userEmailId:'',
        userInformationListFromBlockChain:'',
        fullName:'',
        userJsonResultOfParticularUserFromIPFS:'',
        userBlockchainResultOfParticularUser:null
      };

    }

 
    

    async loadWeb3(){
      if(window.ethereum){
        window.web3 =new Web3(window.ethereum);
        await window.ethereum.enable();
      }
      if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
      }
      else{
        window.alert("Please use metamask");
      }
    }


    async loadBlockChainData(){
        console.log("load Blockchain load data");
        const web3_2 = window.web3;
        const accounts =  await web3_2.eth.getAccounts();
        console.log(accounts);
        this.setState({account:accounts[0]});
        console.log(this.state);
        const networkId = await web3_2.eth.net.getId();
        console.log(networkId);
        const networkdata= Meme.networks[networkId];
        if(networkdata){
          const abi =Meme.abi;
          const address = networkdata.address;
          //fetch the contract 
          const contract = web3_2.eth.Contract(abi,address);
          console.log(contract);
          this.setState({contract:contract});
          console.log(contract.methods);
          var tt= await this.state.contract.methods.userCount().call();
          var userCount=await tt;
          for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })
          }
        //  const MemeHash =await contract.methods.get().call();
         // console.log(MemeHash);
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }
      pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
       }

      login=()=>{
        console.log("login");
        var userLogin=document.getElementById("email").value;
        for(var i=0;i<this.state.userInformationListFromBlockChain.length;i++){
         if(this.state.userInformationListFromBlockChain[i].userEmailId==userLogin){
          console.log("same");
          this.setState({userEmailId:this.state.userInformationListFromBlockChain[i].userEmailId});
          
         console.log(this.state.userBlockchainResultOfParticularUser);
          console.log(this.state.userInformationListFromBlockChain[i]);

          console.log(this.state.userInformationListFromBlockChain[i][0].toString());
          console.log(this.state.userInformationListFromBlockChain[i][1])
          console.log(this.state.userInformationListFromBlockChain[i][3]);
       
          var userBlockchainHash={
            userId:this.state.userInformationListFromBlockChain[i][0].toString(),
            userHash:this.state.userInformationListFromBlockChain[i][2],
            userPublicKey:this.state.userInformationListFromBlockChain[i][3],
            //userPublicKey:this.state.userInformationListFromBlockChain[i][0]
          }
          console.log(userBlockchainHash);
          console.log("check");
          this.setState({userBlockchainResultOfParticularUser:userBlockchainHash})


          ipfs.get("/ipfs/"+this.state.userInformationListFromBlockChain[i].userHash,(error,result)=>{
           // console.log(result);
            var uint8array = new TextEncoder("utf-8").encode("¢");
            var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
            //console.log(UserStringResult);
            var userJsonResult = JSON.parse(UserStringResult);
           // console.log(userJsonResult);
            this.setState({userJsonResultOfParticularUserFromIPFS:userJsonResult});
            this.setState({fullName:userJsonResult.fullName});
            this.onToMainMenu()
            });
          console.log("after IPFS function");    
         }
      
      }
    }
    onToMainMenu=()=>{
      this.pausecomp(2000);
      console.log("In Main Menu");
      console.log(this.state.userEmailId);
      console.log(this.state.userBlockchainResultOfParticularUser);
          this.props.history.push({
            pathname: '/MainPage',
            userEmailId:this.state.userEmailId,
            fullName:this.state.fullName,
            userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
            totalUser:this.state.userInformationListFromBlockChain,
            userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
           
              // your data array of objects
          })
    }
    CreateAccountPage=()=>{
      this.props.history.push({
        pathname: '/register',})
    }
    pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
       }


       render() {
        return(
            <div className="container">
               <div className="row pt-5">
                <div className="col-12 ">
                <h1 className="site-logo text-center ">Welcome</h1>
                <hr></hr>
                <Card>
                    <Card.Header as="h5">Login</Card.Header>
                    <Card.Body>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email"  id="email"  placeholder="Enter email" />   
                        <Form.Group controlId="formBasicPassword">
                            <br></br>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" placeholder="Password" />
                        </Form.Group>                               
                        <div className="row">
                            <div className="col-sm-2">
                            <Button variant="outline-primary"  onClick={this.login}>Log In</Button>
                            </div>
                            <div className="col-sm-10">
                            <Button variant="outline-secondary" onClick={this.CreateAccountPage}>Create Account</Button>
                            </div>
                        </div>    

                    </Card.Body>
                </Card>
               
                </div>
               </div>
            </div>
        );
    }
}

export default login;