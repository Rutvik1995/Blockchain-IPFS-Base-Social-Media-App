import React, { Component,useState } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form,InputGroup, Button,Nav,Navbar,Card} from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron'
import ReactSearchBox from 'react-search-box'
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;


class searchFriends2 extends Component{

    constructor(props){
        super(props);
         
        this.state={
          account:'',
          buffer:null,
          contract:null,
          search:'',
          totalUserName:[],
          userEmailId:'',
          fullName:'',
          userJsonResultOfParticularUserFromIPFS:null,
          totalUser:null,
          profilePicHash:'',
          userNameList:null,
          userBlockchainResultOfParticularUser:null,
          hasError: false,
          groupInformationListFromBlockChain:[],
          currentUserGroupDataHash:'',
          currentUserGroupData:null
        };       
      }




      async componentWillMount(){
        //this.pausecomp(8500);
        //this.pausecomp(4500);
        await this.loadData();
        //await this.check();
        await this.getName();
        await this.loadNameList();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }
      async loadNameList(){
        console.log(this.state.totalUserName);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
      }
      async loadData(){
       
        this.setState({fullName:this.props.location.fullName});
        this.setState({userEmailId:this.props.location.userEmailId});
        this.setState({userJsonResultOfParticularUserFromIPFS:this.props.location.userJsonResultOfParticularUserFromIPFS});
        this.setState({userInformationListFromBlockChain:this.props.location.userInformationListFromBlockChain});
        this.setState({totalUser:this.props.location.totalUser});
        this.setState({userBlockchainResultOfParticularUser:this.props.location.userBlockchainResultOfParticularUser});
       
     }
     check=()=>{
      console.log(this.state.fullName);
      console.log(this.state.userEmailId)
      console.log(this.state.userJsonResultOfParticularUserFromIPFS);
      console.log(this.state.totalUser);
      console.log(this.state.userBlockchainResultOfParticularUser);
      console.log(this.state.totalUserName);
      console.log(this.state.hasError);
      //console.log(this.state.)
     }
     async getName(){
       for(var i=0;i<this.state.totalUser.length;i++){
        console.log(this.state.totalUser[i].userHash)
        var userHash =this.state.totalUser[i].userHash;
        ipfs.get("/ipfs/"+this.state.totalUser[i].userHash,(error,result)=>{        
           var uint8array = new TextEncoder("utf-8").encode("¢");
           var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
           var userJsonResult = JSON.parse(UserStringResult);
           console.log(userJsonResult);
           var obj={
             name: userJsonResult.fullName,
             emailId:userJsonResult.emailId,
             profilePicHash:userJsonResult.profilePicHash
           }
           this.state.totalUserName.push(obj);
           });
       }
       console.log(this.state.totalUserName);   
     }

     

     mainPage=()=>{
      console.log(this.state.userJsonResultOfParticularUserFromIPFS);
      console.log(this.state.userBlockchainResultOfParticularUser);

      this.props.history.push({
        pathname: '/MainPage',
        userEmailId: this.state.userEmailId,
        fullName:  this.state. fullName,
        userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
        totalUser:this.state.totalUser,
        userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
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
        // var userObj={
        //     groupEmailId:"rpatel@csus.edu",
        //     groupHash: "QmaJzhmLoMhWpTMwbYnhbeuoec4Yyp8uTN449Mwm4qP48i",
        //     groupId: 2,
        //     groupVersion:2, 

        // }
        // this.state.groupInformationListFromBlockChain.push(userObj);
        console.log(this.state.groupInformationListFromBlockChain);
        var arrayArray=[]
        for(var i=0;i<this.state.groupInformationListFromBlockChain.length;i++){
                if(this.state.groupInformationListFromBlockChain[i].groupEmailId==this.state.userEmailId){
                    console.log(this.state.groupInformationListFromBlockChain[i]);
                    arrayArray.push(this.state.groupInformationListFromBlockChain[i]);
                    
                   
                }
        }
        
        let myMap = new Map();
        var max=-1;
        for(var i=0;i<arrayArray.length;i++){
          
         var value=arrayArray[i].groupVersion;
         value=value.toString();
         myMap.set(value,arrayArray[i]);
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

       this.setState({currentUserGroupDataHash:lastestGroupDetailHash.groupHash});
        this.setState({currentUserGroupData:lastestGroupDetailHash});
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

      signOut=()=>{
        this.props.history.push({
          pathname: '/login',
           // your data array of objects
        })
       }
      updateSearch=(event)=>{
     //  console.log(event.target.value);
       this.setState({search:event.target.value.substr(0,20)})      
      }
      addFriend=(dataParse)=>{
        console.log(dataParse);
        //console.log(this.state.userHash);
        var userHash;
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash)
        console.log(this.state.userJsonResultOfParticularUserFromIPFS.fullName);
        var profilePic=this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash;
        var userId;
        // for(var i=0;i<this.state.totalUser.length;i++){
        //   if(this.state.totalUser[i].userEmailId==dataParse.emailId){
        //     console.log("Same");
        //     console.log(this.state.totalUser[i].userHash);
        //     userHash=this.state.totalUser[i].userHash;
        //     userId= this.state.totalUser[i].userId.toString();
        //     break;
        //   }
        // }
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
        userId=lastestGroupDetailHash.groupId.toString();


        ipfs.get("/ipfs/"+lastestGroupDetailHash.groupHash,(error,result)=>{        
          console.log("Information of friend to add");
          console.log(dataParse);
          console.log(dataParse.emailId);
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("Friend to be add information");
          console.log(userJsonResult);

          var obj={
            userId:this.state.currentUserGroupData.groupId.toString(),
            name:this.state.fullName,
            emailId:this.state.userEmailId,
            profilePicHash:profilePic
          }
          userJsonResult.requestNotAccepted.push(obj);
          console.log(userJsonResult);
          var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
        ipfs.add(userContent,(error,results)=>{
          console.log(results);
          var userInformationHash= results[0].hash;
          console.log(results[0].hash);  
          console.log(userId);          
             this.state.contract.methods.changeGroupInformation(userId,userInformationHash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });
        });
         // userJsonResult.requestNotAccepted=obj

          });

       
        
        ipfs.get("/ipfs/"+this.state.currentUserGroupDataHash,(error,result)=>{   
          console.log("Current User Information");
          console.log(this.state.userEmailId);
          console.log(this.state.userBlockchainResultOfParticularUser.userHash);     
          var uint8array = new TextEncoder("utf-8").encode("¢");
          var UserStringResult = new TextDecoder("utf-8").decode(result[0].content);
          var userJsonResult = JSON.parse(UserStringResult);
          console.log("current fiend information");
          console.log(userJsonResult);
          var obj={
            userId:userId,
            name:dataParse.name,
            emailId:dataParse.emailId,
            profilePicHash:dataParse.profilePicHash
          }
          userJsonResult.request.push(obj);
          console.log(userJsonResult);
        //  this.setState({userJsonResultOfParticularUserFromIPFS:userJsonResult})

          console.log(this.state.userJsonResultOfParticularUserFromIPFS);
          var originalContentString = Buffer.from(JSON.stringify(userJsonResult));
          // The json is change to string format 
          const userContent= {
            content:originalContentString
        }
        ipfs.add(userContent,(error,results)=>{
          console.log(results);
          var userInformationHash= results[0].hash;
          console.log(results[0].hash);  
          console.log(this.state.userBlockchainResultOfParticularUser.userId); 
          //this.state.userBlockchainResultOfParticularUser.userHash=results[0].hash;
          var id= this.state.currentUserGroupData.groupId;
             this.state.contract.methods.changeGroupInformation(id,userInformationHash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });
            
            
            
            
            
            console.log(this.state.userJsonResultOfParticularUserFromIPFS);
            console.log(this.state.userBlockchainResultOfParticularUser);
            this.props.history.push({
              pathname: '/MainPage',
              userEmailId:this.state.userEmailId,
              fullName:this.state.fullName,
              userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
              totalUser:this.state.totalUser,
              userBlockchainResultOfParticularUser:this.state.userBlockchainResultOfParticularUser
                // your data array of objects
            })


          });
        });


      }
     



      pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
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
       

        var userNameList= this.state.totalUserName.filter(
          (people)=>{
            return people.name.indexOf(this.state.search)!==-1
          }
        );
        let list = userNameList.map(people => 
          <Card     >
          {/* <Card.Header>Rutvik Patel</Card.Header> */}
         <Card.Title style={{color: "#639407", fontWeight: "1200"   }} >{people.name}</Card.Title>
          <Card.Body  >
            <Card.Link  style={{color: "#057396", fontWeight: "bold",cursor: "pointer"  }} onClick={() => this.addFriend(people)}>Add Friend</Card.Link>
            <Card.Link  style={{color: "#82360d", fontWeight: "bold",cursor: "pointer"  }}  >View Profile</Card.Link>
          </Card.Body>
        </Card>
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
            <Card.Link style={{padding:"10px"}} onClick={() => this.addFriend(people)}><Button variant="primary" size="sm" >Add Friend</Button></Card.Link>
            <Card.Link  ><Button variant="secondary" size="sm" >View Profile</Button></Card.Link>
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
          </div>
               );
              }
            }


export default searchFriends2;