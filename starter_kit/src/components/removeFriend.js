import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import ReactSearchBox from 'react-search-box'
import './file.css'; 
import './searchFriends3.css';
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid';
import { Crypt, RSA } from 'hybrid-crypto-js';

//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })


//Crypto

const uuid = require('uuid')
var rsa = new RSA();
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var AES = require("crypto-js/aes");
var crypt = new Crypt();


//AWS
 var AWS = require('aws-sdk');
 var S3 = require('aws-sdk/clients/s3');
 var AWS = require('aws-sdk/global'),
region = "us-east-1",
secretName = "MyDemoSecret",

client = new AWS.SecretsManager({
  region: region,
  accessKeyId: "AKIAWWXYWF2R5ZCDG4UV",
  secretAccessKey:"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"
});



class removeFriend  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          search:'',
          fullName:'',
          userId:'',
          userEmailId:'',
          profilePicHash:'',
          request:[],
          userInformationListFromBlockChain:'',
          userInformationFromIPFS:[],
          groupInformationListFromBlockChain:[],
          groupInformationFromIPFS:null,
          publicKeyMap:null,
          userPrivateKey:'',
          friendList:[]
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
        var secondUrl=url.substring(35,url.length);
        console.log(secondUrl);
        this.setState({userId:secondUrl});
        var secretId=secondUrl;
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


        var privateKey;
        client.getSecretValue({SecretId: this.state.userId}, function(err, data) {
          console.log("inside function");
          console.log(data.SecretString);
          privateKey=data.SecretString;
        });

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
       
        this.setState({publicKeyMap:new Map()});
        for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            console.log(userInformationListFromBlockChain)
            this.state.publicKeyMap.set(userInformationListFromBlockChain.userId,userInformationListFromBlockChain.publickey);
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })

            //console.log(this.state.userInformationListFromBlockChain)
           // ipfs.get("/ipfs/"+userInformationListFromBlockChain.userHash,(error,result)=>{
            ipfs.files.read("/user/"+userInformationListFromBlockChain.userId+"/userInformationTable",(error,result)=> {
               // console.log(result[0]);
                 var userJsonResult = JSON.parse(result);
                 console.log(userJsonResult);
                 this.setState({
                    userInformationFromIPFS:[...this.state.userInformationFromIPFS, userJsonResult]
                  })
                  if(userJsonResult.userId==this.state.userId)
                  {
                    console.log(userJsonResult);
                    this.setState({fullName:userJsonResult.fullName});
                    console.log(this.state.fullName);
                    this.setState({profilePicHash:userJsonResult.profilePicHash});
                    console.log(this.state.profilePicHash);
                  }
            });

          }




          //getting group information 

          tt= await contract.methods.groupCount().call();
          var groupCount=await tt;
          console.log(this.state.groupInformationSet);
          
         this.setState({ groupInformationMap:new Map()});
         this.setState({ blockChainIdforUserMap:new Map()});
                   for(var i=1;i<=groupCount;i++){
                     const groupInformationListFromBlockChain= await contract.methods.groupInformation(i).call();

                     //console.log(groupInformationListFromBlockChain)
                     //console.log(groupInformationListFromBlockChain.groupId.toString());
                     this.state.blockChainIdforUserMap.set(groupInformationListFromBlockChain.groupOwnerUserId,groupInformationListFromBlockChain.groupId.toString())
                       this.setState({
                         groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
                      })
                     if(groupInformationListFromBlockChain.groupOwnerUserId==this.state.userId){
                         console.log("-------------");
                         console.log("in if");
                      // ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                        ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
                         var groupJsonResult = JSON.parse(result);
                          console.log(groupJsonResult);
                          this.setState({groupInformationFromIPFS:groupJsonResult});
                          this.state.groupInformationMap.set(groupInformationListFromBlockChain.groupOwnerUserId,groupJsonResult)
                          

                          var groupVersionLength = groupJsonResult.groupInformation.length;
                          console.log(groupVersionLength);
                          var friendList= groupJsonResult.groupInformation[groupVersionLength-1];
                          console.log(friendList);
                          console.log(friendList.groupMembers);
                          this.setState({friendList:friendList.groupMembers});
                       });
                     }
                     else{
                       // ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                          ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
                            var groupJsonResult = JSON.parse(result);
                             console.log(groupJsonResult);
                             this.state.groupInformationMap.set(groupInformationListFromBlockChain.groupOwnerUserId,groupJsonResult)
                             
                          });
                     }
                    // console.log(this.state.groupInformationMap);
                    this.pausecomp(2000)
                    this.setState({userPrivateKey:privateKey});
//console.log(this.state.userPrivateKey);
                   }


      }
      else{
        window.alert("Smart contract not deployed to detected the network");
      }
    }
    pausecomp=(millis)=>{
      var date = new Date();
      var curDate = null;
      console.log("in pause");
      do { curDate = new Date(); }
      while(curDate-date < millis);

     }

     generateHexString=()=> {
      var ret = "";
      while (ret.length < 32) {
        ret += Math.random().toString(16).substring(2);
      }
      return ret.substring(0,32);
    }

     removeFriend=(data)=>{
      console.log(data);
      console.log(this.state.blockChainIdforUserMap);
      var groupIdMap=this.state.blockChainIdforUserMap;
     //console.log(this.state.groupInformationMap);
      //console.log(this.state.blockChainIdforUserMap);
      //console.log(this.state.publicKeyMap)
    

      //Remove from current person 
      var groupInformationTable=this.state.groupInformationMap.get(this.state.userId);
      console.log(groupInformationTable);
      var groupInformation=groupInformationTable.groupInformation;
      console.log(groupInformation);
      var groupVersionLength=groupInformation.length;
      var friendList=this.state.friendList;

      //Generating new Key
      var groupKey=this.generateHexString();

      //
      var groupInformationObj={
        groupKeyVersion:groupVersionLength+1,
        groupMembers:[]
      }
      console.log(groupInformationObj);

      var groupMembers=[]

      for(var i=0;i<friendList.length;i++){
        console.log(this.state.publicKeyMap.get(friendList[i].userId));
        var publicKeyOfFriend=this.state.publicKeyMap.get(friendList[i].userId)
        var encryptedGroupKey= crypt.encrypt(publicKeyOfFriend,groupKey );

        var userObj={
          userId:friendList[i].userId,
          fullName:friendList[i].fullName,
          encryptedGroupKey:encryptedGroupKey
        }
        console.log(data.groupOwnerUserId);
        console.log(friendList[i].userId);
       
        if(data.userId==friendList[i].userId){
          
        }
        else{
          groupMembers.push(userObj);
        }
        //console.log(userObj);
      }
      console.log(groupMembers);
      groupInformationObj.groupMembers=groupMembers;
      console.log(groupInformationObj);
      groupInformationTable.groupInformation.push(groupInformationObj);
      console.log(groupInformationTable);

      var stringGroupObj = Buffer.from(JSON.stringify(groupInformationTable));
    
  
      console.log("----");
      ipfs.files.write('/user/'+this.state.userId+"/"+"groupInformationTable",stringGroupObj, { create: true },(error,results)=>{
        console.log("inside");
        console.log(results);
          ipfs.files.stat('/user/'+this.state.userId+"/"+"/groupInformationTable", (error,results)=>{
            console.log("inside");
          console.log(results);
          var id = this.state.blockChainIdforUserMap.get(this.state.userId);

          this.state.contract.methods.changeGroupInformation(id,results.hash).send({from: this.state.account}).then((r)=>{
            console.log(r);
            console.log("done");
        });

        })
      })

     }





      render(){


        let list = this.state.friendList.map(people => 
          <Card className="cardBorder">
    <Card.Body>
    <div className="container">
              <div className="box media">
            <figure className="image is-96x96 media-left">
              <img src="https://previews.123rf.com/images/jemastock/jemastock1909/jemastock190907419/129419865-indian-young-boy-face-profile-picture-avatar-cartoon-character-portrait-in-black-and-white-vector-il.jpg" style={{height: "100%",  width:"150px" }} alt={"Rutvik"} />
            </figure>
            <div className="media-content">
              {/* <p className="subtitle"><b><h4>{people.name}</h4></b></p> */}
              <Card.Title>{people.fullName}</Card.Title>
              <br></br>
              {/* <Card.Link onClick={() => this.acceptFriendRequest(people)}><Button variant="primary" size="sm" >Accept</Button></Card.Link> */}
              <Card.Link  onClick={() => this.removeFriend(people)} ><Button variant="secondary" size="sm" >Remove Friend</Button></Card.Link>
            </div>
          </div>
          </div>
      </Card.Body>
  </Card>
  //
         );


        return(
          <div>
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Great+Vibes" />
          <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>  

          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
              <a className="navbar-brand col-sm-3 col-md-2 mr-0 text-center" target="_blank" rel="noopener noreferrer">
              <h1></h1>
              <p></p>
              <div></div>
              </a>
          </nav>

          <Navbar bg="light" expand="lg">
                  <Navbar.Brand href="#home"><img  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtRwMIKUhJfgz64gGRnrGmgHWdPsnP4zv_HlocpHesF_3BM8Aw&usqp=CAU"}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="mr-auto">
                      <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.mainPage}> <span className="fa fa-backward"></span> Main Page</Button></Nav.Link>
                      {/* <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link> */}
                      </Nav>
                  <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}><span className="fa fa-id-badge"  ></span>  {this.state.fullName}</Button>
                  <Button Button variant="light" onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
              </Navbar.Collapse>
              </Navbar>
              <div className="container text-center ">
           <h2 className="ReactHeading">Check Friend Request</h2>
           <hr></hr> 
           
        {list}
              </div>
          </div>
            
        );
    }
}

export default removeFriend ;