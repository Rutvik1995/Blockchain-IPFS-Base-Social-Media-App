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
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;


class MainPage  extends Component{

  
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userEmailId:'',
          fullName:'',
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
          groupInformationPassParameter:''
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
        console.log("in load data");
       this.setState({fullName:this.props.location.fullName});
       this.setState({userEmailId:this.props.location.userEmailId});
       this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
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
            if(groupInformationListFromBlockChain.groupEmailId==this.state.userEmailId){
              this.setState({
                groupInformationListFromBlockChain:[...this.state.groupInformationListFromBlockChain, groupInformationListFromBlockChain]
             })
            }
            
          }
          ////

          console.log(this.state.userJsonResultOfParticularUserFromIPFS);
          var arrayData=this.state.userJsonResultOfParticularUserFromIPFS.friend;
          for(var i=0;i<arrayData.length;i++){
           console.log(arrayData[i]);
          }
          console.log(this.state.groupInformationListFromBlockChain)
          let myMap = new Map();
          var max=-1;
          for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
            
           var value=this.state.groupInformationListFromBlockChain[i].groupVersion;
           value=value.toString();
           myMap.set(value,this.state.groupInformationListFromBlockChain[i]);
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
         
         if(max!=-1){
          var t= lastestGroupDetailHash.groupHash;
          var content;
          ipfs.get("/ipfs/"+t,(error,result)=>{
            console.log(result[0].path);
            content=result[0].content;
            console.log(content);
           var groupData=JSON.parse(content);
           console.log(groupData);
           
           this.setState({ groupInformationPassParameter:groupData})
           console.log(this.state.groupInformationPassParameter);
          })
         }





        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }
      checkValue=()=>{
        // console.log(this.props.location.TotalUser);
        // console.log(this.props.location.fullName);
        //console.log()
        console.log(this.state. fullName);
        console.log(this.state.userEmailId);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser);
        console.log("Orginal Value");
        console.log(this.props.location.userBlockchainResultOfParticularUser);
      }

      addFriend=()=>{
       console.log("In create Account");
          this.props.history.push({
            pathname: '/AddFriend',
            data: this.state.currentEmailId,
            name: this.props.location.name   // your data array of objects
          })

      }
      addPost=()=>{
        this.props.history.push({
          pathname: '/addPost',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
      }
      checkFriendRequest=()=>{
        console.log("In check friend request");
        console.log(this.state.userEmailId);
        console.log(this.state.fullName);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser);
           this.props.history.push({
             pathname: '/checkRequest',
             userEmailId: this.state.userEmailId,
             fullName:  this.state. fullName,
             userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
             totalUser:this.state.totalUser,
             userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
           })
 
       }
       openTimeline=()=>{
        console.log("In check friend request");
        var t="adv";
        this.props.history.push({
          pathname: '/Timeline',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }
       postRead=()=>{
         var url ="QmYah59VfHQTNPnhk1f5hwnVqkxRC6CB9xvMjzLro9VBsw";
        this.props.history.push({
          pathname: '/postReader/'+url,
         // data: this.state.currentEmailId,
          //name: this.props.location.name   // your data array of objects
        })
       }

       feed=()=>{

        this.props.history.push({
          pathname: '/Feed',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }

       
       searchFriends=()=>{
        console.log("in people");
        this.props.history.push({
          pathname: '/searchFriends',
          userEmailId: this.state.userEmailId,
          fullName:  this.state. fullName,
          userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
          totalUser:this.state.totalUser,
          userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
        })
       }

       friend=()=>{
        this.props.history.push({
          pathname: '/friend',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
       }
       signOut=()=>{
        this.props.history.push({
          pathname: '/login',
           // your data array of objects
        })
       }
       addProfilePic=()=>{
        // this.props.history.push({
        //   pathname: '/addProfilePic',
        //   userEmailId: this.state.userEmailId,
        //   fullName:  this.state. fullName,
        //   userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
        //   totalUser:this.state.totalUser,
        //   userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
        // })

        this.setState({profilePicModal : true });
     
       }
       openPostModel=()=>{
         console.log("inside open");
         this.setState({ showModal: true });
       }
       closePostModel=()=>{
        console.log("inside close");
        this.setState({ showModal: false });
       }
       closeProfilPicModel=()=>{
        console.log("inside close");
        this.setState({ profilePicModal: false });
       }
       getPostLink=()=>{
        this.setState({ showModal: true });
      }
      captureProfilePicFile=(event)=>{
        console.log(ipfs );
        event.preventDefault();
        console.log("file is capture");
        console.log(event);
        console.log(event.target.files[0]);
        var file = event.target.files[0];
        var reader = new window.FileReader();
        reader.readAsArrayBuffer(file);  
        reader.onloadend = ()=>{
          console.log(reader.result);
          this.setState({profilePicBuffer:Buffer(reader.result)})
          console.log("buffer",Buffer(reader.result));
        }
        //process the file inside here 
    }


  

    capturePostFile=(event)=>{
      console.log(ipfs );
        event.preventDefault();
        console.log("file is capture");
        console.log(event);
        console.log(event.target.files[0]);
        var file = event.target.files[0];
        var reader = new window.FileReader();
        reader.readAsArrayBuffer(file);  
        reader.onloadend = ()=>{
          console.log(reader.result);
          this.setState({postPicBuffer:Buffer(reader.result)})
          console.log("buffer",Buffer(reader.result));
        }   
    }

    uploadProfilePic=()=>{
      console.log("uploadProfilePic");
     // event.preventDefault();
      console.log("in submit event");
      const file = {
         content: this.state.profilePicBuffer
         //content:this.
      }
      var t;
      ipfs.add(file,(error,results)=>{
          //Do Stuff here
         console.log("IPFS RESULT",results[0].hash);
          var hash=results[0].hash;
          t=results[0].hash;
          var url ="https://ipfs.infura.io/ipfs/";
          var url2=t;
          var third=url+url2;
          console.log(third);
          this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash=third;
          console.log(this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash);
          this.setState({urlhash:t});
          if(error){
            console.log(error);
            return;
          }
          var content;
          ipfs.get("/ipfs/"+t,(error,result)=>{
            console.log(result[0].path);
            content=result[0].content;
          })
   
          //Step 2 is to store file on blockchain
          this.filesrc="http://localhost:8080/ipfs/"+hash;
          console.log("https://ipfs.infura.io/ipfs/"+hash);
          console.log(this.filesrc);
          this.setState({profilePicHash:hash});

          var userId=   this.state.userBlockchainResultOfParticularUser.userId;
          var myObj=this.state.userJsonResultOfParticularUserFromIPFS;
          console.log(myObj);
          var originalContentString = Buffer.from(JSON.stringify(myObj));
            // The json is change to string format 
            const userContent= {
              content:originalContentString
          }
          
          ipfs.add(userContent,(error,results)=>{
            console.log(results);
            var userInformationHash= results[0].hash;
           // this.setState({userJsonResultOfParticularUserFromIPFS:userInformationHash});
          //console.log(this.state.userJsonResultOfParticularUserFromIPFS);
            console.log(results[0].hash);
            this.setState({IPFSuserInformationHash:results[0].hash});   
            this.state.userBlockchainResultOfParticularUser.userHash=results[0].hash;
            console.log(userId);          
               this.state.contract.methods.changeUserInformation(userId,userInformationHash).send({from: this.state.account}).then((r)=>{
                  console.log(r);
              });  
              this.state.userBlockchainResultOfParticularUser.userHash=userInformationHash;
              console.log(this.state.userBlockchainResultOfParticularUser.userHash);
          });

        })
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
   makeUUID=(length)=>{
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


   getFriends=()=>{
     console.log(this.state.userJsonResultOfParticularUserFromIPFS);
     var arrayData=this.state.userJsonResultOfParticularUserFromIPFS.friend;
     for(var i=0;i<arrayData.length;i++){
      console.log(arrayData[i]);
     }
     console.log(this.state.groupInformationListFromBlockChain)
     let myMap = new Map();
     var max=-1;
     for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
       
      var value=this.state.groupInformationListFromBlockChain[i].groupVersion;
      value=value.toString();
      myMap.set(value,this.state.groupInformationListFromBlockChain[i]);
      console.log(value);
      if(value>max){
        max=value;
      }
     }
     console.log("lastest group version is");
     console.log(max);
     console.log(myMap.get(max));
     var lastestGroupDetailHash= myMap.get(max);

    var t= lastestGroupDetailHash.groupHash;
     var content;
       ipfs.get("/ipfs/"+t,(error,result)=>{
         console.log(result[0].path);
         content=result[0].content;
         console.log(content);
        var groupData=JSON.parse(content);
        console.log(groupData);
        
        this.setState({ groupInformationPassParameter:groupData})
        console.log(this.state.groupInformationPassParameter);
       })
       

   }


 

   about=()=>{
    console.log("outside the loop");
    console.log(this.state.groupInformationPassParameter);
  }

    actuallyPost=()=>{

      var postText=document.getElementById("postTextArea").value;
      var sessionKey=this.makeid(20);
      console.log(postText);
      var postTextHash;
      var postPicHash;
      var postHash;
    //This is the the data which is enter by the user 
    var userInformationHash;
    var originalContentString = Buffer.from(JSON.stringify(postText));
      // The json is change to string format 
      const userContent= {
        content:originalContentString
    }
    ipfs.add(userContent,(error,results)=>{
              console.log(results);
              userInformationHash= results[0].hash;
              console.log(results[0].hash);
              postTextHash=results[0].hash;
              console.log(postTextHash)
            const file = {
              content: this.state.postPicBuffer
              //content:this.
          }
      var t;
      ipfs.add(file,(error,results)=>{
       //Do Stuff here
      console.log("IPFS RESULT",results[0].hash);
       var hash=results[0].hash;
       t=results[0].hash;
       var url ="https://ipfs.infura.io/ipfs/";
       var url2=t;
       var third=url+url2;
       postPicHash=results[0].hash;
       console.log("third");
       console.log(third);
       if(error){
         console.log(error);
         return;
       }
       var content;
       ipfs.get("/ipfs/"+t,(error,result)=>{
         console.log(result[0].path);
         content=result[0].content;
       })
       //Step 2 is to store file on blockchain
       this.filesrc="http://localhost:8080/ipfs/"+hash;
       console.log("https://ipfs.infura.io/ipfs/"+hash);

            var myObj = {
              "postTextHash":postTextHash,
              "postPicHash":postPicHash  
            };
          //This is the the data which is enter by the user 
          
          console.log(myObj);
          console.log(this.state.chromeExtensionData);
          var originalContentString = Buffer.from(JSON.stringify(myObj));
            // The json is change to string format 
            const userContent= {
              content:originalContentString
          }
         
          ipfs.add(userContent,(error,results)=>{
            console.log(results);
            postHash= results[0].hash;
            console.log(postHash);
            var localPostHash=results[0].hash;
            console.log(this.state.fullName);
            console.log(this.state.userBlockchainResultOfParticularUser);
            console.log(this.state.userJsonResultOfParticularUserFromIPFS);
            console.log(sessionKey);
            


            console.log("this is encrypted posh hahs");
            var encryptedPostHash= CryptoJS.AES.encrypt(postHash, sessionKey).toString();
            var bytes  = CryptoJS.AES.decrypt(encryptedPostHash, sessionKey);
            var originalText = bytes.toString(CryptoJS.enc.Utf8);
            console.log(originalText); // 'my message'
            var arrayData=this.state.groupInformationPassParameter.groupDetails;
            console.log(arrayData);
            console.log(arrayData==undefined);
            var userObj={
              postOwner:this.state.fullName,
              postHash:results[0].hash,
              sessionKey:sessionKey,
              encryptedPostHash:encryptedPostHash,
              groupVersion:this.state.groupInformationPassParameter.groupVersion,
              sessionKeyDetails:[]
            }
            console.log("Checking the data");
            console.log(userObj);
            console.log("------");
            
            if(arrayData==undefined){
              userObj.groupVersion=0;
            }
            else{
              for(var i=0;i<arrayData.length;i++){
                console.log(arrayData[i]);
                var encryptedUserSession= CryptoJS.AES.encrypt(sessionKey, arrayData[i].encryptedGroupkey).toString();
                var usr={
                  emailId:arrayData[i].emailId,
                  encryptedUserSession:encryptedUserSession,
                  userHash:arrayData[i].userHash
                }
                console.log(usr);
                userObj.sessionKeyDetails.push(usr);
              }
            }

            console.log("Json data");
            console.log(userObj);
            var uuid = this.makeUUID(40);
            uuid=1;
            var date =  new Date();
            var stringData=date.toString();
            //////

            // this.state.contract.methods.createPost(this.state.userEmailId,userInformationHash).send({from: this.state.account}).then((r)=>{
            //   console.log(r);
            var originalContentString = Buffer.from(JSON.stringify(userObj));
            // The json is change to string format 
            const userContent= {
              content:originalContentString
          }
          ipfs.add(userContent,(error,results)=>{

              var postHashAddress=results[0].hash;
              console.log(postHashAddress);
              //string memory _postedByEmailId,string memory _postHash, uint _uniquePostId ,string memory _currentDateAndTime
            this.state.contract.methods.createPost(this.state.userEmailId,postHashAddress,uuid,stringData ).send({from: this.state.account}).then((r)=>{
              console.log(r);
            });
          });

            ///////
          });
         
          // var userObj={
          //   postOwner:this.state.fullName,
          //   postHash:postHash,
          //   sessionKey:sessionKey,
            
          // }

     })



  });



      window.open( 
              "http://localhost:8888/Facebook-sdk/facebooksdk/?url?=http://localhost:3000/MainPage", "_blank"); 
       
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
      const mystyle2 = {
        padding: "10px",
        fontFamily: "Arial",
        cursor: "pointer",
        borderStyle: "solid",
        color:"while",
        backgroundColor: "#365899",
        color:"#fff"
      };
      const mystyle3={
        paddingLeft:"20px"
      }

      var cardStyle={
        
        padding:"10px 10px 10px 10px",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
       // width:"1000px 
    }
    var cardStyle2={
        
      padding:"10px 10px 10px 10px",
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      textAlign:"center"
     // width:"1000px 
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
      height:"280px",
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
      var addPost= {
        float: "right",
        background: "#365899",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        //padding: "10px 15px",
        //borderRadius: "6px"
      }
      var modalPost= {
     
        background: "#365899",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        //padding: "10px 15px",
        //borderRadius: "6px"
      }

      var modalBorder={
        borderStyle: "solid",
        borderColor: "#365899"
      }
      var fileUpload={
        fontSize: "20px",
        height:"40px",
        color:"blue",
        background: "#365899",
        borderStyle: "solid",
        borderColor: "#365899"
      }
      const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};
        // console.log("hello in main page");
        // console.log(this.props);
        // console.log(this.props.location.data['emailId'])
        // console.log("just checking");

        // var t = 'Rutvik';
        //this.setState({displayEmailId:this.props.location.data['emailId']})
        //console.log(this.state.name);
      console.log("Name state object "+this.state.fullName);
        return(
            <div>
                <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                      className="navbar-brand col-sm-3 col-md-2 mr-0 text-center"
                      target="_blank"
                      rel="noopener noreferrer">
                    <h1></h1>
                    <p></p>
                    <div></div>
                    </a>
                 </nav>
                 <br></br>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="#home"><img  src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash}  style={{height: "100%",  width:"70px" }} alt="" className="img-responsive" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        <Nav.Link ><Button variant="primary" style={{background:"#365899"}} onClick={this.checkFriendRequest}> <span className="fa fa-id-badge"></span>   Check Request</Button></Nav.Link>
                        <Nav.Link ><Button variant="outline-secondary" onClick={this.searchFriends}><span className=" fa fa-search"></span>  Search Friend</Button></Nav.Link>
                        </Nav>
                    <Button variant="primary"  style={{marginRight: "10px",background:"#365899" }}>
                    
                     {this.state.fullName}
                     
                     </Button>
                    <Button Button variant="light"  onClick={this.signOut} ><span class="fa fa-sign-out"></span> Log Out</Button>
                  
                </Navbar.Collapse>
                </Navbar>

                <div>
                    <div className="row">
                    <div className="col-3">
                      <div style={ mystyle3}>
                      <ListGroup>
                        <ListGroup.Item style={mystyle2}>
                          <div className="row">
                           
                            <div className="col-2">
                              <img style={photo}  src= {this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash} ></img>
                              </div>
                              <div className="col-10">
                              <span style={{fontSize:"20px"}}><h4>{this.state.fullName}</h4></span>
                              </div>
                                                        
                          </div>
                         
                        </ListGroup.Item>
                        <ListGroup.Item style={mystyle} onClick={this.getFriends} >Friend List</ListGroup.Item>
                        <ListGroup.Item style={mystyle} onClick={this.addProfilePic} >Add Profile Pic</ListGroup.Item>
                        <ListGroup.Item style={mystyle} onClick={this.about}>About</ListGroup.Item>
                        <ListGroup.Item style={mystyle} >Vestibulum at eros</ListGroup.Item>
                      </ListGroup>
                      </div>
                    </div>
                    <div className="col-7">
                    <div style={cardStyle}>
                        <div style={card} expand="false">
                          <div style={info}>
                              <img style={photo} src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash} ></img>
                            <div style={name}><h4>{this.state.fullName}</h4></div>
                          </div>
                          <input type="text" style={username} name="username" placeholder="what's on your mind," required />  
                          <hr></hr>
                          <Button style={addPost}  onClick={this.openPostModel}>Add Post</Button>
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
                  <div style={cardStyle2}>
                          <div style={card2} expand="false">
                            <div style={info}>
                                <img style={photo} src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash} ></img>
                              <div style={name}><h4>{this.state.fullName}</h4></div>
                              <div style={{textAlign:"center", marginTop:"280px"}} >
                               <img src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash}  style={{height: "100%",  width:"300px" }}></img>
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




          



              <Modal show={this.state.showModal} onHide={this.closePostModel} stye={modalBorder}  size="lg">
                  <Modal.Header closeButton>
                   <Modal.Title  style={{textAlign:"center"}} > Create Post</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div style={cardStyle}>
                          <div style={card2} expand="false">
                            <div style={info}>
                                <img style={photo} src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash} ></img>
                              <div style={name}><h4>{this.state.fullName}</h4></div>
                            </div>
                            <br></br>
                            <MDBInput type="textarea"  id="postTextArea" rows="5" />     
                          </div>
                    </div>
                    <div>
                    <input type="file"  onChange={this.capturePostFile}/> 
                    </div>
   
                    <hr></hr>
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

export default MainPage;