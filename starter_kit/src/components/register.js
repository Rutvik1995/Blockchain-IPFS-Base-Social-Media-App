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
import { Form, Button,Card} from "react-bootstrap";

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var crypt = new Crypt();
var rsa = new RSA();

class register extends Component {

    async componentWillMount(){
      document.addEventListener('csEvent', this.checkEvent);
      await this.loadWeb3();
      await this.loadBlockChainData();
    }
    async componentDidMount(){
      document.addEventListener('csEvent', this.checkEvent);
    }


    constructor(props){
      super(props);
      this.state={
        account:'',
        buffer:null,
        Contract:null,
        userInformationHash:'',
        userEmailId:'',
        IPFSuserInformationHash:'',
        publicKey:'',
        privateKey:'',
        chromeExtensionData:null,
        privateKeySaverData:[]
      };
    }

    checkEvent = (event) => {
      var data = event.detail;
      console.log(data);
      this.setState({chromeExtensionData:event});
      console.log("Nv Enter:", event);
      console.log(this.state.chromeExtensionData);
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
        //  const MemeHash =await contract.methods.get().call();
         // console.log(MemeHash);
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }
      
      test=()=>{
        console.log("in test");
        var message = 'Rutvik Patel is waiting for';
        // Encryption with one public RSA key
        var encrypted  = crypt.encrypt(this.state.publicKey, message);
        console.log(encrypted );
        console.log("After encry");
        var decrypted = crypt.decrypt(this.state.privateKey, encrypted);
        // Get decrypted message
        console.log("before");
        var message = decrypted.message;
        console.log(message);
        console.log("After decry");
      }



    pausecomp=(millis)=>{
      var date = new Date();
      var curDate = null;
      do { curDate = new Date(); }
      while(curDate-date < millis);
     }
     handleClick3 = () => {
       console.log(this.state.chromeExtensionData.detail.sendMessage);
       if(this.state.chromeExtensionData.detail.sendMessage=="Empty"){
         var obj={
            no1:1,
           emailId1:"emailId",
           privateKey1:"privateKey"
         }
         var stringObj=JSON.stringify(obj);     
         /////////********************** */
         var event = document.createEvent('Event');
          var event = new CustomEvent(
          "newMessage", 
          {
            detail: {
              message: "Hello World!",
              time: new Date(),
              name:"Rutvik Patel",
              emailId:"rpatel@csus.edu",
              privateKeyData:stringObj
            },
            bubbles: true,
            cancelable: true
          }
        )
     document.addEventListener("hello", function(event) { // (1)
       console.log("check"); // Hello from H1
     });
     console.log(event);
     event.initEvent('hello');
     document.dispatchEvent(event);
     ///******************** */
       }
       else{
        console.log(this.state.chromeExtensionData.detail.privateKeyData)
        console.log("In else")
        var dataComingFromChromeExtension=this.state.chromeExtensionData.detail.privateKeyData;
        var obj = JSON.parse(dataComingFromChromeExtension);
        var keys = [];
        for(var k in obj) 
        {
          'a nice string'.includes('nice') 
          if(k.includes('no')){
            keys.push(k);
          }
        }
        var length= keys.length;
        length++;
        var no="no"+length;
        var emailId="emailId"+length;
        var privateKey="privateKey"+length;
        obj[no]="new email";
        obj[emailId]="new EmailID";
        obj[privateKey]="private key";
        console.log(obj);
         stringObj=JSON.stringify(obj);     
        /////////********************** */
        var event = document.createEvent('Event');
         var event = new CustomEvent(
         "newMessage", 
         {
           detail: {
             message: "Hello World!",
             time: new Date(),
             name:"Rutvik Patel",
             emailId:"rpatel@csus.edu",
             privateKeyData:stringObj
           },
           bubbles: true,
           cancelable: true
         }
       )
    document.addEventListener("hello", function(event) { // (1)
      console.log("check"); // Hello from H1
    });
    console.log(event);
    event.initEvent('hello');
    document.dispatchEvent(event); 
      
      
      
      
      }

     }


     privateKeySaveFunction=(privateKeyArgument,userEmailId)=>{
      if(this.state.chromeExtensionData.detail.sendMessage=="Empty"){
        var obj={
           no1:1,
          emailId1:userEmailId,
          privateKey1:privateKeyArgument
        }
        var stringObj=JSON.stringify(obj);     
        /////////********************** */
        var event = document.createEvent('Event');
         var event = new CustomEvent(
         "newMessage", 
         {
           detail: {
             message: "Hello World!",
             time: new Date(),
             name:"Rutvik Patel",
             emailId:"rpatel@csus.edu",
             privateKeyData:stringObj
           },
           bubbles: true,
           cancelable: true
         }
       )
    document.addEventListener("hello", function(event) { // (1)
      console.log("check"); // Hello from H1
    });
    console.log(event);
    event.initEvent('hello');
    document.dispatchEvent(event);
    ///******************** */
      }
      else{
        console.log(this.state.chromeExtensionData.detail.privateKeyData)
        console.log("In else")
        var dataComingFromChromeExtension=this.state.chromeExtensionData.detail.privateKeyData;
        var obj = JSON.parse(dataComingFromChromeExtension);
        var keys = [];
        for(var k in obj) 
        {
          'a nice string'.includes('nice') 
          if(k.includes('no')){
            keys.push(k);
          }
        }
        var length= keys.length;
        length++;
        var no="no"+length;
        var emailId="emailId"+length;
        var privateKey="privateKey"+length;
        obj[no]=length;
        obj[emailId]=userEmailId;
        obj[privateKey]=privateKeyArgument;
        console.log(obj);
        
        var stringObj=JSON.stringify(obj);     
        /////////********************** */
        var event = document.createEvent('Event');
         var event = new CustomEvent(
         "newMessage", 
         {
           detail: {
             message: "Hello World!",
             time: new Date(),
             name:"Rutvik Patel",
             emailId:"rpatel@csus.edu",
             privateKeyData:stringObj
           },
           bubbles: true,
           cancelable: true
         }
       )
    document.addEventListener("hello", function(event) { // (1)
      console.log("check"); // Hello from H1
    });
    console.log(event);
    event.initEvent('hello');
    document.dispatchEvent(event); 




      }
     }


     makeid=(length)=>{
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }


     handleClick2 = () => {
        /////////
        console.log("In message");
       // var publicKey;
        //var privateKey;
        console.log("Before function");
        var firstName=document.getElementById("firstName").value;
        var lastName =document.getElementById("lastName").value;
        var emailId = document.getElementById("emailId").value;
        var password = document.getElementById("password").value;
        var fullName=firstName+" "+lastName;
        this.setState({userEmailId:emailId});
        var myObj = {
            "firstName":firstName,
            "lastName":lastName,
            "fullName":fullName,
            "password":password,
            "emailId":emailId,
            profilePicHash:'https://previews.123rf.com/images/jemastock/jemastock1909/jemastock190907419/129419865-indian-young-boy-face-profile-picture-avatar-cartoon-character-portrait-in-black-and-white-vector-il.jpg',
            requestNotAccepted:[],
            request:[],
            memberOfGroup:[],
            ownerOfGroup:[],
            friend:[],
            groupVersion:1,
            currentGroupKey:''
          };
        //This is the the data which is enter by the user 
        var userInformationHash;
        console.log(myObj);
        this.pausecomp(500);
        console.log(this.state.chromeExtensionData);
        var originalContentString = Buffer.from(JSON.stringify(myObj));
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
       
         ipfs.add(userContent,(error,results)=>{
              console.log(results);
              userInformationHash= results[0].hash;
              this.setState({IPFSuserInformationHash:results[0].hash}); 
            
              var publicKey = '';
              var privateKey ='';
              rsa.generateKeyPairAsync().then(keyPair => {
                
                 publicKey = keyPair.publicKey;
                 privateKey = keyPair.privateKey;
                 this.setState({ publicKey : publicKey });
                 this.setState({ privateKey :  privateKey });
                 console.log( publicKey);
                ///code to save private key to chrome extension 

                this.privateKeySaveFunction(privateKey,this.state.userEmailId);

                  ////end of the logic 
                 this.state.contract.methods.addUser(this.state.userEmailId,userInformationHash,publicKey).send({from: this.state.account}).then((r)=>{
                    console.log(r);
                });  

                var groupKey1=this.makeid(10);
                var groupOwner=fullName
                var groupVersion=1;
                var groupDetails=[];
                var start="noUpdate"

                var groupObj={
                  commonGroupKey:groupKey1,
                  groupOwnerName:groupOwner,
                  groupDetails:[],
                  groupVersion:1,
                  requestNotAccepted:[],
                  request:[],
                  friend:[],
                  start:start
                }
                var originalGroupString = Buffer.from(JSON.stringify(groupObj));
                // The json is change to string format 
                const groupContent= {
                  content:originalGroupString
              }
             
                ipfs.add(groupContent,(error,results)=>{
                  console.log(results[0].hash);
                    this.state.contract.methods.createGroup(emailId,results[0].hash,1).send({from: this.state.account}).then((r)=>{
                       console.log(r);
                       console.log("done");
                   });

                });
            

            });      
            });




      }




     Login=()=>{
       console.log("in login")
          this.props.history.push({
          pathname: '/login',
        })
     }

    render() {
      console.log(this.state.IPFSuserInformationHash);
    return (

      <div className="container">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <br></br>
        <br></br>
        <MDBCol md="6">
         <MDBInput hint="Search Friend" type="text" containerClass="active-pink active-pink-2 mt-0 mb-3" />
      </MDBCol>
      </nav>
        <br></br>
        <br></br>
     
      <Jumbotron>
        <h4>Hello, Bob!</h4>
        <p>
          <Button variant="primary">Add Post</Button>
        </p>
      </Jumbotron>
         <BrowserRouter>
         <Route path='/Feed' component={Feed}></Route>
         </BrowserRouter>
    

<h4>Feeds</h4>
    <Card    style={{padding: "50px" }} >
    {/* <Card.Header>Rutvik Patel</Card.Header> */}
    {/* <Card.Img variant="top" src= {`https://ipfs.infura.io/ipfs/${this.state.memHash}`}   style={{height: "100%",  width:"300px" }}   /> */}
    <Card>
  <Card.Header>Jon Snow</Card.Header>
    <Card.Body>
      <Card.Text>
        Nice day at pier 39 #SF #LovelyDay
      </Card.Text>
    </Card.Body>
    <Card.Img variant="bottom" src="https://ipfs.infura.io/ipfs/Qmd16beEoC2jhSk8nE5otsk3D1iUxu1pJg6n4ePwXwhwA9" style={{height: "100%",  width:"300px" }}/>
  </Card>

<br></br>
  <Card>
  <Card.Header>Sam Williams</Card.Header>
    <Card.Body>
      <Card.Text>
        Seeing the world in my way
      </Card.Text>
    </Card.Body>
    <Card.Img variant="bottom" src="https://scontent.fsac1-2.fna.fbcdn.net/v/t1.0-9/19989657_126715001262499_1058883775878964603_n.jpg?_nc_cat=103&_nc_sid=09cbfe&_nc_ohc=Ln4kT3-N6fUAX9pPfJz&_nc_ht=scontent.fsac1-2.fna&oh=43ef6468bf97e51a37af2b810060bfa6&oe=5E963516" style={{height: "100%",  width:"300px" }}/>
  </Card>
    <Card.Body>
      <Card.Text>
      </Card.Text>
    </Card.Body>
  </Card>
  <br />
  <Form>
            <Form.Group controlId="formBasicEmail">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" id="firstName"  placeholder="Enter First Name" />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" id="lastName" placeholder="Enter Last Name" />
              </Form.Group>
    
              <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" id="emailId" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" id="password" placeholder="Enter password" />
              </Form.Group>
              {/* <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group> */}
               <Button variant="primary" type="button" id="RegisterUser" onClick={this.handleClick2}>Register</Button>
               <br>
               </br>
               <Form.Text className="text-muted">
                     If you are already register 
                </Form.Text>
               <Button variant="primary" type="button" onClick={this.Login}>Login</Button>
               {/* <Button variant="primary" type="button" onClick={this.test}>Login</Button> */}
               {/* <Button variant="primary" type="button" id="NewButton" onClick={this.Message}>NewButton</Button> */}
            </Form>
      </div>
    );
  }
}

export default register;
