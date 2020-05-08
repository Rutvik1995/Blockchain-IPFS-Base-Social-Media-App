import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form, Button, Container,Row,Col,FormGroup, FormControl, ControlLabel,Navbar,Card,ButtonToolbar,ListGroup,ListGroupItem } from "react-bootstrap";
import Jumbotron from 'react-bootstrap/Jumbotron'
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;

class addProfilePic  extends Component{
    constructor(props){
        super(props);
         
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userEmailId:'',
          fullName:'',
          userJsonResultOfParticularUserFromIPFS:null,
          totalUser:null,
          profilePicHash:'',
          userBlockchainResultOfParticularUser:null
        };       
      }
      async componentWillMount(){
        this.loadData();
        await this.loadWeb3()
        await this.loadBlockChainData();
      }
      loadData=()=>{
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
          console.log(contract);
          this.setState({contract:contract});
          console.log(contract.methods);
        //  const MemeHash =await contract.methods.get().call();
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }


      captureFile=(event)=>{
        event.preventDefault();
        var file = event.target.files[0];
        var reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = ()=>{
          this.setState({buffer:Buffer(reader.result)})
        }
    }
    saveChange=()=>{

      // this.state.contract.methods.addUser(this.state.userEmailId,userInformationHash,publicKey).send({from: this.state.account}).then((r)=>{
      //   console.log(r);
    // }); 
    }
    onSubmit=(event)=>{
      event.preventDefault();
      console.log("in submit event");
      const file = {
         content: this.state.buffer
         //content:this.
      }
      var t;
      ipfs.add(file,(error,results)=>{
          //Do Stuff here
         console.log("IPFS RESULT",results[0].hash);
          var hash=results[0].hash;
          t=results[0].hash;
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
    
        })

      }
      uploadProfilePic=()=>{

        console.log(this.props.location.userBlockchainResultOfParticularUser);
        console.log(this.state.profilePicHash);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        var tempuserBlockchainResultOfParticularUser = this.state.userJsonResultOfParticularUserFromIPFS;
        tempuserBlockchainResultOfParticularUser.profilePicHash=this.state.profilePicHash;
        this.setState({userJsonResultOfParticularUserFromIPFS:tempuserBlockchainResultOfParticularUser});
        this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash=this.state.profilePicHash;
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.userBlockchainResultOfParticularUser.userId);
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
          this.setState({userJsonResultOfParticularUserFromIPFS:userInformationHash});
        
          console.log(results[0].hash);
          this.setState({IPFSuserInformationHash:results[0].hash});   
         
          console.log(userId);          
             this.state.contract.methods.changeUserInformation(userId,userInformationHash).send({from: this.state.account}).then((r)=>{
                console.log(r);
            });  
            this.state.userBlockchainResultOfParticularUser.userHash=userInformationHash;
          
        });


         // this.state.contract.methods.addUser(this.state.userEmailId,userInformationHash,publicKey).send({from: this.state.account}).then((r)=>{
      //   console.log(r);
    // }); 
        // changeUserInformation
        // console.log(this.state.userBlockchainResultOfParticularUser);
        // var check =this.state.userJsonResultOfParticularUserFromIPFS[0];
        // console.log(check);
   
        // this.props.history.push({
        //   pathname: '/MainPage',
        //   userEmailId: this.state.userEmailId,
        //   fullName:  this.state. fullName,
        //   userJsonResultOfParticularUserFromIPFS:this.state.userJsonResultOfParticularUserFromIPFS,
        //   TotalUser:this.state.totalUser
        //     // your data array of objects
        // })
      } 

      checkValue=()=>{
        // console.log(this.props.location.TotalUser);
        // console.log(this.props.location.fullName);
        //console.log()
        console.log(this.state.fullName);
        console.log(this.state.userEmailId);
        console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        console.log(this.state.totalUser);
        console.log(this.state.userBlockchainResultOfParticularUser)
       // this.state.userJsonResultOfParticularUserFromIPFS.profilePicHash=this.state.profilePicHash;
        //console.log("After change");
        //console.log(this.state.userJsonResultOfParticularUserFromIPFS);
        //console.log(this.state.userBlockchainResultOfParticularUser);
      }
      onToMainMenu=()=>{
        this.pausecomp(2000);
        console.log("In Main Menu");
        console.log(this.state.userEmailId);
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
      }
      pausecomp=(millis)=>{
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); }
        while(curDate-date < millis);
       }


      render(){
        return(

            <div className="container text-center ">
            <Jumbotron>
                   <h1>Hello,{this.state.fullName} </h1>
                  <p></p>
                   <p>
                  {/* <Button variant="primary">Learn more</Button> */}
                  </p>
             </Jumbotron>
            <Navbar bg="light">
               <Navbar.Brand >
               <h1>Add Profile Pic</h1>
                 </Navbar.Brand>
             </Navbar>
                <div >
                <Card className="text-center">
                    <Card.Img variant="top"  src= {`https://ipfs.infura.io/ipfs/${this.state.profilePicHash}`}     style={{height: "100%",  width:"300px" }} />
                    <Card.Body>
                    <Card style={{ width: '18rem' }}>
                          <Card.Img variant="top" src="holder.js/100px180" />
                          <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                              Some quick example text to build on the card title and make up the bulk of
                              the card's content.
                            </Card.Text>
                            <form  onSubmit={this.onSubmit}>
                                <input type="file"  onChange={this.captureFile}/>
                                   <input type="submit"  value="upload" /> 
                                 <br>
                                 </br>
                                  <br>
                                  </br>
                                  <br></br>
                               </form>
                               {/* <Card.Link href="" onClick={this.uploadProfilePic}>Save Changes </Card.Link>
                              <Card.Link  href=""  onClick={this.onToMainMenu}>Main Menu</Card.Link> */}
                            <Button variant="primary" onClick={this.uploadProfilePic}>Save Changes</Button>
                            <Button variant="primary" onClick={this.checkValue}>uploadProfilePic</Button>
                            <Button variant="primary" onClick={this.onToMainMenu}>Main Menu</Button>
                          </Card.Body>
                    </Card>
                    </Card.Body>
                  </Card>
                </div>
             
                  <br />
                  <Card>
                    {/* <Card.Body>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the bulk
                        of the card's content.
                      </Card.Text>
                    </Card.Body>
                    <Card.Img variant="bottom" src="holder.js/100px180" /> */}
                    
                  </Card>
                </div>
                      );
                    }
                }
                
export default addProfilePic;