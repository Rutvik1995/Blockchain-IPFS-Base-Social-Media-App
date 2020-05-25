import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import './file.css'; 
import ReactDOM from 'react-dom'
import Files from 'react-files'
var CryptoJS = require("crypto-js");

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var CryptoJS = require("crypto-js");


class timeline  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userEmailId:'',
          fullName:'',
          search:'',
          userJsonResultOfParticularUserFromIPFS:null,
          userBlockchainResultOfParticularUser:null,
          totalUser:null,
          isVisible: false,
          showModal:false,
          profilePicModal:false,
          buffer:null,
          profilePicBuffer:'',
          postPicBuffer:'',
          groupInformationListFromBlockChain:[],
          profilePicHash:'',
          friendName:[],
          currentUserGroupHash:'',
          currentGroupKeyInformation:null,
          userPublicKeyMap:null

        };       
      }


      async componentWillMount(){
       await this.loadData();
       await this.check();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }

      check=()=>{
        console.log(this.state.fullName);
        console.log(this.state.userEmailId)
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        this.setState({profilePicHash:this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash});
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser);
       // console.log(this.state.totalUserName);
        //console.log(this.state.hasError);
        //console.log(this.state.)
        console.log(this.state.totalUser);
        for(var j=0;j<this.state.totalUser.length;j++){
          // console.log(this.state.totalUser[j].userEmailId);
          // console.log(this.state.totalUser[j].userHash);
          //this.state.userMap.set(this.state.totalUser[j].userEmailId,this.state.totalUser[j].userHash);
          this.state.userPublicKeyMap.set(this.state.totalUser[j].userEmailId,this.state.totalUser[j].publickey);
        }
        //console.log(this.state.userMap);
        console.log(this.state.userPublicKeyMap);


       }
      updateModal(isVisible) {
        this.state.isVisible = isVisible;
        this.forceUpdate();
      }
      loadData=()=>{
        console.log("in load data");
        this.setState({userPublicKeyMap:new Map()});
       this.setState({fullName:this.props.location.fullName});
       this.setState({userEmailId:this.props.location.userEmailId});
       this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
       //this.setState({profilePicHash:this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash});
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


        var tt= await this.state.contract.methods.groupCount().call();
        var groupCount=await tt;
        groupCount=groupCount.toString();
        console.log("group Count");
        console.log(groupCount);
        for(var i=1;i<=groupCount;i++){
          const groupInformationListFromBlockChain= await this.state.contract.methods.groupInformation(i).call();
          console.log(groupInformationListFromBlockChain)
            this.setState({
              groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
           })
        }
        ////

      
        console.log(this.state.groupInformationListFromBlockChain)
     
        console.log(this.state.groupInformationListFromBlockChain);
        var dataArray=[]
        for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
                if(this.state.groupInformationListFromBlockChain[i].groupEmailId==this.state.userEmailId){
                    dataArray.push(this.state.groupInformationListFromBlockChain[i]);
                    console.log(this.state.groupInformationListFromBlockChain[i]);
                }
        }
        
        let myMap = new Map();
        var max=-1;
        for(var i=0;i<dataArray.length;i++){
         var value=dataArray[i].groupVersion;
         console.log(value);
         value=value.toString();
         myMap.set(value,dataArray[i]);
         console.log(value);
         if(value>max){
           max=value;
         }
        }
        console.log("lastest group version is");
        console.log(max);
        console.log(myMap.get(max));
        var lastestGroupDetailHash= myMap.get(max);
        console.log(lastestGroupDetailHash);
        this.setState({currentUserGroupHash:lastestGroupDetailHash.groupHash})
        this.setState({currentGroupKeyInformation:lastestGroupDetailHash});

       if(max!=-1){
        var t= lastestGroupDetailHash.groupHash;
        var content;
        ipfs.get("/ipfs/"+t,(error,result)=>{
          console.log(result[0].path);
          content=result[0].content;
          console.log(content);
         var groupData=JSON.parse(content);
         console.log(groupData);
            for(var i=0;i<groupData.friend.length;i++){
                console.log(groupData.friend[i]);
                this.state.friendName.push(groupData.friend[i]);
            }

          
         this.setState({ groupInformationPassParameter:groupData})
         console.log(this.state.groupInformationPassParameter);
         console.log(this.state.friendName);
        })
       }







        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

      updateSearch=(event)=>{
        //  console.log(event.target.value);
          this.setState({search:event.target.value.substr(0,20)})      
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
         removeFriend=(dataParse)=>{
           var groupKey1=this.makeid(10);
           var groupKey2=this.makeid(10);
            console.log(dataParse);
            var dataArray=[];
            for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
              if(dataParse.emailId==this.state.groupInformationListFromBlockChain[i].groupEmailId){
                dataArray.push(this.state.groupInformationListFromBlockChain[i]);
              }
            }
            let myMap = new Map();
            var max=-1;
            for(var i=0;i<dataArray.length;i++){
             var value=dataArray[i].groupVersion;
             console.log(value);
             value=value.toString();
             myMap.set(value,dataArray[i]);
             console.log(value);
             if(value>max){
               max=value;
             }
            }
            console.log("lastest group version is");
            console.log(max);
            console.log(myMap.get(max));
            var lastestGroupDetailHash= myMap.get(max);
            console.log(lastestGroupDetailHash);
           
            ipfs.get("/ipfs/"+lastestGroupDetailHash.groupHash,(error,result)=>{
              console.log(result[0].path);
              var content=result[0].content;
              console.log(content);
              var groupData=JSON.parse(content);
              console.log(groupData.friend);
              console.log(groupData);
              console.log("old common group key ")
              console.log(groupData.commonGroupKey);
              groupData.commonGroupKey=groupKey1;
              console.log("New common group key ")
              console.log(groupData.commonGroupKey);
              var friendRemoveData=[];
              var obj=[];
              console.log(groupData.friend.length);

              for(var i=0;i<groupData.friend.length;i++){
                console.log(groupData.friend[i]);
                if(groupData.friend[i].emailId==this.state.userEmailId){
                  friendRemoveData=groupData.friend[i];
                }
                else{
                obj.push(groupData.friend[i]);
                }
              }
              var groupVersion =groupData.groupVersion;
              groupVersion++;
              groupData.groupVersion=groupVersion;
              console.log(obj);
              console.log(friendRemoveData);
              groupData.friend=obj;
              console.log( groupData);
             obj=[]
              for(var i=0;i<groupData.groupDetails.length;i++){
                if(groupData.groupDetails[i].emailId==this.state.userEmailId){

                }
                else{
                  var publicKey =this.state.userPublicKeyMap.get(groupData.groupDetails[i].emailId);
                  // var ciphertext = CryptoJS.AES.encrypt(this.state.groupKey, this.state.userBlockchainResultOfParticularUser.userPublicKey).toString();
                  var encryptedGroupKey = CryptoJS.AES.encrypt(groupData.commonGroupKey,publicKey).toString();
                
                  var userObject={
                    name:groupData.groupDetails[i].name,
                    emailId:groupData.groupDetails[i].emailId,
                    encryptedGroupkey: encryptedGroupKey,
                    userHash:groupData.groupDetails[i].userHash
                  }
                  obj.push(userObject)
                }
              }
              console.log(obj);
              groupData.groupDetails=obj;
              console.log(groupData);

              var originalContentString = Buffer.from(JSON.stringify(groupData));
              // The json is change to string format 
              const userContent3= {
                content:originalContentString
            }
           
              ipfs.add(userContent3,(error,results)=>{
     
                console.log(results);
                var userInformationHash= results[0].hash;
                console.log(results[0].hash);  
                console.log(dataParse.userId);
                this.state.userBlockchainResultOfParticularUser.userHash=results[0].hash;
                   this.state.contract.methods.createGroup(dataParse.emailId,userInformationHash,groupVersion).send({from: this.state.account}).then((r)=>{
                      console.log(r);
                  });

              });

            });

                    
          ipfs.get("/ipfs/"+this.state.currentUserGroupHash,(error,result)=>{
            console.log(result[0].path);
            var content=result[0].content;
            console.log(content);
            var groupData=JSON.parse(content);
            console.log(groupData.friend);
            console.log(groupData);
            console.log(groupData.friend);
            console.log("old common group key ")
            console.log(groupData.commonGroupKey);
            groupData.commonGroupKey=groupKey1;
            console.log("New common group key ")
            console.log(groupData.commonGroupKey);
            var friendRemoveData=[];
            var obj=[];
            console.log(groupData.friend.length);

            for(var i=0;i<groupData.friend.length;i++){
              console.log(groupData.friend[i]);
              if(groupData.friend[i].emailId==dataParse.emailId){
                friendRemoveData=groupData.friend[i];
              }
              else{
              obj.push(groupData.friend[i]);
              }
            }
            var groupVersion =groupData.groupVersion;
            groupVersion++;
            groupData.groupVersion=groupVersion;
            console.log(obj);
            console.log(friendRemoveData);
            groupData.friend=obj;
            console.log( groupData);
            
            obj=[]
            for(var i=0;i<groupData.groupDetails.length;i++){
              if(groupData.groupDetails[i].emailId==dataParse.emailId){

              }
              else{
                var publicKey =this.state.userPublicKeyMap.get(groupData.groupDetails[i].emailId);
                // var ciphertext = CryptoJS.AES.encrypt(this.state.groupKey, this.state.userBlockchainResultOfParticularUser.userPublicKey).toString();
                var encryptedGroupKey = CryptoJS.AES.encrypt(groupData.commonGroupKey,publicKey).toString();
              
                var userObject={
                  name:groupData.groupDetails[i].name,
                  emailId:groupData.groupDetails[i].emailId,
                  encryptedGroupkey: encryptedGroupKey,
                  userHash:groupData.groupDetails[i].userHash
                }
                obj.push(userObject)
              }
            }
            console.log(obj);
            groupData.groupDetails=obj;
            console.log(groupData);

            var originalContentString = Buffer.from(JSON.stringify(groupData));
            // The json is change to string format 
            const userContent3= {
              content:originalContentString
          }
         
            ipfs.add(userContent3,(error,results)=>{
   
              console.log(results);
              var userInformationHash= results[0].hash;
              console.log(results[0].hash);  
              console.log(dataParse.userId);
              console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
             
              this.state.userBlockchainResultOfParticularUser.userHash=results[0].hash;
                 this.state.contract.methods.createGroup(this.state.userEmailId,userInformationHash,groupVersion).send({from: this.state.account}).then((r)=>{
                    console.log(r);
                });

            });



          });


         }
         signOut=()=>{
          this.props.history.push({
            pathname: '/login',
             // your data array of objects
          })
         }
         mainPage=()=>{
          console.log(this.state.userJsonResultOfParticularUserFromIPFS);
          console.log(this.state.requestedFriendName);
        
          this.props.history.push({
           pathname: '/MainPage',
           userEmailId:this.state.userEmailId,
           fullName:this.state.fullName,
           userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
           totalUser:this.state.totalUser,
           userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
             // your data array of objects
         })
        }


      render(){

        var cardStyle2={
        
            padding:"10px 10px 10px 10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            textAlign:"center"
           // width:"1000px 
        }
        var cardStyle={
        
            padding:"10px 10px 10px 10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
           // width:"1000px 
        }
        var addPost= {
            float: "right",
            background: "#365899",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            //padding: "10px 15px",
            //borderRadius: "6px"
          }
          var username= {
            margin:"15px 0",
            padding:"15px 10px",
            width:"100%",
            outline:"none",
            border:"1px solid #bbb",
            borderRadius:"20px",
            display:"inline-block",
            fontSize:"20px"
            
          }
        var card={
          boxShadow:"0px 0px 0.5px rgba(10,10,10,.3)",
          alignItems:"center",
          position:"relative",
          userSelect:"none",
          overflow:"hidden",
          transition:"all .5s ease",
          padding:"10px",
          width:"850px",
          height:"100%",
          maxWidth:"100%",
          backgroundColor:"white",
          marginBottom:"10px",
          fontSize:"14px",
          borderRadius:"3px",
          borderStyle: "solid",
          borderColor: "#365899"
        }
        var card2={
            boxShadow:"0px 0px 0.5px rgba(10,10,10,.3)",
            alignItems:"center",
            position:"relative",
            userSelect:"none",
            overflow:"hidden",
            transition:"all .5s ease",
            padding:"10px",
            width:"950px",
            height:"280px",
            maxWidth:"100%",
            backgroundColor:"white",
            marginBottom:"10px",
            fontSize:"14px",
            borderRadius:"3px",
          }
          var info={
            display:"flex",
            alignItems:"center",
            height:"40px"
          }
          var photo={
            height:"40px",
            width:"40px",
            backgroundColor:"gray",
            opacity:".8",
            borderRadius:"100%"
          }
        
          var name={
            
              fontWeight:"bold",
              color:"rgb(66, 103, 178)",
              opacity:".9",
              paddingLeft:"20px",
          }


          const mystyle = {
            textAlign: "center",
            font: "inherit",
            border: "2px solid #365899",
            padding: "13px 12px",
            fontSize: "15px",
            boxShadow: "0 1px 1px #DDD",
            width: " 700px",
            outline: "none",
            display: "block",
            color: "#788585",
            margin: "0 auto 20px",
            height:"50px"
            // color: "white",
            // backgroundColor: "DodgerBlue",
            // padding: "10px",
            // fontFamily: "Arial",
            // cursor: "pointer"
           
          };
          const ReactHeading= {
          // {textAlign: "center",
          //  padding: "50px",
          // textTransform: "uppercase",
           //color: "DodgerBlue",
           color:"#365899",
          fontSize: "25px",
          textTransform: "uppercase",
          fontWeight: "300",
          textAlign: "center",
          marginBottom: "15px",
          paddingBottom:"20px",
          fontFamily:"RalewayBold,Arial,sans-serif"
        }
        const cardBorder={
          padding: "10px",
          margin:"10px",
          border: "2px solid #365899",
          
          }
           

        var userNameList= this.state.friendName.filter(
          (people)=>{
            return people.name.indexOf(this.state.search)!==-1
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
              <Card.Title>{people.name}</Card.Title>
              <br></br>
              <Card.Link style={{padding:"10px"}} onClick={() => this.removeFriend(people)}><Button variant="danger" size="sm" > unfriend</Button></Card.Link>
              {/* <Card.Link  ><Button variant="secondary" size="sm" >View Profile</Button></Card.Link> */}
            </div>
          </div>
          </div>
      </Card.Body>
  </Card>
  //
         );

        return(
            <div>
                 <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQtRwMIKUhJfgz64gGRnrGmgHWdPsnP4zv_HlocpHesF_3BM8Aw&usqp=CAU"}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.mainPage}> <span className="fa fa-backward"></span> Main Page</Button></Nav.Link>
                        {/* <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link> */}
                        </Nav>
                    <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}><span className="fa fa-id-badge"  ></span> {this.state.fullName}</Button>
                    <Button Button variant="light" onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                </Navbar.Collapse>
                </Navbar>
                <div style={cardStyle2}>
                          <div style={card2} expand="false">
                            <div style={info}> 
                              <div style={{textAlign:"center", marginTop:"240px", marginLeft:"300px"}} >
                               <img src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash}  style={{height: "100%",  width:"300px" }}></img>
                             </div>
                            </div>
                          </div>
                    </div>
                    <div className="text-center">
                        <h2>{this.state.fullName}</h2>
                    </div>
                    <div className="container text-center ">
            {/* <h2 style={ReactHeading}>Search Friends</h2> */}
            <hr></hr>
             <input type ="text" style={mystyle} placeholder="Search Friend By Name" value={this.state.search} onChange={this.updateSearch}  />
            <br></br>
             <hr></hr>         
           {/* {peopleList2.map((people)=>{
                     return  <h3>{people.value}</h3>
              })} */}

              {/* {userNameList.map((people)=>{
                  return  <h3>{people.name}</h3>
              })} */}
              { list2 }
          {/* {list2} */}

                </div>


                    {/* <div className="row">
                           <div className="col-2">
                               Hello World
                            </div>
                            <div className="col-8">In second div
                             <div style={cardStyle}>
                                 <div style={card} expand="false">
                                    <div style={info}>
                                    <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                                        <div style={name}><h4> Rutvik Patel</h4></div>
                                    </div>
                                    <br></br>
                                   
                                    <p style={{fontSize:"19px",paddingLeft:"7px" }}>Hello In measge of the post</p>
                                    <hr></hr>
                                        <br></br>
                                    <img src='https://ipfs.infura.io/ipfs/Qmd16beEoC2jhSk8nE5otsk3D1iUxu1pJg6n4ePwXwhwA9?fbclid=IwAR27zV3u3oXAC4_iLfi11MKHKS2Q4kX4Y4t0KhWRe2P11wwW2i4wbo2OyVA'  style={{height: "100%",  width:"300px",marginLeft:"200px" }}></img>
                                    <hr></hr>
                                    
                                 </div>
                            </div> 
                            </div>
                            <div  className="col-2">
                                In third div
                            </div>
                    </div>         */}
                    {/* <hr></hr>
                    <div style={{textAlign:"center"}}>
                    <Button className="LogIn2" onClick={this.uploadProfilePic}>
                           Upload
                    </Button>
                    </div> */}

            </div>
        );
    }
}

export default timeline;