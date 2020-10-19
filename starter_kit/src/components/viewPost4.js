


import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { Crypt, RSA } from 'hybrid-crypto-js';
import { MDBInput } from 'mdbreact';
import './file.css'; 
import ReactDOM from 'react-dom'
import Files from 'react-files'


var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;


//Crypto
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var crypt = new Crypt();

//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })
var ipfs2 = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;


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


class viewPost4  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          dataToParse:null,

          postViewerName:null,
          postViewerUserId:null,
          postViewPrivateKey:'',


          postOwnerName:null,
          postOwnerUserId:null,
          
          
          postId:null,
          postInformation:null,

          groupInformationMap:null,

          postTextualData:'',
          postPhotoVideoData:'https://ipfs.infura.io/ipfs/'
        };       
      }


      async componentWillMount(){
        this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
        await this.loadBlockChainData21();
        await this.loadBlockChainData2();
       // this.loadData2();
       
       
       
      }

      // loadData2=()=>{
      //   for(var i=0;i<=200;i++){
      //     console.log(i);
      //   }
            
      // }
      loadData=()=>{
        this.setState({groupInformationMap:new Map()});
        console.log("in load data");
        var url =window.location.href;
        console.log(url);
        var secondUrl=url.substring(48,url.length);
        console.log(secondUrl);
        var secondUr=url.substring(48,url.length);
        var firstHalfName=url.substring(31,50);
        console.log(firstHalfName);
        var name="";
        var count=0;
        for(var i=0;i<firstHalfName.length;i++){
            var char =firstHalfName.charAt(i);
            if(char==="/"){
                count++;
            }
            else if(char==="?"){
                break;
            }
            else{
                name=name+char;
            }
        }
        console.log(name);
        this.setState({postViewerName:name});

        var dataToParse= url.substring(30,url.length);
        console.log(dataToParse);
        this.setState({dataToParse:dataToParse});
       
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


      async loadBlockChainData2(){
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
          tt= await contract.methods.groupCount().call();
          var groupCount=await tt;
         
                   for(var i=1;i<=groupCount;i++){
                     const groupInformationListFromBlockChain= await contract.methods.groupInformation(i).call();
                     console.log(groupInformationListFromBlockChain)
        
                      console.log(groupInformationListFromBlockChain.groupOwnerUserId);
                      console.log(this.state.postOwnerUserId);
                      console.log(groupInformationListFromBlockChain.groupOwnerUserId==this.state.postOwnerUserId);
                     if(groupInformationListFromBlockChain.groupOwnerUserId==this.state.postOwnerUserId){
                       console.log("in if");
                       ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
                       //ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                         var groupJsonResult = JSON.parse(result);
                          console.log(groupJsonResult);
                          this.setState({groupInformationFromIPFS:groupJsonResult});
                          
                          for(var j=0;j<=2500;j++){
                            console.log(j);
                            if(j==200){
                              this.renderFunction();
                            }
                          }
                         
                       });
                     }
                     
                   }
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
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


//user Information
tt= await this.state.contract.methods.userCount().call();
var userCount=await tt;
var postViewerPrivateKey='';
for(var i=1;i<=userCount;i++){
    const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
    console.log(userInformationListFromBlockChain)
    //console.log(this.state.userInformationListFromBlockChain)
   
      ipfs.files.read("/user/"+userInformationListFromBlockChain.userId+"/userInformationTable",(error,result)=> {
       // console.log(result[0]);
         var userJsonResult = JSON.parse(result);
         //console.log(userJsonResult);
          
         if(this.state.postViewerName.includes(userJsonResult.firstName)){
            console.log(userJsonResult.userId);
            this.setState({postViewerUserId:userJsonResult.userId});
            this.setState({postViewerName:userJsonResult.fullName});
            var privateKey;
            
            client.getSecretValue({SecretId: userJsonResult.userId}, function(err, data) {
              console.log("inside function");
              console.log(data.SecretString);
              privateKey=data.SecretString;
              postViewerPrivateKey=data.SecretString;
             
            });
            this.pausecomp(4000);
            console.log("outside function");
            console.log(privateKey);
         }

    });

  }
//  this.pausecomp(500);





         

  //group Information 


           //this.pausecomp(8500);
           console.log(postViewerPrivateKey);
           this.setState({postViewPrivateKey:postViewerPrivateKey});
           
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }


      async loadBlockChainData21(){
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
          tt= await contract.methods.groupCount().call();
          //Post Information
          tt= await contract.methods.postCount().call();
          var postCount=await tt;

          for(var i=1;i<=postCount;i++){
            const postInformationListFromBlockChain= await contract.methods.postInformation(i).call();
              ipfs.files.read("/user/"+postInformationListFromBlockChain.postOwnerUserId+"/postInformationTable",(error,result)=> {
                var postJsonResult = JSON.parse(result);
                console.log(postJsonResult);
                for(var j=0;j<postJsonResult.length;j++){
                  console.log("inside for loop");
                  console.log(this.state.dataToParse);
                  console.log(postJsonResult[j].postId);
                    if(this.state.dataToParse.includes(postJsonResult[j].postId)){
                        console.log("in if to get post ownwer ID");
                        console.log("----------------------------------");
                        this.setState({postOwnerUserId:postJsonResult[j].postOwnerUserId})
                        console.log(postJsonResult[j].postOwnerUserId);
                        this.setState({postId:postJsonResult[j].postId});
                        this.setState({postInformation:postJsonResult[j]});
                        this.setState({postOwnerName:postJsonResult[j].postOwnerName});
                    }
                }

                // this.setState({postInformationArray:postJsonResult});
                
              });
            
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
        console.log("in pause");
       }

       renderFunction=()=>{
       // this.pausecomp(200);
         console.log("in render function");
         console.log(this.state.groupInformationFromIPFS);
         console.log(this.state.postViewerUserId);
         console.log(this.state.postViewerName);
         console.log(this.state.postOwnerUserId);
         console.log(this.state.postViewPrivateKey);
         console.log(this.state.postOwnerName);
         console.log(this.state.postInformation);
        
        var groupInformation= this.state.groupInformationFromIPFS;
        var postViewerUserId=this.state.postViewerUserId;
        var postViewerName=this.state.postViewerName;
        var postOwnerUserId= this.state.postOwnerUserId;
        var postViewPrivateKey=this.state.postViewPrivateKey;
        var postOwnerName= this.state.postOwnerName;
        var postInformation=this.state.postInformation;
        var groupKeyInOriginalForm;

        var groupKeyVersion=postInformation.groupKeyVersion;
        //Getting the particular version group key data
        var particularGroupInfomation;
        for(var i=0;i<groupInformation.groupInformation.length;i++){
          var mainArray=groupInformation.groupInformation[i];
          if(mainArray.groupKeyVersion==groupKeyVersion){
            particularGroupInfomation=mainArray;
          }
        }
        console.log(particularGroupInfomation);

        //Getting the group Key In original Form
        for(var i=0;i<particularGroupInfomation.groupMembers.length;i++){
          console.log("inside foir llop");
          var insideInf=particularGroupInfomation.groupMembers[i];
          if(insideInf.userId==postViewerUserId){
            console.log("Inside loop")
            console.log(postViewPrivateKey);
            var groupKeyInOrginalForm2 = crypt.decrypt(postViewPrivateKey, insideInf.encryptedGroupKey);
            console.log(groupKeyInOrginalForm2);
            groupKeyInOriginalForm=groupKeyInOrginalForm2;
          }
        }

        //Decrypting the session with group Key 
        
        var bytes  = CryptoJS.AES.decrypt(postInformation.encryptedSessionKey, groupKeyInOriginalForm.message);
        var sessionKey = bytes.toString(CryptoJS.enc.Utf8);
        console.log(sessionKey);

        //Decrypting the IPFS Hash with session Key
         bytes  = CryptoJS.AES.decrypt(postInformation.encryptedIPFSPostHash, sessionKey);
        var IPFSHash = bytes.toString(CryptoJS.enc.Utf8);
        console.log(IPFSHash);

        //Decrypting the textual data with session key
        ipfs2.get("/ipfs/"+IPFSHash,(error,result)=>{

          var data=result[0].content;
          data=JSON.parse(data);
         // this.setState({postPhotoVideoData:data.imageVideoIPFSHash});
          console.log(data);
          bytes  = CryptoJS.AES.decrypt(data.textData, sessionKey);
          var textualData = bytes.toString(CryptoJS.enc.Utf8);
          console.log(textualData);
          this.setState({postTextualData:textualData});
          var imageVideoHash=this.state.postPhotoVideoData;
          console.log(imageVideoHash);
           imageVideoHash=imageVideoHash+data.imageVideoIPFSHash;
          console.log(imageVideoHash);
          this.setState({postPhotoVideoData:imageVideoHash});
        });

       }



      render(){
        var cardStyle={
      
          padding:"10px 10px 10px 10px",
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
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
        width:"1200px",
        height:"100%",
        maxWidth:"100%",
        backgroundColor:"white",
        marginBottom:"10px",
        fontSize:"14px",
        borderRadius:"3px",
        borderStyle: "solid",
        borderColor: "#365899"
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

        

        var tagLine={
          fontSize: "20px"
        }
        var signature ={
            marginLeft:"623px",
            fontFamily: "cursive",
            fontSize: "20px",
            color: "#00664b"
        }
        let imageStyle={
          position: "relative",
          maxWidth: "800px",
          margin: "0 auto",
          cursor: "none"
    }
    let text={
      position: "absolute",
      bottom: "0",
      background: "rgb(0, 0, 0)",
      background: "rgba(0, 0, 0, 0.5",
      color: "#f1f1f1", 
     // width: "100%" ,
      padding: "9px",
      marginLeft:"720px",
      border: "3px solid #a6a6a6",
      // borderRadius: "20px"
      fontFamily: "cursive",
      textShadow: "2px 2px 4px #000000",
      fontSize: "19px",
      pointerEvents : "none"
    }
    let border={
      border: "5px solid rgb(54, 88, 153)",
      marginLeft:"300px",
      marginRight:"300px",
      paddingBottom:"50px",
      paddingTop:"30px"
    }

        return(
            <div className="container">
                In check function
                <Button onClick={this.handleClick} >Click Me</Button>
                <div className={border}>
                  <div className="container">
                  <div style={info}>
                  <img style={photo} src='https://www.gstatic.com/tv/thumb/persons/509114/509114_v9_ba.jpg' ></img>
                  <div style={name}><h4> {this.state.postOwnerName}</h4></div>

                  </div>
                  <hr></hr>
                  <p style={tagLine}>
                  {this.state.displayData}
                  <span style={signature}>{this.state.signatureText}</span>
                  </p>
                  <hr style={{width:"40px",textAlign:"left",marginLeft:"730px",marginTop:"-15px",  position:"relative",borderTop: "7px solid" }}></hr> 
                  </div>
                  <p style={tagLine}>
{this.state.postTextualData}
<span style={signature}>{this.state.signatureText}</span>
</p>
                  <div className="container" >
                  <img src={this.state.postPhotoVideoData} style={{height:'700px', width:"100%"}} alt="Notebook" />
                  <div style={text}>
                      <p>{this.state.signatureText}</p>
                  </div>
                  </div>
                  </div>
            </div>
        );
    }
}

export default viewPost4;