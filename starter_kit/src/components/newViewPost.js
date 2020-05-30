import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import './file.css'; 



var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var CryptoJS = require("crypto-js");


class viewPost  extends Component{

    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          uuid:'',
          viewPostPersonfullName:'',
          currentUserEmailId:'',
          PostOwnerEmailId:'',
          PostOwnerFullName:'',
          PostOwnerData:null,
          dataToParse:'',
          userInformationListFromBlockChain:[],
          currentUserName:'',
          userData:[],
          allUserName:[],
          noSpaceAllUserName:[],
          postInformation:[],
          groupInformationListFromBlockChain:[],
          chromeExtensionData:'',
          userListEmailIdSet:null,
          postUserGroupIPFSData:'',
          postUserPostIPFSData:'',
          postText:'',
          postImage:'',
          displayData:'',
          renderCondition:0
        };       
      }
      async componentWillMount(){
       console.log("Before load data");
        await  this.loadData();
        console.log("After load data");

        console.log("Before loadWeb3");
        await this.loadWeb3()
        console.log("After loadWeb3");
        console.log("Before  load bc");
        await this.loadBlockChainData();
        console.log("After  load bc");

        console.log("Before load display data");

       // await this.displayData();
        console.log("After load display data");

    //     setInterval(function()
    //     { 
    //     console.log(valueToPass);
    //      this.displayData();
    //   },3000);

       
      }
      async componentDidMount(){
        document.addEventListener('csEvent', this.checkEvent);
      }

       displayData=()=>{
        console.log(this.state.userData);
        console.log(this.state.userInformationListFromBlockChain)
        for(var i=0;i<this.state.userData.length;i++){
            var allUserName=this.state.userData[i].fullName;
            this.setState({
                allUserName:[...this.state.allUserName,allUserName]
              })
              var noSpaceAllUserName=allUserName.split(" ").join(""); 
              if(this.state.dataToParse.includes(noSpaceAllUserName)){
                console.log(allUserName);
                this.setState({currentUserName:allUserName})
                this.setState({currentUserEmailId:this.state.userData[i].emailId})
              }
        }
        console.log(this.state.currentUserName);
        for(var i=0;i<this.state.userData.length;i++){
          if(this.state.userData[i].fullName==this.state.currentUserName){
            console.log(this.state.userData[i])
            console.log(this.state.currentUserName);
            this.setState({currentUserEmailId:this.state.userData[i].emailId})
          }
        }
        console.log(this.state.PostOwnerEmailId);
        console.log(this.state.PostOwnerData);
        for(var i=0;i<this.state.userData.length;i++){
         if(this.state.PostOwnerEmailId==this.state.userData[i].emailId){
           console.log(this.state.userData[i].fullName);
            this.setState({PostOwnerFullName:this.state.userData[i].fullName})
         }
        }

        var count=0;
       for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
        console.log(this.state.groupInformationListFromBlockChain[i]);
        ipfs.get("/ipfs/"+this.state.groupInformationListFromBlockChain[i].groupHash,(error,result)=>{

            //console.log(result[0].path);
            var content=result[0].content;
            console.log(content);
            var userData=JSON.parse(content);
            console.log(userData);
            for(var j=0;j<userData.postData.length;j++){
              console.log(userData.postData[j]);
              var uuid=userData.postData[j].postUUID;
              console.log(uuid);
              if(this.state.dataToParse.includes(uuid)){
                this.setState({PostOwnerData:userData.postData[j]});
                console.log(userData);
                this.setState({PostOwnerFullName:userData.groupOwnerName})
                console.log(this.state.PostOwnerFullName);
                // this.setState({PostOwnerData:postInformation});
                for(var i=0;i<this.state.userData.length;i++){
                  if(this.state.userData[i].fullName==this.state.PostOwnerFullName){
                    //console.log(this.state.userData[i])
                    //console.log(this.state.currentUserName);
                    this.setState({PostOwnerEmailId:this.state.userData[i].emailId})
                    break;
                  }
                }
                console.log(this.state.PostOwnerEmailId);
            }
            }
            // this.setState({UserGroupIPFSData:userData})
            // this.setState({
            //     userData:[...this.state.userData, userData]
            //   })
            count++;
            if(count==this.state.groupInformationListFromBlockChain.length){
                console.log("in if");
                this.displayData2()
            }
        })
       }
        

        
        // this.setState({currentUserGroupHash:lastestGroupDetailHash.groupHash})
        // this.setState({currentGroupKeyInformation:lastestGroupDetailHash});

    }

    displayData2=()=>{



      var dataArray=[];
      for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
        console.log(this.state.groupInformationListFromBlockChain[i]);
        if(this.state.groupInformationListFromBlockChain[i].groupEmailId==this.state.PostOwnerEmailId){
          dataArray.push(this.state.groupInformationListFromBlockChain[i]);
        }
      }
      console.log(dataArray);
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



      if(max!=-1){
        console.log("in if");
        var groupHash=lastestGroupDetailHash.groupHash;
        console.log(groupHash);
        var taken=0;
        ipfs.get("/ipfs/"+groupHash,(error,result)=>{
          console.log(error);
          var content=result[0].content;
           var groupData=JSON.parse(content);
           console.log(groupData);
          var dataArray=groupData.groupDetails
          for(var i=0;i<dataArray.length;i++){
            if(dataArray[i].emailId==this.state.currentUserEmailId){
              taken=1;
              console.log(taken);
              this.setState({renderCondition:1});
             // this.decryptedData();
            }
          }
          //this.state.postUserPostIPFSData
          if(taken==1){ 
            ipfs.get("/ipfs/"+this.state.PostOwnerData.postHash,(error,result)=>{
              var tempContent=result[0].content;
              console.log(tempContent);
              var tempgroupdata=JSON.parse(tempContent);
              console.log(tempgroupdata);
              this.setState({postUserGroupIPFSData:tempgroupdata});
              //console.log(this.state.postUserPostIPFSData);
              this.decryptedData();
            });
          }

        });
      //   ipfs.get("/ipfs/"+this.state.PostOwnerData.postHash,(error,result)=>{
      //     //console.log(result[0].path);
      //     var content=result[0].content;
          
      //     var posterdata=JSON.parse(content);
      //     console.log(posterdata);
      //     this.setState({postUserPostIPFSData:posterdata});
      //     var dataArray=posterdata.sessionKeyDetails;
          
      //     for(var i=0;i<dataArray.length;i++){
      //       if(dataArray[i].emailId==this.state.currentUserEmailId){
      //         taken=1;
      //         console.log(taken);
      //         this.setState({renderCondition:1});
      //       }
      //     }
          // if(taken==1){ 
          //   ipfs.get("/ipfs/"+groupHash,(error,result)=>{
          //     var tempContent=result[0].content;
          //     var tempgroupdata=JSON.parse(tempContent);
          //     this.setState({postUserGroupIPFSData:tempgroupdata});
          //     this.decryptedData();
          //   });
          // }
      // })
      }
    }


    checkEvent = (event) => {
     
      var data = event.detail;
      console.log(data);
      this.setState({chromeExtensionData:event});
      console.log("Nv Enter:", event);
      console.log(this.state.chromeExtensionData);
      }


    decryptedData=()=>{
      console.log(this.state.chromeExtensionData.detail.privateKeyData)
      var stringPrivateKeyData=this.state.chromeExtensionData.detail.privateKeyData;
      var jsonPrivateKeyData=JSON.parse(stringPrivateKeyData);
      console.log(jsonPrivateKeyData);
      var h=jsonPrivateKeyData;
      var sequenceNumber;
      var FinalPrivateKey;
      console.log(jsonPrivateKeyData.no1);
      for (var key in jsonPrivateKeyData) {
        console.log(key);
       
        console.log(jsonPrivateKeyData[key])
        console.log(this.state.currentUserName);
        console.log(this.state.currentUserEmailId==jsonPrivateKeyData[key]);
        if(this.state.currentUserEmailId==jsonPrivateKeyData[key]){
          console.log("match found");
          var no=key.substring(7,key.length);
          var privateKey="privateKey";
          var result=privateKey+no;
          console.log(result);
          FinalPrivateKey=jsonPrivateKeyData[result];
          break;
        }

        // console.log(this.state.userListEmailIdSet.has(jsonPrivateKeyData[key]));
        // if(this.state.userListEmailIdSet.has(jsonPrivateKeyData[key])){
        //   console.log(key);
        //   var no=key.substring(7,key.length);
        //   sequenceNumber=no;
        //   console.log(no);
        // }
      }
      console.log(FinalPrivateKey);
      console.log(this.state.postUserPostIPFSData);
      console.log(this.state.postUserGroupIPFSData);
      var temp;
      for(var i=0;i<this.state.userInformationListFromBlockChain.length;i++){
        if(this.state.userInformationListFromBlockChain[i].userEmailId==this.state.currentUserEmailId){
          console.log(this.state.userInformationListFromBlockChain[i])
          temp=this.state.userInformationListFromBlockChain[i];
          break;
        }
      }
      console.log(temp);
      console.log(temp.publickey);
      var gg=temp.publickey.toString();
      console.log(gg);
      
      //var ciphertext = CryptoJS.AES.encrypt(groupKey,FinalPrivateKey).toString();
      //console.log(ciphertext);
      // console.log(this.state.postUserGroupIPFSData.commonGroupKey);
      // var groupKey =this.state.postUserGroupIPFSData.commonGroupKey.toString();
      //  var bytes  = CryptoJS.AES.decrypt(groupKey,gg);
      //  console.log(bytes);
      //  var originalText = bytes.toString(CryptoJS.enc.Utf8);
     
      //  console.log(originalText );
      //  console.log("end");
      
      // console.log("-----------------------");
      console.log(this.state.postUserGroupIPFSData);
       var tempPostHash=this.state.postUserPostIPFSData.postHash;
       console.log(tempPostHash);

      console.log(this.state.postUserGroupIPFSData);

      ipfs.get("/ipfs/"+this.state.PostOwnerData.postHash,(error,result)=>{
        var tempContent=result[0].content;
        var postData=JSON.parse(tempContent);
        console.log(postData);
        this.setState({postData:postData.postTextHash});
        var ipfsLink="https://ipfs.infura.io/ipfs/";
        var gart=postData.postPicHash;
        var result1=ipfsLink+gart;
        this.setState({postImage:result1})
        this.renderData()
      });


    }
    renderData=()=>{
      ipfs.get("/ipfs/"+this.state.postData,(error,result)=>{
        var tempContent=result[0].content;
        var postData=JSON.parse(tempContent);
        console.log(postData);
        this.setState({displayData:postData});
      });
    }


    async  loadData(){
        console.log("in load data");
        var url =window.location.href;
        var secondUrl=url.substring(48,url.length);
        console.log(secondUrl);
        var secondUr=url.substring(48,url.length);
        var firstHalfName=url.substring(30,45);
        console.log(firstHalfName);
        var dataToParse= url.substring(30,url.length);
        console.log(dataToParse);
        this.setState({dataToParse:dataToParse})
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
          this.state.userListEmailIdSet=new Set();
        var tt= await this.state.contract.methods.userCount().call();
        var userCount=await tt;
        for(var i=1;i<=userCount;i++){
          const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
          this.state.userListEmailIdSet.add(userInformationListFromBlockChain.userEmailId);  
          this.setState({
            userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
          })
        }
        console.log(this.state.userInformationListFromBlockChain);

        // ipfs.get("/ipfs/"+t,(error,result)=>{
        //     console.log(result[0].path);
        //     content=result[0].content;
        //   })


         tt= await this.state.contract.methods.groupCount().call();
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
          tt= await this.state.contract.methods.postCount().call();
          var postCount=await tt;
          for(var i=1;i<=postCount;i++){
            const postInformation= await this.state.contract.methods.postInformation(i).call();
            console.log(postInformation);
            if(this.state.dataToParse.includes(postInformation.uuid)){
                this.setState({PostOwnerEmailId:postInformation.postedEmailId})
                this.setState({PostOwnerData:postInformation});
            }
            this.setState({
                postInformation:[...this.state.postInformation,  postInformation]
            })
          }
        
          
          var count=0;
        for(var i=0;i<this.state.userInformationListFromBlockChain.length;i++){

            var userHash = this.state.userInformationListFromBlockChain[i].userHash;
            console.log(userHash);
                    ipfs.get("/ipfs/"+userHash,(error,result)=>{

                    //console.log(result[0].path);
                    var content=result[0].content;
                    console.log(content);
                    var userData=JSON.parse(content);
                    this.setState({
                        userData:[...this.state.userData, userData]
                      })
                    count++;
                    if(count==this.state.userInformationListFromBlockChain.length){
                        console.log("in if");
                        this.displayData()
                    }
                })
              
        }


        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
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
        //  color:"#365899",
        fontSize: "25px",
        textTransform: "uppercase",
       
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
        

  const renderAuthButton = ()=>{
    if(this.state.renderCondition==1){
      return(

        <div className="row">
        <div className="col-2">
            Hello World
         </div>
         <div className="col-8">In second div
          <div style={cardStyle}>
              <div style={card} expand="false">
                 <div style={info}>
                 <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                     <div style={name}><h4> {this.state.PostOwnerFullName}</h4></div>
                 </div>
                 <br></br>
                
  <p style={{fontSize:"19px",paddingLeft:"7px" }}>{this.state.displayData}</p>
                 <hr></hr>
                     <br></br>
                 <img src={this.state.postImage}  style={{height: "100%",  width:"500px",marginLeft:"200px" }}></img>
                 <hr></hr>
                 
              </div>
         </div> 
         </div>
         <div  className="col-2">
             In third div
         </div>
  </div>  
      )
    }
    else{
      return (
        <div>Not A friend

        <div style={cardStyle}>
              <div style={card} expand="false">
                 <div style={info}>
                 <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                     <div style={name}><h4> {this.state.PostOwnerFullName}</h4></div>
                 </div>
                 <br></br>
                
              <p style={{fontSize:"19px",paddingLeft:"7px" }}>{this.state.displayData}</p>
                 <hr></hr>
                     <br></br>
                 <img src={this.state.postImage}  style={{height: "100%",  width:"500px",marginLeft:"200px" }}></img>
                 <hr></hr>
                 
              </div>
         </div> 

           </div>
      )
    }
  }






        return(
            <div>
                In View Post 
                <h2>Hello {this.state.currentUserName}</h2>
                <h3>{this.state.currentUserEmailId}</h3>

                <hr></hr>
                <h3>Posted By</h3>
                <h2>{this.state.PostOwnerFullName}</h2>
                <h2>{this.state.PostOwnerEmailId}</h2>


              <div>
                <div className="container text-center ">
                   <h2 style={ReactHeading}>Hello {this.state.currentUserName}</h2>
               </div>
               <br>
               </br>
               <br>
               </br>
               {renderAuthButton()}
      
                    <hr></hr>
                    <div style={{textAlign:"center"}}>
                    <Button className="LogIn2" onClick={this.uploadProfilePic}>
                           Upload
                    </Button>
                    </div> 
              </div>

            </div>
        );
    }

}
export default viewPost;