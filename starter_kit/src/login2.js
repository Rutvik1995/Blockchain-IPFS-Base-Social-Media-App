import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Card,Form } from "react-bootstrap";


//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

//Crypto
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");




class login2  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          userInformationListFromBlockChain:'',
          userInformationFromIPFS:''
        };       
      }


      async componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockChainData();
      }

  
      async loadWeb3(){
        if(window.ethereum){
          window.web3 =new Web3(window.ethereum);
          await window.ethereum.enable();
        }
        if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider);
        }
        else{
          window.alert("Please use metamask");
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

        var tt= await this.state.contract.methods.userCount().call();
          var userCount=await tt;
          for(var i=1;i<=userCount;i++){
            const userInformationListFromBlockChain= await this.state.contract.methods.userInformation(i).call();
            console.log(userInformationListFromBlockChain)
            this.setState({
              userInformationListFromBlockChain:[...this.state.userInformationListFromBlockChain, userInformationListFromBlockChain]
            })

            //console.log(this.state.userInformationListFromBlockChain)
            ipfs.get("/ipfs/"+userInformationListFromBlockChain.userHash,(error,result)=>{

               // console.log(result[0]);
                 var userJsonResult = JSON.parse(result[0].content);
                 //console.log(userJsonResult);
                 this.setState({
                    userInformationFromIPFS:[...this.state.userInformationFromIPFS, userJsonResult]
                  })
            });

          }

        

        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

      login=()=>{
         
        var userEmailID=document.getElementById("email").value;
        var password=document.getElementById("password").value;
        var encryptedPassword = CryptoJS.SHA256(password).toString();
        console.log(encryptedPassword);
        var loginCheck=0;
        for(var i=0;i<this.state.userInformationFromIPFS.length;i++){
         
            if(this.state.userInformationFromIPFS[i].emailId==userEmailID){
                console.log("in if");
                if(encryptedPassword==this.state.userInformationFromIPFS[i].encryptedPassword){
                    console.log("done "); 
                    loginCheck=1;  
                   
                    this.props.history.push({
                        pathname: '/mainPage3/'+this.state.userInformationFromIPFS[i].userId,
                        userId:this.state.userInformationFromIPFS[i].userId,
                        fullName: this.state.userInformationFromIPFS[i].fullName,
                        userEmailId:this.state.userInformationFromIPFS[i].emailId,
                        profilePicHash:this.state.userInformationFromIPFS[i].profilePicHash
                      })
                }
            }
        }


      }

      mainPage=()=>{
        this.props.history.push({
          pathname: '/mainPage/',
          data: this.state.currentEmailId,
          name: this.props.location.name   // your data array of objects
        })
      }

      CreateAccountPage=()=>{
         this.props.history.push({
           pathname: '/register2',})
       }

      render(){
        return(
            <div>
                <div className="container">
                <div className="row pt-5">
                <div className="col-12 ">
                <h1 className="site-logo text-center ">Welcome</h1>
                <hr></hr>
                <Card>
                    <Card.Header as="h5">Login</Card.Header>
                    <Card.Body>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email"  id="email"  placeholder="Enter email" />   
                        <Form.Group controlId="formBasicPassword">
                            <br></br>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" id="password" placeholder="Password" />
                        </Form.Group>                               
                        <div className="row">
                            <div className="col-sm-2">
                            <Button variant="outline-primary"  onClick={this.login}>Log In</Button>
                            </div>
                            <div className="col-sm-10">
                            <Button variant="outline-secondary" onClick={this.CreateAccountPage}>Create Account</Button>
                            </div>
                        </div>    

                    </Card.Body>
                </Card>
               
                </div>
               </div>
                </div>
            </div>
        );
    }
}

export default login2;