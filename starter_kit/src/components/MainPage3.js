import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import { Crypt, RSA } from 'hybrid-crypto-js';
import { v4 as uuidv4 } from 'uuid';


import './MainPage.css';

//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

var ipfs2 = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;

//Crypto
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
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



class MainPage3  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          fullName:'',
          userEmailId:'',
          userId:'',
          profilePicHash:'',
          userInformationListFromBlockChain:'',
          userInformationFromIPFS:'',
          showModal:false,

          videoSet:'no',
          photoSet:'no',
          postPicBuffer:'',
          postPicHash:'',

          groupInformationSet:null,
          groupInformationListFromBlockChain:[],
          groupInformationFromIPFS:null,
          userPrivateKey:null,
          latestGroupVersionDetails:null,
          encryptedGroupKey:null,
          groupKeyInPlainText:null,


          postInformationArray:null
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
        var secondUrl=url.substring(32,url.length);
        console.log(secondUrl);
        this.setState({userId:secondUrl});
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

        for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            console.log(userInformationListFromBlockChain)
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })

            //console.log(this.state.userInformationListFromBlockChain)
            
              ipfs.files.read("/user/"+userInformationListFromBlockChain.userId+"/userInformationTable",(error,result)=> {
               // console.log(result[0]);
                 var userJsonResult = JSON.parse(result);
                 //console.log(userJsonResult);
                 this.setState({
                    userInformationFromIPFS:[...this.state.userInformationFromIPFS, userJsonResult]
                  })
                  if(userJsonResult.userId==this.state.userId)
                  {
                   // console.log(userJsonResult);
                    this.setState({fullName:userJsonResult.fullName});
                    this.setState({profilePicHash:userJsonResult.profilePicHash});
                  
                  }
            });

          }

          //getting group information 

          tt= await contract.methods.groupCount().call();
          var groupCount=await tt;
         // console.log(this.state.groupInformationSet);
          
      //   this.setState({ groupInformationMap:new Map()});
        // this.setState({ blockChainIdforUserMap:new Map()});
                   for(var i=1;i<=groupCount;i++){
                     const groupInformationListFromBlockChain= await contract.methods.groupInformation(i).call();

                     //console.log(groupInformationListFromBlockChain)
                     //console.log(groupInformationListFromBlockChain.groupId.toString());
                   
                       this.setState({
                         groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
                      })
                     if(groupInformationListFromBlockChain.groupOwnerUserId==this.state.userId){
                         
                      // ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                        ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
                         var groupJsonResult = JSON.parse(result);
                          console.log(groupJsonResult);
                          this.setState({groupInformationFromIPFS:groupJsonResult});
                          var groupInformation=groupJsonResult.groupInformation;
                          var groupLength=groupInformation.length;
                          var latestGroupVersionDetails=groupInformation[groupLength-1];
                          console.log(latestGroupVersionDetails);
                          this.setState({latestGroupVersionDetails:latestGroupVersionDetails});

                          for(var j=0;j<latestGroupVersionDetails.groupMembers.length;j++){
                            if(this.state.userId=latestGroupVersionDetails.groupMembers[j].userId){
                              this.setState({encryptedGroupKey:latestGroupVersionDetails.groupMembers[j].encryptedGroupKey});
                            }
                          }
                       });
                       
                     }


            // getting postInformation 

  tt= await contract.methods.postCount().call();
          var postCount=await tt;

          for(var i=1;i<=postCount;i++){
            const postInformationListFromBlockChain= await contract.methods.postInformation(i).call();
            if(postInformationListFromBlockChain.postOwnerUserId==this.state.userId){
              ipfs.files.read("/user/"+postInformationListFromBlockChain.postOwnerUserId+"/postInformationTable",(error,result)=> {
                var postJsonResult = JSON.parse(result);
                console.log(postJsonResult);
                this.setState({postInformationArray:postJsonResult});
              });
            }
          }


                    // console.log(this.state.groupInformationMap);
                    this.pausecomp(500)
                    console.log("after pause")
                    this.setState({userPrivateKey:privateKey});
console.log(this.state.userPrivateKey);
                   }



        
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }



      openPostModel=()=>{
        console.log("inside open");
        this.setState({ showModal: true });
      }

      closePostModel=()=>{
        console.log("inside close");
        this.setState({ showModal: false });
       }

       
       searchFriends=()=>{
        console.log("in people");
        this.props.history.push({
          pathname: '/searchFriends3/'+this.state.userId,

        })
       }
       checkFriendRequest=()=>{
        this.props.history.push({
          pathname: '/checkRequest3/'+this.state.userId,

        })
       }
       getFriendsInform=()=>{
        this.props.history.push({
          pathname: '/removeFriend/'+this.state.userId,

        })
       }
       signOut=()=>{
        this.props.history.push({
          pathname: '/login2',
           // your data array of objects
        })
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

       capturePostFile=(event)=>{
    
        console.log(ipfs );
          event.preventDefault();
          console.log("file is capture");
          console.log(event);
          //type
          console.log(event.target.files[0]);
          var str = event.target.files[0].type;
          var array = str.split('/');
          var array1=array[0];
          if(array1=='video'){
            console.log(array1);
            ///
            this.setState({videoSet:"yes"});
            console.log(this.state.videoSet);
            ///
          }
          else if(array1=='image'){
            console.log(array1);
            this.setState({photoSet:"yes"});
            console.log(this.state.photoSet);
          }
          var file = event.target.files[0];
          var reader = new window.FileReader();
          reader.readAsArrayBuffer(file);  
          reader.onloadend = ()=>{
            console.log(reader.result);
            this.setState({postPicBuffer:Buffer(reader.result)})
            console.log("buffer",Buffer(reader.result));
            console.log(this.state.videoSet);
            console.log(this.state.photoSet);
          }   
         
      }

       actuallyPost=()=>{
        var postText=document.getElementById("postTextArea").value;
        console.log(this.state.groupInformationFromIPFS);
        console.log(this.state.encryptedGroupKey);
        console.log(this.state.latestGroupVersionDetails);
        console.log(this.state.userPrivateKey);
        var groupKeyInOrginalForm = crypt.decrypt(this.state.userPrivateKey, this.state.encryptedGroupKey);
        var groupKeyInPlainText=groupKeyInOrginalForm.message;
        console.log(groupKeyInOrginalForm);
        

         var postId=uuidv4();

         var postOwnerUserId=this.state.userId;
         console.log(postOwnerUserId);
         var sessionKey=this.generateHexString();
        console.log(sessionKey);
        console.log("------------")
        const file = {
          content: this.state.postPicBuffer
          //content:this.
       }
        ipfs2.add(file,(error,results)=>{
          console.log(results)
          this.setState({postPicHash:results[0].hash});
          var ciphertext = CryptoJS.AES.encrypt('my message', sessionKey).toString();
         // Decrypt
        var bytes  = CryptoJS.AES.decrypt(ciphertext, sessionKey);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
 
        console.log(originalText); // 'my message'

        var ciphertext2 = CryptoJS.AES.encrypt(postText, sessionKey).toString();
        // Decrypt
       var bytes2  = CryptoJS.AES.decrypt(ciphertext2, sessionKey);
       var originalText2 = bytes2.toString(CryptoJS.enc.Utf8);
       console.log(originalText2);

          var contentObj={
            imageVideoIPFSHash:results[0].hash,
            textData:ciphertext2 
          }
          var stringContentObj = Buffer.from(JSON.stringify(contentObj));
          ipfs2.add(stringContentObj,(error,results)=>{


            console.log(results);

            var ciphertext3 = CryptoJS.AES.encrypt(results[0].hash, sessionKey).toString();
            // Decrypt
           var bytes3  = CryptoJS.AES.decrypt(ciphertext3, sessionKey);
           var originalText3 = bytes3.toString(CryptoJS.enc.Utf8);
           console.log(originalText3);

            var sha =CryptoJS.SHA256(postText).toString();
           var digSiganture= CryptoJS.AES.encrypt(sha, this.state.userPrivateKey).toString();
           console.log(digSiganture)
           console.log(CryptoJS.AES.encrypt(CryptoJS.SHA256(postText).toString(), this.state.userPrivateKey).toString());
           var postObj={
             postId:uuidv4(),
             postOwnerUserId:this.state.userId,
             postOwnerName:this.state.fullName,
             groupId:this.state.groupInformationFromIPFS.groupId,
             groupKeyVersion:this.state.latestGroupVersionDetails.groupKeyVersion,
             encryptedSessionKey:CryptoJS.AES.encrypt(sessionKey, groupKeyInPlainText).toString(),
             encryptedIPFSPostHash:ciphertext3,
            // digitalSignature:CryptoJS.AES.encrypt(CryptoJS.SHA256(postText).toString(), this.state.userPrivateKey).toString()
           
           }

           console.log(postObj);
           var stringPostObj = Buffer.from(JSON.stringify(postObj));
           ipfs.files.stat('/user/'+this.state.userId+"/"+"/postInformationTable", (error,results)=>{
           
            if(error){
              console.log(error);
              var postInformationArray=[];
              postInformationArray.push(postObj);
              stringPostObj = Buffer.from(JSON.stringify(postInformationArray));
              ipfs.files.write('/user/'+this.state.userId+"/"+"postInformationTable",stringPostObj, { create: true },(error,results)=>{
              console.log("inside");
              console.log(results);
              ipfs.files.stat('/user/'+this.state.userId+"/"+"/postInformationTable", (error,results)=>{
               console.log(results);
               this.state.contract.methods.createPost(this.state.userId,results.hash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });  
              });
            });
            }
            else{
              console.log(results);
              console.log(this.state.postInformationArray);
              this.state.postInformationArray.push(postObj);
              stringPostObj = Buffer.from(JSON.stringify(this.state.postInformationArray));
              ipfs.files.write('/user/'+this.state.userId+"/"+"postInformationTable",stringPostObj, { create: true },(error,results)=>{
               console.log("inside");
              console.log(results);
              ipfs.files.stat('/user/'+this.state.userId+"/"+"/postInformationTable", (error,results)=>{
                console.log(results);
              });
            });

            }
          });

          })
        });
       }

       addFileOnIPFS=()=>{
      
        console.log("upload ePic");
       // event.preventDefault();
        console.log("in submit event");
        const file = {
           content: this.state.postPicBuffer
           //content:this.
        }
        console.log(file);
        ipfs2.add(file,(error,results)=>{
          console.log(results)
          this.setState({postPicHash:results[0].hash});
        });

       }


      render(){
        const mystyle = {
          padding: "20px",
          fontFamily: "Arial",
          cursor: "pointer",
          borderStyle: "solid",
          borderColor: "#365899",
          fontSize:"20px",
          textAlign: "center"
         
        };
        return(
            <div>
                  <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                  <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0 text-center"target="_blank"rel="noopener noreferrer">
                    <h1></h1>
                    <p></p>
                    <div></div>
                    </a>
                 </nav>
                 <br></br>

                 <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={this.state.profilePicHash}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.checkFriendRequest}> <span className="fa fa-id-badge"></span>   Check Request</Button></Nav.Link>
                        <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link>
                        </Nav>
                            <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}>{this.state.fullName}</Button>
                            <Button Button variant="light"  onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                  
                     </Navbar.Collapse>
                </Navbar>


                <div>
                    <div className="row">
                    <div className="col-3">
                      <div className="mystyle3">
                      <ListGroup>
                        <ListGroup.Item className="mystyle2">
                          <div className="row">
                            <div className="col-2">
                              <img className="photo"  src= {this.state.profilePicHash} ></img>
                              </div>
                              <div className="col-10">
                              <span style={{fontSize:"20px"}}><h4>{this.state.fullName}</h4></span>
                              </div>
                                                        
                          </div>
                         
                          </ListGroup.Item>
                         {/* <ListGroup.Item style={mystyle} onClick={this. getFriendsInform} >Friend List</ListGroup.Item>  */}
                        <ListGroup.Item style={mystyle} onClick={this.addProfilePic} >Add Profile Pic</ListGroup.Item>
                        {/* <ListGroup.Item style={mystyle} onClick={this.about}>About</ListGroup.Item> */}
                        <ListGroup.Item style={mystyle}  onClick={this.getFriendsInform} >Friends</ListGroup.Item>
                      </ListGroup>
                      </div>
                    </div>
                    <div className="col-7">
                    <div className="cardStyle">
                        <div className="card" expand="false">
                          <div className="info">
                              <img className="photo" src={this.state.profilePicHash} ></img>
                            <div className="name"><h4>{this.state.fullName}</h4></div>
                          </div>
                          <input type="text" className="username" name="username" placeholder="what's on your mind," required />  
                          <hr></hr>
                          <div>
                          <Button className="addPost"  id="addPost"  onClick={this.openPostModel}  >Add Post</Button>
                          </div>
                          
                          {/* <button type="button" id="addPost" >Click Me!</button> */}
                        </div>
                    </div>
                    </div>
                  </div>
               </div> 

               <Modal show={this.state.profilePicModal} onHide={this.closeProfilPicModel}  size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title style={{color:"#205663", paddingLeft:"310px"}}>Add Profile Picture</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="cardStyle2">
                          <div className="card2" expand="false">
                            <div className="info">
                                <img className="photo" src={this.state.profilePicHash} ></img>
                              <div className="name"><h4>{this.state.fullName}</h4></div>
                              <div style={{textAlign:"center", marginTop:"280px"}} >
                               <img src={this.state.profilePicHash}  style={{height: "100%",  width:"300px" }}></img>
                             </div>
                            </div>
                          </div>
                    </div>
                   
                     
                    <div>
                    <input type="file" onChange={this.captureProfilePicFile}/> 
                    </div>
   
                    <hr></hr>
                    <div style={{textAlign:"center"}}>
                    <Button className="LogIn2" onClick={this.uploadProfilePic}>
                           Upload
                    </Button>
                    </div>
                    
                  </Modal.Body>
                  <Modal.Footer>
                  <Button onClick={this.closeProfilPicModel}>Done</Button>
                </Modal.Footer>
              </Modal>


              <Modal show={this.state.showModal} onHide={this.closePostModel}   size="lg">
                  <Modal.Header closeButton>
                   <Modal.Title  style={{textAlign:"center"}} > Create Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="cardStyle">
                          <div className="card2" expand="false">
                            <div className="info">
                                <img className="photo" src={this.state.profilePicHash} ></img>
                              <div className="name"><h4>{this.state.fullName}</h4></div>
                            </div>
                            <br></br>
                           
                            <MDBInput type="textarea"  id="postTextArea" rows="5" />    
                            {/* <textarea className="textAreaStyle" class="cstTextarea" id="postTextArea" rows="4" cols="50" placeholder="what's on you"></textarea> */}
                          </div>
                          {/* <div class="clearfix" style={signatureButton}>
                            <div class="pull-right">
                            <Button variant="primary" size="sm" >Add Signature</Button>
                            <div style={postSignature}>
                                RP
                            </div>
                            </div>
                          </div> */}
                          <div class=" clearfix" className="signatureSession">
                            <div class="float-left" className="signatureButton">
                              <button type="button" class="btn btn-primary btn-sm" onClick={this.about3}  >Add Signature</button>
                            </div>
                            <div class="float-right">
                            <span className="postSignature">{this.state.signatureText}</span>
                            </div>
                          </div>
                           <hr style={{width:"40px",textAlign:"left",marginLeft:"710px",marginTop:"-15px",  position:"relative",borderTop: "7px solid" }}></hr> 
                          {/* //style={{textAlign:"center"}} */}
                          {/* <div className="btn-group" role="group" aria-label="Basic example" >
                            <button type="button" className="btn btn-primary"  onClick={this.about}>Image</button>
                            <button type="button" className="btn btn-secondary" 
        
                            style={{backgroundColor: "white",borderColor:"white"  }}
                            >Middle</button>
                            <button type="button" className="btn btn-secondary"onClick={this.about2}>Video</button>
                        </div> */}
                    </div>
                    <div>
                    <input type="file"  onChange={this.capturePostFile}/> 
                    </div>
   
                    <hr></hr>
                    
                    <div style={{textAlign:"center",padding:"15px"}}>
                      <h4>Caption</h4>
                      <p className="name">
                          {this.state.captionSetter}
                      </p>
                    </div>


                    <div style={{textAlign:"center"}}>


                    <Button className="LogIn2" alt="#" onClick={this.actuallyPost}>
                           Post
                    </Button>
                    </div>

                  </Modal.Body>
                  <Modal.Footer>
                  <Button onClick={this.closePostModel}>Done</Button>
                </Modal.Footer>
              </Modal>



            </div>
        );
    }
}

export default MainPage3;