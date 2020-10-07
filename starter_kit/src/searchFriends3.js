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
  accessKeyId: "AKIAWWXYWF2RZUH2IJP6",
  secretAccessKey:"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"
});




 // Create a Secrets Manager client
// var client = new AWS.SecretsManager({
//   region: region,
//   accessKeyId: "AKIAWWXYWF2RYZXUYVWR",
//   secretAccessKey:"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"
// });

class searchFriends3 extends Component{

      
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
        var secondUrl=url.substring(37,url.length);
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

//user information over 

 tt= await contract.methods.groupCount().call();
 var groupCount=await tt;

          for(var i=1;i<=groupCount;i++){
            const groupInformationListFromBlockChain= await contract.methods.groupInformation(i).call();
            console.log(groupInformationListFromBlockChain)
              this.setState({
                groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
             }) 
             console.log(groupInformationListFromBlockChain.groupOwnerUserId);
             console.log(this.state.userId);
            if(groupInformationListFromBlockChain.groupOwnerUserId==this.state.userId){
              ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
              //ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                var groupJsonResult = JSON.parse(result);
                 console.log(groupJsonResult);
                 this.setState({groupInformationFromIPFS:groupJsonResult});
              });
            }
            
          }


          // getting Friend request information 
          const friendRequestListFromBlockChain= await contract.methods.friendRequestInformation(1).call();
          console.log(friendRequestListFromBlockChain);
          ipfs.files.read("/friendRequestInformation/friendRequestInformation",(error,result)=> {
          //ipfs.get("/ipfs/"+friendRequestListFromBlockChain.fiendRequestHash,(error,result)=>{
            console.log(result);
            var result = JSON.parse(result);
            console.log(result);
            this.setState({request:result});
            //  console.log(result);
            //  for(var i=0;i<result.length;i++){
            //   this.setState({
            //     request:[...this.state.request, result]
            //   })
            //  }
console.log(this.state.request);

          });



//


this.pausecomp(3000)
console.log("after timeout");
this.setState({userPrivateKey:privateKey});
console.log(this.state.userPrivateKey);
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }





      updateSearch=(data)=>{
        this.setState({userPrivateKey:data.SecretString});
      }



      addFriend=(data)=>{
        //  console.log(event.target.value);
            console.log(data);
            console.log(this.state.groupInformationFromIPFS);

          var mainArray=[]

            var requestObj={
              requestId:uuidv4(),
              requestFromUserId:this.state.userId,
              requestFromUserFullName:this.state.fullName,
              requestToUserId:data.userId,
              requestToUserFullName:data.fullName,
              groupId:this.state.groupInformationFromIPFS.groupId,
              groupInformation:[],
              activeStatus:"pending"
            }
            console.log(requestObj);
            
            // getting public of the person which we want to add 
            var publicKeyOfOtherUser=this.state.publicKeyMap.get(data.userId);
            console.log(publicKeyOfOtherUser);

            console.log(this.state.groupInformationFromIPFS.groupInformation);
            var groupInformation= this.state.groupInformationFromIPFS.groupInformation;
           // console.log(this.state.groupInformationFromIPFS.groupInformationFromIPFS);
            console.log(groupInformation);
            var groupInformationForRequest=[];

            for(var i=0;i<groupInformation.length;i++){
               console.log(groupInformation[i]);
               var groupInformationOfParticularArray= groupInformation[i];
               console.log(groupInformationOfParticularArray);
               console.log("-----");


               var  encryptedGroupKey;
               var groupKeyVersion=groupInformationOfParticularArray.groupKeyVersion;
               for(var j=0;j<groupInformationOfParticularArray.groupMembers.length;j++){
                var groupMember= groupInformationOfParticularArray.groupMembers[j];
                   console.log(groupMember);
                   if(groupMember.userId==this.state.userId){
                    var groupKeyInOrginalForm = crypt.decrypt(this.state.userPrivateKey, groupMember.encryptedGroupKey);
                    console.log(groupKeyInOrginalForm);
                    console.log(groupKeyInOrginalForm.message );

                    var t =groupKeyInOrginalForm.message.toString();
                    encryptedGroupKey  = crypt.encrypt(publicKeyOfOtherUser,t);
                    console.log(encryptedGroupKey)
                    var requestInformationObj={
                      groupVersion:groupKeyVersion,
                      encryptedGroupKey:encryptedGroupKey
                    }
                    requestObj.groupInformation.push(requestInformationObj);
                    //groupInformationForRequest.push(requestInformationObj);
                   }

                  
               }
            }

            console.log(requestObj);
            // for(var i=0;i<this.state.groupInformationFromIPFS.length;i++){
            //   console.log(this.state.groupInformationFromIPFS[i]);
            //   var current =this.state.groupInformationFromIPFS[i]
            //   var secretId=this.state.userId
              
            //     console.log(this.state.userPrivateKey);
            //     console.log(current.encryptedGroupKey);
               
            //     var groupKeyInOrginalForm = crypt.decrypt(this.state.userPrivateKey, current.encryptedGroupKey);
            //     console.log(groupKeyInOrginalForm);

            //     console.log(groupKeyInOrginalForm.message );

            //     var t =groupKeyInOrginalForm.message.toString();
            //    var  encryptedGroupKey= crypt.encrypt(publicKeyOfOtherUser,t);
            //     console.log(encryptedGroupKey)

            //     var groupInformation={
            //       groupId:current.groupId,
            //       encryptedGroupKey:encryptedGroupKey,
            //       groupVersion:current.groupVersion
            //     }
                
            //     requestObj.groupInformation.push(groupInformation);
            //     console.log(requestObj);
            //     // ciphertext = CryptoJS.AES.encrypt(groupKeyInOrginalForm.message, publicKeyOfOtherUser).toString();
            //     // console.log(ciphertext);

            //     console.log("after this");

   

           
            //   console.log(this.state.groupInformationFromIPFS.length);
            //   console.log(this.state.request);
            //    if(i==this.state.groupInformationFromIPFS.length-1){
            //     console.log(this.state.request);
            //      console.log(requestObj);
                  console.log(this.state.request);
                  this.state.request.push(requestObj)
                 console.log(this.state.request); 
                  var stringGroupObj = Buffer.from(JSON.stringify(this.state.request));
      
                 
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


              

            //     }
            // }
            


         }
         pausecomp=(millis)=>{
          var date = new Date();
          var curDate = null;
          console.log("in pause");
          do { curDate = new Date(); }
          while(curDate-date < millis);

         }
         updateSearch=(event)=>{
          //  console.log(event.target.value);
            this.setState({search:event.target.value.substr(0,20)})      
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
      



      render(){
        const cardBorder={
          padding: "10px",
          margin:"10px",
          border: "2px solid #365899",
          
          }

      //  console.log(this.state.userInformationFromIPFS);
        var userNameList= this.state.userInformationFromIPFS.filter(
          (people)=>{
           // console.log(people);
            return people.fullName.indexOf(this.state.search)!==-1
          }
        );

        let list2 = userNameList.map(people => 
          <Card style={cardBorder}>
    <Card.Body>
    <div className="container">
              <div className="box media">
            <figure className="image is-96x96 media-left">
              <img src={people.profilePicHash} style={{height: "100%",  width:"150px" }} alt={"Rutvik"} />
            </figure>
            <div className="media-content">
              {/* <p className="subtitle"><b><h4>{people.name}</h4></b></p> */}
              <Card.Title>{people.fullName}</Card.Title>
              <br></br>
              <Card.Link style={{padding:"10px"}} onClick={() => this.addFriend(people)}><Button variant="primary" size="sm" >Add Friend</Button></Card.Link>
              <Card.Link  ><Button variant="secondary" size="sm" >View Profile</Button></Card.Link>
            </div>
          </div>
          </div>
      </Card.Body>
  </Card>
  );
        return(
          <div>
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

<br></br>
<hr></hr>         
<div className="container text-center ">
            <h2 className="ReactHeading">Search Friends</h2>
             <input type ="text" className="mystyle" placeholder="Search Friend By Name" value={this.state.search} onChange={this.updateSearch}  />
           
            <br></br>
             <hr></hr>    
            { list2      }

 </div>            





</div>




        );
    }
}

export default searchFriends3;