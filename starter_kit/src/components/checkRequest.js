import React, { Component,useState } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form,InputGroup, Button, Container,Row,Col,FormGroup, FormControl, ControlLabel,Navbar,Card,ButtonToolbar,ListGroup,ListGroupItem } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron'
import ReactSearchBox from 'react-search-box'
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var CryptoJS = require("crypto-js");

class checkRequest  extends Component{

    constructor(props){
        super(props);
         
        this.state={
          account:'',
          buffer:null,
          contract:null,
          search:'',
          requestedFriendName:[],
          userEmailId:'',
          fullName:'',
          userJsonResultOfParticularUserFromIPFS:null,
          totalUser:null,
          profilePicHash:'',
          userNameList:null,
          userBlockchainResultOfParticularUser:null,
          groupKey:'',
          hasError: false 
        };       
      }




      async componentWillMount(){
        //this.pausecomp(8500);
        //this.pausecomp(4500);
        await this.loadData();
        await this.check();
        this.pausecomp(4500)
        await this.getName();
        await this.loadNameList();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }
      async loadNameList(){
        console.log(this.state.totalUserName);
      }
      async loadData(){
       
        this.setState({fullName:this.props.location.fullName});
        this.setState({userEmailId:this.props.location.userEmailId});
        this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
        this.setState({userInformationListFromBlockChain:this.props.location.userInformationListFromBlockChain});
        this.setState({totalUser:this.props.location.totalUser});
        this.setState({userBlockchainResultOfParticularUser:this.props.location.userBlockchainResultOfParticularUser});
        var groupKey=this.makeid(10)
        console.log(groupKey);
        this.setState({groupKey:groupKey});
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

     check=()=>{
      console.log(this.state.fullName);
      console.log(this.state.userEmailId)
      console.log(this.state.userJsonResultOfParticularUserFromIPFS);
      console.log(this.state.totalUser);
      console.log(this.state.userBlockchainResultOfParticularUser);
      //console.log(this.state.totalUserName);
      console.log(this.state.hasError);
      console.log(this.state.userBlockchainResultOfParticularUser.publicKey);
      var groupKey=this.state.groupKey;
      console.log(groupKey);
      console.log(this.state.userBlockchainResultOfParticularUser.userPublicKey);
      var ciphertext = CryptoJS.AES.encrypt(this.state.groupKey, this.state.userBlockchainResultOfParticularUser.userPublicKey).toString();
      console.log(ciphertext);
      // Decrypt
       var bytes  = CryptoJS.AES.decrypt(ciphertext, this.state.userBlockchainResultOfParticularUser.userPublicKey);
       var originalText = bytes.toString(CryptoJS.enc.Utf8);
       console.log(originalText); // 'my message'

     }
     async getName(){
       console.log(this.state.userJsonResultOfParticularUserFromIPFS);
       var requestedFriendName= this.state.userJsonResultOfParticularUserFromIPFS.requestNotAccepted;
       console.log(requestedFriendName);
       for(var i=0;i<this.state.userJsonResultOfParticularUserFromIPFS.requestNotAccepted.length;i++){
        console.log(this.state.userJsonResultOfParticularUserFromIPFS.requestNotAccepted[i]);
        this.state.requestedFriendName.push(this.state.userJsonResultOfParticularUserFromIPFS.requestNotAccepted[i]);
       }
     }
     mainPage=()=>{
       console.log(this.state.userJsonResultOfParticularUserFromIPFS);
       console.log(this.state.requestedFriendName);
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
      static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
      }
      async loadBlockChainData(){
        //console.log("load Blockchain load data");
        const web3_2 = window.web3;
        const accounts =  await web3_2.eth.getAccounts();
       // console.log(accounts);
        this.setState({account:accounts[0]});
       // console.log(this.state);
        const networkId = await web3_2.eth.net.getId();
       // console.log(networkId);
        const networkdata= Meme.networks[networkId];
        if(networkdata){
          const abi =Meme.abi;
          const address = networkdata.address;
          //fetch the contract 
          const contract = web3_2.eth.Contract(abi,address);
          //console.log(contract);
          this.setState({contract:contract});
         // console.log(contract.methods);
        //  const MemeHash =await contract.methods.get().call();
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

 
      updateSearch=(event)=>{
     //  console.log(event.target.value);
       this.setState({search:event.target.value.substr(0,20)})      
      }
      addFriend=(dataParse)=>{
        
        //console.log(this.state.userHash);
        var userHash;
        var userId;
        for(var i=0;i<this.state.totalUser.length;i++){
          if(this.state.totalUser[i].userEmailId==dataParse.emailId){
            console.log("Same");
            console.log(this.state.totalUser[i].userHash);
            userHash=this.state.totalUser[i].userHash;
            userId= this.state.totalUser[i].userId.toString();
            break;
          }
        }
        ipfs.get("/ipfs/"+userHash,(error,result)=>{        
          console.log("Information of friend to add which button clicked");
          console.log(dataParse);
          console.log(dataParse.emailId);
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("Friend to be add information");
          console.log(userJsonResult);
          var obj={
            userId:this.state.userBlockchainResultOfParticularUser.userId,
            name:this.state.fullName,
            emailId:this.state.userEmailId
          }
          userJsonResult.requestNotAccepted.push(obj);
          console.log(userJsonResult);
          var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
        ipfs.add(userContent,(error,results)=>{
          console.log(results);
          var userInformationHash= results[0].hash;
          console.log(results[0].hash);  
          console.log(userId);          
             this.state.contract.methods.changeUserInformation(userId,userInformationHash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });
        });
         // userJsonResult.requestNotAccepted=obj

          });

       
        
        ipfs.get("/ipfs/"+this.state.userBlockchainResultOfParticularUser.userHash,(error,result)=>{   
          console.log("Current User Information");
          console.log(this.state.userEmailId);
          console.log(this.state.userBlockchainResultOfParticularUser.userHash);     
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("current fiend information");
          console.log(userJsonResult);
          var obj={
            userId:userId,
            name:dataParse.name,
            emailId:dataParse.emailId
          }
          userJsonResult.request.push(obj);
          console.log(userJsonResult);
          this.setState({userJsonResultOfParticularUserFromIPFS:userJsonResult})
          console.log(this.state.userJsonResultOfParticularUserFromIPFS);
          var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
        ipfs.add(userContent,(error,results)=>{
          console.log(results);
          var userInformationHash= results[0].hash;
          console.log(results[0].hash);  
          console.log(this.state.userBlockchainResultOfParticularUser.userId); 
          var id= this.state.userBlockchainResultOfParticularUser.userId;
             this.state.contract.methods.changeUserInformation(id,userInformationHash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });
          });
        });


      }
     
      acceptFriendRequest=(dataParse)=>{
        console.log(dataParse);
        var userHash;
        for(var i=0;i<this.state.totalUser.length;i++){
            if(dataParse.emailId==this.state.totalUser[i].userEmailId){
                console.log("same");
                console.log(this.state.totalUser[i].userHash);
                userHash=this.state.totalUser[i].userHash;
            }
        }
        console.log(userHash);
        ipfs.get("/ipfs/"+userHash,(error,result)=>{        
          console.log("Information of friend to add");
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("Friend to be add information");
          console.log(userJsonResult.request);
          var obj=[];
          for(var i=0;i<userJsonResult.request.length;i++){
            console.log(userJsonResult.request[i]);
            if(this.state.fullName==userJsonResult.request[i].name){
            }
            else{
              obj.push(userJsonResult.request[i]);
            }
          }
          console.log(obj);
       //   userJsonResult.requestNotAccepted=obj

          for(var i=0;i<userJsonResult.friend.length;i++){
            console.log("collect the friends");

          }
          console.log("get the public key of the friends");
          console.log("get the public key of the person who will added to the group");
          var publicKeyofCurrentUser= this.state.userBlockchainResultOfParticularUser.publicKey;


      
          });

          ipfs.get("/ipfs/"+this.state.userBlockchainResultOfParticularUser.userHash,(error,result)=>{        
            console.log("Information user of group owner ");
            
            var uint8array = new TextEncoder("utf-8").encode("¢");
            var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
            var userJsonResult = JSON.parse(UserStringResult);
            console.log("Friend to be add information");
            console.log(userJsonResult);
            console.log(userJsonResult.requestNotAccepted);
            var obj=[];
            for(var i=0;i<userJsonResult.requestNotAccepted.length;i++){
              console.log(userJsonResult.requestNotAccepted[i]);
              if(dataParse.name==userJsonResult.requestNotAccepted[i].name){
              }
              else{
                obj.push(userJsonResult.requestNotAccepted[i]);
              }
            }
            console.log(obj);
           // userJsonResult.requestNotAccepted=obj
            });
      }

      pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
       }
       
       render(){
    
        let list = this.state.requestedFriendName.map(people => 
          <Card    style={{padding: "50px" }} >
         <Card.Title style={{color: "#639407", fontWeight: "1200"  }} >{people.name}</Card.Title>
          <Card.Body>
            <Card.Link   style={{color:"#2c9fbf", fontWeight: "bold",cursor: "pointer"  }}  onClick={() => this.acceptFriendRequest(people)}>Accept</Card.Link>
            <Card.Link   style={{color:"red", fontWeight: "bold",cursor: "pointer"  }} >Reject</Card.Link>
          </Card.Body>
        </Card>
        );

       
   
        return(
          <div className="container">

              <br></br>
              <br></br>
              <button variant="primary" type="button" onClick={this.mainPage}>Main Page</button>
              <br></br>
              <br></br>
              <br></br>
            <div className="container text-center ">
            <Jumbotron>
                   <h1>Hello,{this.state.fullName} </h1>
                  <p></p>
                   <p>
                  <Button variant="primary" onClick={this.check}></Button>
                  </p>
             </Jumbotron>
            <Navbar bg="light">
               <Navbar.Brand >
               <h1>Search Friend</h1>
                 </Navbar.Brand>
             </Navbar>
             <br></br>
             <br></br>
             <input type ="text" placeholder="Search Friend By Name" value={this.state.search} onChange={this.updateSearch} style={{height: "40px",  width:"990px",  }} />
            <br></br>
            <br></br>
             <hr></hr> 
              { list }
          {/* {list2} */}
                </div>
          </div>
               );
              }
            }


export default checkRequest ;