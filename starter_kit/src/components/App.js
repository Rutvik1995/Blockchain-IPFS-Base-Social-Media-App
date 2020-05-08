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
import register from './register.js';
import login from './login.js';
import MainPage from './MainPage.js';
import addProfilePic from './addProfilePic.js';
import checkRequest from './checkRequest.js';
import searchFriends from './searchFriends.js';
import { Form, Button, FormGroup, FormControl, ControlLabel,Card,ButtonToolbar } from "react-bootstrap";
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var crypt = new Crypt();
var rsa = new RSA();
class App extends Component {


    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockChainData();


 

    }

    // Get the account 
    // Get the network
    // Get Smart contract
    // Get the Meme Hash 

 
    async loadBlockChainData(){
      var web3 = window.web3;
      var accounts = await web3.eth.getAccounts();
      console.log(accounts);
      this.setState({account:accounts[0]})
      const networkId= await web3.eth.net.getId();
      const networkData =Meme.networks[networkId];
      console.log(networkId);

      // if(networkId){
      //   //Fetch the smart contract
      //   const abi = Meme.abi;
      //   const address = networkData.address;
      //   const contract = web3.eth.Contract(abi,address);
      //   this.setState({contract:contract})
      //   console.log(contract );
      //   const memHash = await contract.methods.get().call();
      //   console.log(memHash );
      //   this.setState({memeHash:memHash})
      // }
      // else{
      //   window.alert("smart contract nor deployed to dected network");
      // }

    }

    constructor(props){
      super(props);
      this.state={
        account:'',
        buffer:null,
        Contract:null,
        userInformationHash:'',
        userEmailId:'',
        IPFSuserInformationHash:''

      };
      this.filesrc="";
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
    pausecomp=(millis)=>{
      var date = new Date();
      var curDate = null;
      do { curDate = new Date(); }
      while(curDate-date < millis);
     }

    handleClick=()=>{
      var firstName=document.getElementById("firstName").value;
      var lastName =document.getElementById("lastName").value;
      var emailId = document.getElementById("emailId").value;
      var password = document.getElementById("password").value;
      console.log(firstName);
      
    var myObj = {
      "firstName":firstName,
      "lastName":lastName,
      "fullName":firstName+" "+lastName,
      "password":password,
      "emailId":emailId,
    }
    var originalContentString = Buffer.from(JSON.stringify(myObj));

    ipfs.add(originalContentString ,(error,results)=>{
      this.setState({IPFSuserInformationHash:results})      
    });
    this.pausecomp(5500);

    var publicKey;
    var privateKey;
      rsa.generateKeyPair(function(keyPair) {
              // Callback function receives new key pair as a first argument
            console.log(keyPair.publicKey);
            console.log(keyPair.privateKey);
      });
       console.log(this.state.IPFSuserInformationHash);

    }


  // Hash QmNZNHWxYqPY57bodafqkzqmXYVu9LE3FteJhMmZGBackw
  //url https://ipfs.infura.io/ipfs/QmNZNHWxYqPY57bodafqkzqmXYVu9LE3FteJhMmZGBackw

  onSubmit=(event)=>{
    event.preventDefault();
    console.log("in submit event");

    var name ="Rutvik";
    var myObj = {
      "name":"John",
      "age":30,
      "cars": {
        "car1":"Ford",
        "car2":"BMW",
        "car3":"Fiat"
      }
     }


    ipfs.add(myObj,(error,results)=>{
      //Do Stuff here
      //console.log("IPFS RESULT",results[0].hash);
      console.log(results);
      console.log(error);
      if(error){
        console.log(error);
        return;
      }
      //Step 2 is to store file on blockchain
      console.log("after cal back");
    })
    
  }

  render() {

    console.log(this.state.IPFSuserInformationHash);





    let contacts =[{
      name:'Rutvik',
      phone:'224567890'
    },
    {
     name:'Smit',
     phone:'2248175374'
   },
   {
     name:'Suraj',
     phone:'9167843536'
   },
   {
     name:'Jef',
     phone:'9837363739'
   }
 ]
  console.log(contacts);
  const listItems = contacts.map((contact) =>
  <li>{contact.name}</li>
);

    return (
      <div>
      <BrowserRouter>
        {/* <Navbar/> */}
        {/* <Route exact path='/' component={Home}></Route> */}
        
        <Route path='/register' component={register}></Route>
        <Route path='/login' component={login}></Route>
        <Route path='/MainPage' component={MainPage}></Route>
        <Route path='/addProfilePic' component={addProfilePic}></Route>
        <Route path='/searchFriends' component={searchFriends}></Route>
       <Route path='/checkRequest' component={checkRequest }></Route>
        </BrowserRouter>
    
        
      </div>
    );
  }
}

export default App;
