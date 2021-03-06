import React, { Component } from 'react';
//import logo from '../logo.png';
import Web3 from 'web3';
import {BrowserRouter,Route} from 'react-router-dom';
// import Jumbotron from 'react-bootstrap/Jumbotron'
import './App.css';
import Meme from '../abis/Meme.json';
// import { MDBCol, MDBInput } from "mdbreact";
import {  RSA } from 'hybrid-crypto-js';
import register from './register.js';
import register2 from './register2.js';
import login2 from './login2';
import login from './login.js';
import MainPage from './MainPage.js';
import addProfilePic from './addProfilePic.js';
import checkRequest from './checkRequest.js';
import searchFriends from './searchFriends.js';
import middle from './middle.js';
import timeline from './timeline.js';
import checkRequest2 from './checkRequest2.js';
import searchFriends2 from './searchFriends2.js';
import searchFriends3 from './searchFriends3.js';
import viewPost from './viewPost.js';
import videoViewer from './videoViewer.js';
import MainPage2 from './MainPage2.js';
import MainPage3 from './MainPage3.js';
import viewPost2  from './viewPost2.js';
import about from './about.js';

// import { Form, Button, FormGroup, FormControl, ControlLabel,Card,ButtonToolbar } from "react-bootstrap";
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var rsa = new RSA();
class App extends Component {


    async componentWillMount(){
      await this.loadWeb3();
      await this.loadBlockChainData();


 

    }

 

 
    async loadBlockChainData(){
      var web3 = window.web3;
      var accounts = await web3.eth.getAccounts();
     // console.log(accounts);
      this.setState({account:accounts[0]})
      const networkId= await web3.eth.net.getId();
     // const networkData =Meme.networks[networkId];
     // console.log(networkId);

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

 


  // Hash QmNZNHWxYqPY57bodafqkzqmXYVu9LE3FteJhMmZGBackw
  //url https://ipfs.infura.io/ipfs/QmNZNHWxYqPY57bodafqkzqmXYVu9LE3FteJhMmZGBackw

  onSubmit=(event)=>{
    event.preventDefault();
    //console.log("in submit event");

    
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
  //console.log(contacts);
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
        <Route path='/login2' component={login2}></Route>
        <Route path='/MainPage' component={MainPage}></Route>
        <Route path='/addProfilePic' component={addProfilePic}></Route>
        <Route path='/searchFriends' component={searchFriends}></Route>
       <Route path='/checkRequest' component={checkRequest }></Route>
       <Route path='/timeline' component={timeline }></Route>
       <Route path='/checkRequest2' component={checkRequest2 }></Route>
       <Route path='/searchFriends2' component={searchFriends2}></Route>
       <Route path='/searchFriends3' component={searchFriends3}></Route>
       <Route path='/viewPost' component={viewPost}></Route>
       <Route path='/videoViewer' component={videoViewer}></Route>
       <Route path='/MainPage2' component={MainPage2}></Route>
       <Route path='/viewPost3;' component={viewPost2}></Route>
       <Route path='/about'component={about}></Route>
       <Route path="/middle" component={middle}></Route>
       <Route path="/register2" component={register2}></Route>
       <Route path="/MainPage3" component={MainPage3}></Route>
      
        </BrowserRouter>
    
        
      </div>
    );
  }
}

export default App;
