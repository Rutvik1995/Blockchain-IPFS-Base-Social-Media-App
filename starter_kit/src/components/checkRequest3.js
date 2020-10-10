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
import "./checkRequest3.css"
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
  accessKeyId: "",
  secretAccessKey:""
});





class checkRequest3  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
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
          groupKeyVersionMap:null,
          groupInformationMap:null,
          friendRequest:[],
          groupInformationSet:null,
          userPrivateKey:'',
          blockChainIdforUserMap:null
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
        var url =window.location.href;
        console.log(url);
        var secondUrl=url.substring(36,url.length);
        console.log(secondUrl);
        this.setState({userId:secondUrl});
        this.setState({groupKeyVersionMap:new Map()});
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

          const friendRequestListFromBlockChain= await contract.methods.friendRequestInformation(1).call(); 
          console.log(friendRequestListFromBlockChain);
          this.setState({groupInformationSet:new Set()});
          this.state.groupInformationSet.add("hello");
        //  ipfs.get("/ipfs/"+friendRequestListFromBlockChain.fiendRequestHash,(error,result)=>{
            ipfs.files.read("/friendRequestInformation/friendRequestInformation",(error,result)=> {
            console.log(result);
            var result = JSON.parse(result);
             console.log(result);
             this.setState({request:result});
             for(var i=0;i<result.length;i++){

              console.log(this.state.userId);
              console.log(result[i].requestToUserId);
             if(this.state.userId==result[i].requestToUserId && result[i].activeStatus=="pending"){
                this.setState({
                    friendRequest:[...this.state.friendRequest, result[i]]
                  })
            }
            console.log(this.state.friendRequest);
             }
                
          });


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
                         
                      // ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                        ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
                         var groupJsonResult = JSON.parse(result);
                          console.log(groupJsonResult);
                          this.setState({groupInformationFromIPFS:groupJsonResult});
                          this.state.groupInformationMap.set(groupInformationListFromBlockChain.groupOwnerUserId,groupJsonResult)
                          
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
console.log(this.state.userPrivateKey);
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

      mainPage=()=>{
        this.props.history.push({
          pathname: '/MainPage3/'+this.state.userId,
        })
       }

       signOut=()=>{
        this.props.history.push({
          pathname: '/login2',
           // your data array of objects
        })
       }


      checkRequest=()=>{
        console.log(this.state.request);
        console.log(this.state.request.length);
        for(var i=0;i<this.state.request.length;i++){
            console.log(this.state.userId);
            console.log(this.state.this.state.request[i].requestToUserId);
            if(this.state.userId==this.state.request[i].requestToUserId){
                this.setState({
                    friendRequest:[...this.state.friendRequest, this.state.request[i]]
                  })
            }
        }
        console.log(this.state.friendRequest);


        //
 

       }


       settingUpTheMap=(groupData)=>{
          console.log(groupData);
         

          this.state.groupKeyVersionMap.set('99999',"Hello");
          console.log(this.state.groupKeyVersionMap);

          var groupInformation=groupData.groupInformation;
          console.log(groupInformation);
          for(var i=0;i<groupInformation.length;i++){
            var currentGroupInformation=groupInformation[i];
            console.log(currentGroupInformation);
            for(var j=0;j<currentGroupInformation.groupMembers.length;j++){
              if(this.state.userId==currentGroupInformation.groupMembers[j].userId){
                console.log("in if");
                console.log("GroupVersion");
                console.log(currentGroupInformation.groupKeyVersion);
                var groupKeyInOrginalForm = crypt.decrypt(this.state.userPrivateKey, currentGroupInformation.groupMembers[j].encryptedGroupKey);
                this.state.groupKeyVersionMap.set(currentGroupInformation.groupKeyVersion,groupKeyInOrginalForm.message);
                break;
              }
            }
          }


          console.log(this.state.groupKeyVersionMap);

       }





       acceptFriendRequest=(data)=>{
        console.log(this.state.userPrivateKey);
        console.log(data);
        var groupKeyInOrginalForm = crypt.decrypt(this.state.userPrivateKey, data.groupInformation[0].encryptedGroupKey);
        console.log(groupKeyInOrginalForm);


// Map for adding request informatiom 

// let requestInformationHash = new Map();
// for(var i=0;i<data.groupInformation.length;i++){

// }

///

      
        //Sender Group Information needs to updated 
        var groupIdMap=this.state.blockChainIdforUserMap;
        var groupId = groupIdMap.get(data.requestFromUserId)
        console.log("group ID for blockchain"+groupId);

        var groupInformationMap = this.state.groupInformationMap;
        var groupInformaionOfSender=groupInformationMap.get(data.requestFromUserId);
        console.log( groupInformaionOfSender);
        console.log(groupInformaionOfSender);
        for(var i=0;i<data.groupInformation.length;i++){
          var groupInformation = data.groupInformation[i];
          console.log(groupInformation);
          var groupId=data.groupId;

          for(var j=0;j<groupInformaionOfSender.groupInformation.length;j++){

             console.log(groupInformaionOfSender.groupInformation[j]);
              if(groupInformaionOfSender.groupInformation[j].groupKeyVersion==groupInformation.groupVersion){
                console.log("in if");
                var userObj={
                    userId:data.requestToUserId,
                    fullName:data.requestToUserFullName,
                    encryptedGroupKey: groupInformation.encryptedGroupKey
                }
                console.log(userObj);
                console.log(groupInformaionOfSender.groupInformation[j])
                groupInformaionOfSender.groupInformation[j].groupMembers.push(userObj);
                // groupInformaionOfSender[j].groupMembers.push(userObj);
                 console.log(groupInformaionOfSender.groupInformation[j]);
              }
          }
        }

        console.log("group member information of sender ");
        console.log(groupInformaionOfSender);
        var stringGroupObj2 = Buffer.from(JSON.stringify(groupInformaionOfSender));

        ipfs.files.write('/user/'+data.requestFromUserId+"/"+"groupInformationTable",stringGroupObj2, { create: true },(error,results)=>{
          console.log("inside");
          console.log(results);
            ipfs.files.stat('/user/'+data.requestFromUserId+"/"+"/groupInformationTable", (error,results)=>{
              console.log("inside");
            console.log(results);
            console.log(groupId);
            groupId = groupIdMap.get(data.requestFromUserId)
            this.state.contract.methods.changeGroupInformation(groupId,results.hash).send({from: this.state.account}).then((r)=>{
              console.log(r);
              console.log("done");
          });

          })
 })

        // var userObj={
        //   userId:data.requestFromUserId,
        //   fullName:data.requestFromUserFullName,
        //   encryptedGroupKey:
        // }





      //updating group information receiving person 

      var groupIdMap2=this.state.blockChainIdforUserMap;
      var groupId2 = groupIdMap2.get(data.requestToUserId)
      console.log("group ID for blockchain"+groupId2);

      var groupInformationMap2 = this.state.groupInformationMap;
      console.log(groupInformation2);
      var groupInformaionOfReceiver=groupInformationMap2.get(data.requestToUserId);
      console.log(groupInformaionOfReceiver);
      var publicKeyOfSender=this.state.publicKeyMap.get(data.requestFromUserId)
      console.log(publicKeyOfSender);
      console.log(groupInformaionOfReceiver.groupInformation);

      this.settingUpTheMap(groupInformaionOfReceiver)


      for(var i=0;i<groupInformaionOfReceiver.groupInformation.length;i++){
        var groupInformation2=groupInformaionOfReceiver.groupInformation[i];

        
          var groupKey=this.state.groupKeyVersionMap.get(groupInformation2.groupKeyVersion); 
          console.log(groupKey);
          var encryptedGroupKey= crypt.encrypt(publicKeyOfSender,groupKey );
        
       

        // console.log(groupInformation2);
        // var groupKeyInOrginalForm2 = crypt.decrypt(this.state.userPrivateKey, groupInformation2.encryptedGroupKey);
        // console.log(groupKeyInOrginalForm2 );
        // console.log("Group Key in original form");
        // console.log(groupKeyInOrginalForm2);
        // var  encryptedGroupKey2= crypt.encrypt(publicKeyOfSender,groupKeyInOrginalForm2);
        // console.log("Group Key in encryted form form");
        // console.log(encryptedGroupKey2);
         var userObj2={
          userId:data.requestFromUserId,
          fullName:data.requestFromUserFullName,
          encryptedGroupKey:  encryptedGroupKey
        }
        console.log(userObj2);
       //groupInformaionOfReceiver[i].groupMembers.push(userObj2);
       groupInformation2.groupMembers.push(userObj2);
       console.log(groupInformation2);
      }
      console.log(groupInformaionOfReceiver);
      var stringGroupObj3 = Buffer.from(JSON.stringify(groupInformaionOfReceiver));


      ipfs.files.write('/user/'+data.requestToUserId+"/"+"groupInformationTable",stringGroupObj3, { create: true },(error,results)=>{
        console.log("inside");
        console.log(results);
          ipfs.files.stat('/user/'+data.requestToUserId+"/"+"/groupInformationTable", (error,results)=>{
            console.log("inside");
          console.log(results);
          this.state.contract.methods.changeGroupInformation(groupId2,results.hash).send({from: this.state.account}).then((r)=>{
            console.log(r);
            console.log("done");
        });

        })
})


        //Update Friend Request Array to updated 
        console.log(this.state.request);
        var request=this.state.request;
        for(var i=0;i<request.length;i++){

          if(request[i].requestId == data.requestId){
            request[i].activeStatus="accepted";
          }
          console.log(request[i]);
        }
        var stringGroupObj = Buffer.from(JSON.stringify(request));

        ipfs.files.write('/friendRequestInformation/friendRequestInformation',stringGroupObj, { create: true },(error,results)=>{
          console.log("inside");
          console.log(results);

          ipfs.files.stat('/friendRequestInformation/friendRequestInformation', (error,results)=>{
            console.log("inside");
            console.log(results);
            this.state.contract.methods.changeFriendRequestInformation(1,results.hash).send({from: this.state.account}).then((r)=>{
              console.log(r);
              console.log("done");
          });
          });
         });



       }

      render(){


      let list = this.state.friendRequest.map(people => 
        <Card className="cardBorder">
  <Card.Body>
  <div className="container">
            <div className="box media">
          <figure className="image is-96x96 media-left">
            <img src="https://previews.123rf.com/images/jemastock/jemastock1909/jemastock190907419/129419865-indian-young-boy-face-profile-picture-avatar-cartoon-character-portrait-in-black-and-white-vector-il.jpg" style={{height: "100%",  width:"150px" }} alt={"Rutvik"} />
          </figure>
          <div className="media-content">
            {/* <p className="subtitle"><b><h4>{people.name}</h4></b></p> */}
            <Card.Title>{people.requestFromUserFullName}</Card.Title>
            <br></br>
            <Card.Link onClick={() => this.acceptFriendRequest(people)}><Button variant="primary" size="sm" >Accept</Button></Card.Link>
            <Card.Link  ><Button variant="secondary" size="sm" >Reject</Button></Card.Link>
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

export default checkRequest3;