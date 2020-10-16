


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
          postPhotoVideoData:''
        };       
      }


      async componentWillMount(){
        this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
        this.loadData2();
        this.renderFunction();
      }

      loadData2=()=>{
console.log("in load 2");
      }
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
            console.log("outside function");
            console.log(privateKey);
         }

    });

  }
  this.pausecomp(500);

//Post Information
          tt= await contract.methods.postCount().call();
          var postCount=await tt;

          for(var i=1;i<=postCount;i++){
            const postInformationListFromBlockChain= await contract.methods.postInformation(i).call();
              ipfs.files.read("/user/"+postInformationListFromBlockChain.postOwnerUserId+"/postInformationTable",(error,result)=> {
                var postJsonResult = JSON.parse(result);
                console.log(postJsonResult);
                for(var j=0;j<postJsonResult.length;j++){
                    if(this.state.dataToParse.includes(postJsonResult[j].postId)){
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



          this.pausecomp(7500);

  //group Information 
  tt= await contract.methods.groupCount().call();
  var groupCount=await tt;
 
           for(var i=1;i<=groupCount;i++){
             const groupInformationListFromBlockChain= await contract.methods.groupInformation(i).call();
             console.log(groupInformationListFromBlockChain)

              console.log(groupInformationListFromBlockChain.groupOwnerUserId);
              console.log(this.state.postOwnerUserId);
             if(groupInformationListFromBlockChain.groupOwnerUserId==this.state.postOwnerUserId){
               ipfs.files.read("/user/"+groupInformationListFromBlockChain.groupOwnerUserId+"/groupInformationTable",(error,result)=> {
               //ipfs.get("/ipfs/"+groupInformationListFromBlockChain.groupHash,(error,result)=>{
                 var groupJsonResult = JSON.parse(result);
                  console.log(groupJsonResult);
                  this.setState({groupInformationFromIPFS:groupJsonResult});
                 
               });
             }
             
           }

           
           console.log(postViewerPrivateKey);
           this.setState({postViewPrivateKey:postViewerPrivateKey});
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

       renderFunction=()=>{
        this.pausecomp(200);
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
          this.setState({postPhotoVideoData:data.imageVideoIPFSHash});
          console.log(data);
          bytes  = CryptoJS.AES.decrypt(data.textData, sessionKey);
          var textualData = bytes.toString(CryptoJS.enc.Utf8);
          console.log(textualData);
          this.setState({postTextualData:textualData});
        });

       }



      render(){
        return(
            <div>
                In check function
                <Button onClick={this.handleClick} >Click Me</Button>
            </div>
        );
    }
}

export default viewPost4;