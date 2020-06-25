import React, { Component,useState } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Nav,Navbar,Card,Modal } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron'
import ReactSearchBox from 'react-search-box'
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var CryptoJS = require("crypto-js");

class checkRequest2  extends Component{

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
          hasError: false,
          userMap:null,
          userPublicKeyMap:null ,
          groupInformationListFromBlockChain:[],
          currentUserGroupHash:'',
          currentGroupKeyInformation:null,
          SuccessMessage:false,
          friendName:''
        };       
      }




      async componentWillMount(){
        //this.pausecomp(8500);
        //this.pausecomp(4500);
        await this.loadData();
       
        await this.check();
        this.pausecomp(4500)
        await this.loadUserMap();
       await this.getName();
        await this.loadNameList();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }
      async loadNameList(){
        console.log(this.state.totalUserName);
      }
      async loadData(){
       this.setState({userMap:new Map()});
       this.setState({userPublicKeyMap:new Map()});
        this.setState({fullName:this.props.location.fullName});
        this.setState({userEmailId:this.props.location.userEmailId});
        this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
        this.setState({userInformationListFromBlockChain:this.props.location.userInformationListFromBlockChain});
        this.setState({totalUser:this.props.location.totalUser});
        this.setState({userBlockchainResultOfParticularUser:this.props.location.userBlockchainResultOfParticularUser});
        
     }
     async loadUserMap(){

     }
     async getName(){
       
     }


     makeid=(length)=>{
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }

     check=()=>{
      // console.log(this.state.fullName);
      // console.log(this.state.userEmailId)
      // console.log(this.state.userJsonResultOfParticularUserFromIPFS);
      // console.log(this.state.totalUser);
      // console.log(this.state.userBlockchainResultOfParticularUser);
      // //console.log(this.state.totalUserName);
      // console.log(this.state.hasError);
      console.log(this.state.totalUser);
      for(var j=0;j<this.state.totalUser.length;j++){
        // console.log(this.state.totalUser[j].userEmailId);
        // console.log(this.state.totalUser[j].userHash);
        this.state.userMap.set(this.state.totalUser[j].userEmailId,this.state.totalUser[j].userHash);
        this.state.userPublicKeyMap.set(this.state.totalUser[j].userEmailId,this.state.totalUser[j].publickey);
      }
      console.log(this.state.userMap);
      console.log(this.state.userPublicKeyMap);
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
     
       this.props.history.push({
        pathname: '/MainPage2',
        userEmailId:this.state.userEmailId,
        fullName:this.state.fullName,
        userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
        totalUser:this.state.totalUser,
        userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
          // your data array of objects
      })
     }
     signOut=()=>{
      this.props.history.push({
        pathname: '/login',
         // your data array of objects
      })
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

        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        var arrayData=this.state.userJsonResultOfParticularUserFromIPFS.friend;
        for(var i=0;i<arrayData.length;i++){
         console.log(arrayData[i]);
        }
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
            for(var i=0;i<groupData.requestNotAccepted.length;i++){
                console.log(groupData.requestNotAccepted[i]);
                this.state.requestedFriendName.push(groupData.requestNotAccepted[i]);
            }


         this.setState({ groupInformationPassParameter:groupData})
         console.log(this.state.groupInformationPassParameter);
        })
       }


        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

 
    //   updateSearch=(event)=>{
    //  //  console.log(event.target.value);
    //    this.setState({search:event.target.value.substr(0,20)})      
    //   }
    //   addFriend=(dataParse)=>{
        
    //     //console.log(this.state.userHash);
    //     var userHash;
    //     var userId;
      
    //     for(var i=0;i<this.state.totalUser.length;i++){
    //       if(this.state.totalUser[i].userEmailId==dataParse.emailId){
    //         console.log("Same");
    //         console.log(this.state.totalUser[i].userHash);
    //         userHash=this.state.totalUser[i].userHash;
    //         userId= this.state.totalUser[i].userId.toString();
    //         break;
    //       }
    //     }
    //     ipfs.get("/ipfs/"+userHash,(error,result)=>{        
    //       console.log("Information of friend to add which button clicked");
    //       console.log(dataParse);
    //       console.log(dataParse.emailId);
    //       var uint8array = new TextEncoder("utf-8").encode("¢");
    //       var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
    //       var userJsonResult = JSON.parse(UserStringResult);
    //       console.log("Friend to be add information");
    //       console.log(userJsonResult);
    //       var obj={
    //         userId:this.state.userBlockchainResultOfParticularUser.userId,
    //         name:this.state.fullName,
    //         emailId:this.state.userEmailId
    //       }
    //       userJsonResult.requestNotAccepted.push(obj);
    //       console.log(userJsonResult);
    //       var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
    //       // The json is change to string format 
    //       const userContent= {
    //         content:originalContentString
    //     }
    //     ipfs.add(userContent,(error,results)=>{
    //       console.log(results);
    //       var userInformationHash= results[0].hash;
    //       console.log(results[0].hash);  
    //       console.log(userId);          
    //          this.state.contract.methods.changeUserInformation(userId,userInformationHash).send({from: this.state.account}).then((r)=>{
    //             console.log(r);
    //         });
    //     });
    //      // userJsonResult.requestNotAccepted=obj

    //       });

       
        
    //     ipfs.get("/ipfs/"+this.state.userBlockchainResultOfParticularUser.userHash,(error,result)=>{   
    //       console.log("Current User Information");
    //       console.log(this.state.userEmailId);
    //       console.log(this.state.userBlockchainResultOfParticularUser.userHash);     
    //       var uint8array = new TextEncoder("utf-8").encode("¢");
    //       var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
    //       var userJsonResult = JSON.parse(UserStringResult);
    //       console.log("current fiend information");
    //       console.log(userJsonResult);
    //       var obj={
    //         userId:userId,
    //         name:dataParse.name,
    //         emailId:dataParse.emailId
    //       }
    //       userJsonResult.request.push(obj);
    //       console.log(userJsonResult);
    //       this.setState({userJsonResultOfParticularUserFromIPFS:userJsonResult})
    //       console.log(this.state.userJsonResultOfParticularUserFromIPFS);
    //       var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
    //       // The json is change to string format 
    //       const userContent= {
    //         content:originalContentString
    //     }
    //     ipfs.add(userContent,(error,results)=>{
    //       console.log(results);
    //       var userInformationHash= results[0].hash;
    //       console.log(results[0].hash);  
    //       console.log(this.state.userBlockchainResultOfParticularUser.userId); 
    //       var id= this.state.userBlockchainResultOfParticularUser.userId;
    //          this.state.contract.methods.changeUserInformation(id,userInformationHash).send({from: this.state.account}).then((r)=>{
    //             console.log(r);
    //         });
    //       });
    //     });


    //   }
     
      acceptFriendRequest=(dataParse)=>{
        this.setState({ friendName:dataParse.name});
        var check_1=0;
        var check_2=0;
        var check_3=0;
        var check_4=0;
        console.log(dataParse);
        var userHash;
        var dataParseUserBlockchainData;
       // var groupKey1=this.makeid(10);
        //var groupKey2=this.makeid(10);
        for(var i=0;i<this.state.totalUser.length;i++){
          if(dataParse.emailId==this.state.totalUser[i].userEmailId){
              console.log("same");
              console.log(this.state.totalUser[i].userHash);
              userHash=this.state.totalUser[i].userHash;
              dataParseUserBlockchainData=this.state.totalUser[i];
              break;
          }
      }
      console.log(userHash);
      console.log(dataParseUserBlockchainData);

        var groupHash;
        var dataParseGroupData;
        var dataArray = [];
        for(var j=0;j<this.state.groupInformationListFromBlockChain.length;j++){
              if(this.state.groupInformationListFromBlockChain[j].groupEmailId==dataParse.emailId){
                  //console.log(this.state.groupInformationListFromBlockChain[j]);
                  dataArray.push(this.state.groupInformationListFromBlockChain[j]);
                  console.log("same");
                  
              }
        }

        let myMap = new Map();
        var max=-1;
        for(var i=0;i<dataArray.length;i++){
          
         var value=dataArray[i].groupVersion;
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
        dataParseGroupData=lastestGroupDetailHash;
        groupHash=lastestGroupDetailHash.groupHash;
        console.log(groupHash);
        console.log(dataParseGroupData);
        console.log(dataParseGroupData.groupId.toString());
        ipfs.get("/ipfs/"+groupHash,(error,result)=>{        
          console.log("Information of friend to add");
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var oldUserJsonResult=JSON.parse(UserStringResult);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("Friend to be add information");
          var friendsArray=userJsonResult.friend;
          console.log(friendsArray);
          console.log(userJsonResult.request);
          var obj=[];
          var friendToBeAddedTempArray;
          for(var i=0;i<userJsonResult.request.length;i++){
            console.log(userJsonResult.request[i]);
            if(this.state.fullName==userJsonResult.request[i].name){
              friendToBeAddedTempArray=userJsonResult.request[i];
            }
            else{
              obj.push(userJsonResult.request[i]);
            }
          }
          console.log(obj);
          //Updating the request arry
          userJsonResult.request=obj;

          console.log(userJsonResult);
          console.log(friendToBeAddedTempArray);
          var friendInformation={
            name:friendToBeAddedTempArray.name,
            emailId:friendToBeAddedTempArray.emailId,
            profilePicHash:friendToBeAddedTempArray.profilePicHash,
            userId:friendToBeAddedTempArray.userId
          }
          userJsonResult.friend.push(friendInformation);
         
          //Updating the friend ( adding the friend in friend list )
          console.log(userJsonResult);
          console.log(dataParseUserBlockchainData.publickey);
          var encryptedGroupkey= CryptoJS.AES.encrypt(userJsonResult.commonGroupKey, dataParseUserBlockchainData.publickey).toString();
          console.log(encryptedGroupkey);
          var singleUserData={}
            //    // name:this.state.fullName,
            //     emailId:this.state.userEmailId,
            //     encryptedGroupkey:encryptedGroupkey,
            //     userHash:this.state.userBlockchainResultOfParticularUser.userHash
            //   }
          var groupDetailsObject={
            name:friendToBeAddedTempArray.name,
            emailId:friendToBeAddedTempArray.emailId,
            encryptedGroupkey:encryptedGroupkey,
            userHash:dataParseUserBlockchainData.userHash
          }
          console.log(groupDetailsObject)
          userJsonResult.groupDetails.push(groupDetailsObject);
          console.log(userJsonResult);
          //****************
          //Now userJson is updated
       // updating the group information 

        //  var groupVersion = userJsonResult.groupVersion;
        // groupVersion++;
        //  userJsonResult.groupVersion=groupVersion;
       //  userJsonResult.currentGroupKey=groupKey1; 

         // No User right now 
        //  console.log(friendsArray.length);
        //  console.log(friendsArray);
        //   for(var i=0;i<userJsonResult.friend.length;i++){
        //     console.log("collect the friends");
        //   }
        //   console.log(userJsonResult);

          var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
      
      
      
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
          ipfs.add(userContent,(error,results)=>{
            console.log(results);
            var userInformationHash= results[0].hash;
            console.log(results[0].hash);  
            console.log(dataParse.userId);    
            check_1=1;  
            this.checkValue(check_1,check_2,check_3,check_4);    
               this.state.contract.methods.changeGroupInformation(dataParseGroupData.groupId.toString(),userInformationHash).send({from: this.state.account}).then((r)=>{
                 check_1=1;
                 this.checkValue(check_1,check_2,check_3,check_4);
                  console.log(r);
              });
          });
          // var dataArray = [];
          // for(var j=0;j<this.state.groupInformationListFromBlockChain.length;j++){
          //       if(this.state.groupInformationListFromBlockChain[j].groupEmailId==dataParse.emailId){
          //           //console.log(this.state.groupInformationListFromBlockChain[j]);
          //           dataArray.push(this.state.groupInformationListFromBlockChain[j]);
          //           console.log("same");
                    
          //       }
          // }

          // let myMap = new Map();
          // var max=-1;
          // for(var i=0;i<dataArray.length;i++){
            
          //  var value=dataArray[i].groupVersion;
          //  value=value.toString();
          //  myMap.set(value,dataArray[i]);
          //  console.log(value);
          //  if(value>max){
          //    max=value;
          //  }
          // }
          // console.log("lastest group version is");
          // console.log(max);
          // console.log(myMap.get(max));
          // var lastestGroupDetailHash= myMap.get(max);
          // console.log(lastestGroupDetailHash);

          // ipfs.get("/ipfs/"+lastestGroupDetailHash.groupHash,(error,result)=>{        
          //   console.log("Information user of group owner ");
          //   console.log(result);
          //   var uint8array = new TextEncoder("utf-8").encode("¢");
          //   var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          //   var groupInformation=JSON.parse(UserStringResult);
          //   console.log(groupInformation);
          //   var groupKey = groupInformation.commonGroupKey;
          //   console.log(groupKey);
            

          // });

        //   console.log(oldUserJsonResult);
        //   var currentGroupVersion=oldUserJsonResult.groupVersion;
        //   currentGroupVersion++;
        //   var groupKeyVersion = oldUserJsonResult.groupKeyVersion;
        //   groupKeyVersion++;
        //   var groupKeyVersion2=parseInt(groupKeyVersion)
        //   console.log("get the public key of the friends");
        //   console.log("get the public key of the person who will added to the group");
          
        //   // No use right now 
        //   // var dataParsePublicKey= dataParseUserBlockchainData.userPublicKey;
        //   // console.log(dataParsePublicKey);
        //   var encryptedGroupkey= CryptoJS.AES.encrypt(groupKey1, this.state.userBlockchainResultOfParticularUser.userPublicKey).toString();
        //   var resultSet=[];
        //   var singleUserData={
        //    // name:this.state.fullName,
        //     emailId:this.state.userEmailId,
        //     encryptedGroupkey:encryptedGroupkey,
        //     userHash:this.state.userBlockchainResultOfParticularUser.userHash
        //   }
        //   resultSet.push(singleUserData);


        //   for(var j=0;j<oldUserJsonResult.friend.length;j++){
        //     // console.log(oldUserJsonResult.friend[j].emailId)
        //    // console.log(this.state.userMap.get(oldUserJsonResult.friend[j].emailId));
        //     //console.log(this.state.userPublicKeyMap.get(oldUserJsonResult.friend[j].emailId))
  
  
        //     var localUserHash=this.state.userMap.get(oldUserJsonResult.friend[j].emailId);
        //     var localPublicKey=this.state.userPublicKeyMap.get(oldUserJsonResult.friend[j].emailId);
        //     var localEncryptedGroupkey= CryptoJS.AES.encrypt(groupKey1, localPublicKey).toString();
        //     var localSingleUserData={
        //       emailId:oldUserJsonResult.friend[j].emailId,
        //       encryptedGroupkey:localEncryptedGroupkey,
        //       userHash:localUserHash
        //     }
        //     resultSet.push(localSingleUserData);
        //     //myMap.get(keyString) 
        //    }


        //   console.log(resultSet);
        //   // for(var j=0;j<oldUserJsonResult.friend){

        //   // }

        //   var mainObject={
        //     commonGroupKey:groupKey1,
        //     groupOwnerName:dataParse.name,
        //     groupDetails:resultSet,
        //     groupVersion:currentGroupVersion
        //   }

        //   var originalContentString = Buffer.from(JSON.stringify(mainObject));
        //   // The json is change to string format 
        //   const userContent2= {
        //     content:originalContentString
        // }
        // ipfs.add(userContent2,(error,results)=>{
        //   console.log(results);
        //   var userInformationHash2= results[0].hash;
        //   console.log(results[0].hash);  
        //   console.log(dataParse.userId);   
        //   check_2=1;  
        //   this.checkValue(check_1,check_2,check_3,check_4);       
        //      this.state.contract.methods.createGroup(dataParse.emailId,userInformationHash2,currentGroupVersion).send({from: this.state.account}).then((r)=>{
        //        check_2=1;
        //        this.checkValue(check_1,check_2,check_3,check_4);
        //         console.log(r);
        //     });
        // });



          });

          
          ipfs.get("/ipfs/"+this.state.currentUserGroupHash,(error,result)=>{        
            console.log("Information user of group owner ");
            
            var uint8array = new TextEncoder("utf-8").encode("¢");
            var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
            var oldUserJsonResult=JSON.parse(UserStringResult);
            var userJsonResult = JSON.parse(UserStringResult);
            console.log("Friend to be add information");
            console.log(userJsonResult);
            console.log(userJsonResult.requestNotAccepted);
            var obj=[];
            var friendToBeAddedTempArray;
            for(var i=0;i<userJsonResult.requestNotAccepted.length;i++){
              console.log(userJsonResult.requestNotAccepted[i]);
              if(dataParse.name==userJsonResult.requestNotAccepted[i].name){
                friendToBeAddedTempArray=userJsonResult.requestNotAccepted[i];
              }
              else{
                obj.push(userJsonResult.requestNotAccepted[i]);
              }
            }
            console.log(obj);
            console.log(friendToBeAddedTempArray);
            userJsonResult.requestNotAccepted=obj;
            console.log(userJsonResult);
           // userJsonResult.requestNotAccepted=obj
           console.log(userJsonResult);
           var friendInformation={
             name:dataParse.name,
             emailId:dataParse.emailId,
             userId:dataParse.userId,
             profilePicHash:friendToBeAddedTempArray.profilePicHash
           }

           userJsonResult.friend.push(friendInformation);
           console.log( dataParseUserBlockchainData.publickey);
           console.log(userJsonResult.commonGroupKey);
          // var encryptedGroupkey= CryptoJS.AES.encrypt(userJsonResult.commonGroupKey,this.state.userBlockchainResultOfParticularUser.publickey).toString();
           var encryptedGroupkey= CryptoJS.AES.encrypt(userJsonResult.commonGroupKey, dataParseUserBlockchainData.publickey).toString();
           //console.log(encryptedGroupkey);
           //Updating the friend ( adding the friend in friend list )
           var bytes  = CryptoJS.AES.decrypt(encryptedGroupkey, dataParseUserBlockchainData.publickey);
          var originalText = bytes.toString(CryptoJS.enc.Utf8);
          console.log(originalText);
           console.log(userJsonResult);
           console.log(this.state.currentGroupKeyInformation);

           var groupDetailsObject={
            name:friendToBeAddedTempArray.name,
            emailId:friendToBeAddedTempArray.emailId,
            encryptedGroupkey:encryptedGroupkey,
            userHash:dataParseUserBlockchainData.userHash
          }
           console.log(groupDetailsObject)
           userJsonResult.groupDetails.push(groupDetailsObject);
           console.log(userJsonResult);

           //****************
           //Now userJson is updated
        // updating the group information 

        //  var groupVersion = userJsonResult.groupVersion;
        //   groupVersion++;
        //  userJsonResult.groupVersion=groupVersion;
        //  userJsonResult.currentGroupKey=groupKey2; 
         //this.setState({userJsonResultOfParticularUserFromIPFS:userJsonResult})
         var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
         // The json is change to string format 
         const userContent3= {
           content:originalContentString
       }
       this.setState({SuccessMessage:true})
         ipfs.add(userContent3,(error,results)=>{

           console.log(results);
           var userInformationHash= results[0].hash;
           console.log(results[0].hash);  
           console.log(dataParse.userId);
           this.state.userBlockchainResultOfParticularUser.userHash=results[0].hash;
           check_3=1; 
           this.checkValue(check_1,check_2,check_3,check_4);      
              this.state.contract.methods.changeGroupInformation(this.state.currentGroupKeyInformation.groupId.toString(),userInformationHash).send({from: this.state.account}).then((r)=>{
              
                this.checkValue(check_1,check_2,check_3,check_4);
                 console.log(r);
             });
         });
        });

/*
//////


         console.log(oldUserJsonResult);
         var groupKeyVersion = oldUserJsonResult.groupVersion;
         groupKeyVersion++;
         var currentGroupKeyVersion=oldUserJsonResult.groupVersion;

         var groupKeyVersion=parseInt(groupKeyVersion)
         console.log("get the public key of the friends");
         console.log("get the public key of the person who will added to the group");
         
         var dataParsePublicKey= dataParseUserBlockchainData.publickey;
         console.log(dataParseUserBlockchainData);
         console.log(dataParsePublicKey);
        // chqnge it 
         var encryptedGroupkey= CryptoJS.AES.encrypt(groupKey2, dataParsePublicKey).toString();
         var resultSet=[];
        
         var singleUserData={
          //  name:dataParse.name,
           emailId:dataParse.emailId,
           encryptedGroupkey:encryptedGroupkey,
           userHash:dataParseUserBlockchainData.userHash
         }
         resultSet.push(singleUserData);
         for(var j=0;j<oldUserJsonResult.friend.length;j++){
          // console.log(oldUserJsonResult.friend[j].emailId)
          console.log(this.state.userMap.get(oldUserJsonResult.friend[j].emailId));
          console.log(this.state.userPublicKeyMap.get(oldUserJsonResult.friend[j].emailId))


          var localUserHash=this.state.userMap.get(oldUserJsonResult.friend[j].emailId);
          var localPublicKey=this.state.userPublicKeyMap.get(oldUserJsonResult.friend[j].emailId);
          var localEncryptedGroupkey= CryptoJS.AES.encrypt(groupKey2, localPublicKey).toString();
          var localSingleUserData={
            emailId:oldUserJsonResult.friend[j].emailId,
            encryptedGroupkey:localEncryptedGroupkey,
            userHash:localUserHash
          }
          resultSet.push(localSingleUserData);
          //myMap.get(keyString) 
         }

         
         console.log(resultSet);
        // console.log(this.state.fullName);
         //console.log(this.state.userBlockchainResultOfParticularUser.fullName);
         var mainObject={
           commonGroupKey:groupKey2,
           groupOwnerName:this.state.fullName,
           groupDetails:resultSet,
           groupVersion:groupKeyVersion
         }
         console.log(mainObject);

         var originalContentString = Buffer.from(JSON.stringify(mainObject));
         // The json is change to string format 
         const userContent2= {
           content:originalContentString
       }
       ipfs.add(userContent2,(error,results)=>{
         console.log(results);
         var userInformationHash2= results[0].hash;
         console.log(results[0].hash);  
         console.log(dataParse.userId);         
         console.log(this.state.userEmailId) ;
         console.log(groupKeyVersion);
         console.log(currentGroupKeyVersion);
         currentGroupKeyVersion++;
         console.log(currentGroupKeyVersion);
         check_4=1;
         this.checkValue(check_1,check_2,check_3,check_4);
            this.state.contract.methods.createGroup(this.state.userEmailId,userInformationHash2,groupKeyVersion).send({from: this.state.account}).then((r)=>{
               console.log(r);
              
               this.checkValue(check_1,check_2,check_3,check_4);
           });
       });

    });
    */
  }

      pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
       }


       checkValue=(check_1, check_2,check_3,check_4)=>{
         if(check_1==1 && check_2==1 && check_3==1 && check_4==1){
            console.log("**************************");
            console.log("in if");
            
          console.log(this.state.userJsonResultOfParticularUserFromIPFS);
          console.log(this.state.userBlockchainResultOfParticularUser);
          
          // this.props.history.push({
          //   pathname: '/MainPage',
          //   userEmailId:this.state.userEmailId,
          //   fullName:this.state.fullName,
          //   userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
          //   totalUser:this.state.totalUser,
          //   userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
          //     // your data array of objects
          // })

            // this.props.history.push({
            //   pathname: '/MainPage',
            //   userEmailId: this.state.userEmailId,
            //   fullName:  this.state. fullName,
            //   userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
            //   totalUser:this.state.totalUser,
            //   userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
            // })
         }
         else{
          console.log("**************************");
            console.log("in else");
         }
       }

       
       render(){
    
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
      
      var postSignature ={
        fontFamily: "Great Vibes",
        fontSize: "36px",
        color: "#BF2847",
        
    }
        // let list = this.state.requestedFriendName.map(people => 
        //   <Card    style={cardBorder} >
        //  <Card.Title style={{color: "#639407", fontWeight: "1200"  }} >{people.name}</Card.Title>
        //   <Card.Body>
        //     <Card.Link   style={{color:"#2c9fbf", fontWeight: "bold",cursor: "pointer"  }}  onClick={() => this.acceptFriendRequest(people)}>Accept</Card.Link>
        //     <Card.Link   style={{color:"red", fontWeight: "bold",cursor: "pointer"  }} >Reject</Card.Link>
        //   </Card.Body>
        // </Card>
        // );

        let list = this.state.requestedFriendName.map(people => 
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
             <h2 style={ReactHeading}>Search Friends</h2>
             <hr></hr> 
              { list }
          {/* {list2} */}
                </div>



              {/* <Modal show={this.state.SuccessMessage} onHide={this.mainPage} >
        <Modal.Header closeButton>
          <Modal.Title>Friend Add Successfully </Modal.Title>
        </Modal.Header>
        <Modal.Body>You and {this.state.friendName} are friends now!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.mainPage}>
            Close
          </Button>
          <Button variant="primary" onClick={this.mainPage}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}

      <Modal show={this.state.SuccessMessage} onHide={this.mainPage}  size="lg">
                  <Modal.Header closeButton>
                    <Modal.Title style={{color:"#205663", paddingLeft:"310px"}}>Success</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>    
                  <div style={card2} expand="false">
                            <div style={info}>
                                <img style={photo} src={this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash} ></img>
                              <div style={name}><h4>{this.state.fullName}</h4></div>
                              <div style={{textAlign:"center", marginTop:"280px"}} >
                              <div style={name}><h4>You and {this.state.friendName} are friends!</h4>
                             </div>
                            </div>
                          </div>
                    </div>  
                
                    <hr></hr>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button onClick={this.mainPage}>Done</Button>
                </Modal.Footer>
              </Modal>
          </div>
               );
              }
            }


export default checkRequest2 ;