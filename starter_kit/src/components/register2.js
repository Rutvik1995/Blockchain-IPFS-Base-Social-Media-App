import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card,Form } from "react-bootstrap";
import './file.css'; 
import './register2.css';

//Crypto
import { v4 as uuidv4 } from 'uuid';
import { Crypt, RSA } from 'hybrid-crypto-js';
const uuid = require('uuid')
var rsa = new RSA();
var CryptoJS = require("crypto-js");
var SHA256 = require("crypto-js/sha256");
var AES = require("crypto-js/aes");
var crypt = new Crypt();

//IPFS
var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' })

//AWS
var AWS = require('aws-sdk');
var S3 = require('aws-sdk/clients/s3');
var AWS = require('aws-sdk/global'),
region = "us-east-1",
    secretName = "MyDemoSecret",
    secret,
    decodedBinarySecret

    var client = new AWS.SecretsManager({
        region: region,
        accessKeyId: "",
        secretAccessKey:""
    });

    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:12eb4e63-5056-410a-ae71-49da572063dc',
    });


class register2  extends Component{

      
    constructor(props){
        super(props);
        console.log(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
        };       
      }


      async componentWillMount(){
        await this.loadWeb3()
        await this.loadBlockChainData();
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
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }


      register = () => {

        // Geting the user data from textbox
          var firstName=document.getElementById("firstName").value;
          var lastName =document.getElementById("lastName").value;
          var emailId = document.getElementById("emailId").value;
          var password = document.getElementById("password").value;
          var fullName=firstName+" "+lastName;
          console.log(firstName);
          console.log(lastName);
          console.log(emailId);
          console.log(password);
          var userId=uuidv4();
          
        // encrypting the password
        var encryptedPassword = CryptoJS.SHA256(password).toString();

        // saving user data in JSONobject  
          var userObj = {
            "userId":  userId,
            "firstName":firstName,
            "lastName":lastName,
            "fullName":fullName,
            "encryptedPassword":encryptedPassword,
            "emailId":emailId,
            profilePicHash:'https://previews.123rf.com/images/jemastock/jemastock1909/jemastock190907419/129419865-indian-young-boy-face-profile-picture-avatar-cartoon-character-portrait-in-black-and-white-vector-il.jpg',
          };
          var stringUserObj = Buffer.from(JSON.stringify(userObj));
          var publicKey;
          var privateKey
          //Saving private key to AWS
          rsa.generateKeyPairAsync().then(keyPair => {
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;
            console.log( publicKey);
            console.log(privateKey);

            this.groupInformation(userId,publicKey,fullName,privateKey);
            var params = {
                ClientRequestToken: "EXAMPLE1-90ab-cdef-fedc-ba987SECRET1", 
                Description: "Private key of user"+ userId, 
                Name: userId, 
               SecretString: privateKey
               };
               client.createSecret(params, function(err, data) {
                 if (err) console.log(err, err.stack); // an error occurred
                 else     console.log(data);           // successful response
               });   
                    //Saving user data to IPFS
                    //Creating the user directory
                    console.log("before creating the file");
                    ipfs.files.mkdir('/user/'+userId,(error,results)=>{
                        console.log("Folder created");
                        console.log(results);
                        ipfs.files.write('/user/'+userId+"/"+"userInformationTable",stringUserObj, { create: true },(error,results)=>{
                                console.log("inside");
                                console.log(results);
                                ipfs.files.stat('/user/'+userId+"/"+"/userInformationTable", (error,results)=>{
                                    console.log("inside");
                                console.log(results);
                                this.state.contract.methods.addUser(userId,results.hash,publicKey).send({from: this.state.account}).then((r)=>{
                                    console.log(r);
                                });  
                                })
                        })
                })
          });

            
      }


      groupInformation = (userId,publicKey,fullName) => {
        console.log("from group Information table");
        console.log(userId);
        var groupKey=this.generateHexString();
        console.log(groupKey);
      
      //  var encryptedGroupKey = CryptoJS.AES.encrypt("my message hello world", publicKey).toString();

      var encryptedGroupKey= crypt.encrypt(publicKey,groupKey );
        var groupId=uuidv4();

        var groupInformationArray=[]

        var groupUserObj={
            "groupId":groupId,
            "groupOwnerUserId":userId,
            "fullName":fullName,
            // "encryptedGroupKey": encryptedGroupKey,
            groupInformation:[],
            "groupKeyVersion":1,
            
        }
       
        var groupInformationObj={
          "groupKeyVersion":1,
          groupMembers:[]
        }
        groupUserObj.groupInformation.push(groupInformationObj);
       
        console.log(groupUserObj);

        var userGroupMemberInformation={
            "userId":userId,
            "fullName":fullName,
            "encryptedGroupKey": encryptedGroupKey,
        }
        groupUserObj.groupInformation[0].groupMembers.push(userGroupMemberInformation);
       // groupUserObj.groupMembers.push(userGroupMemberInformation);
        console.log(groupUserObj);


        console.log(groupInformationArray);
       
        var stringGroupObj = Buffer.from(JSON.stringify(groupUserObj));
        console.log(stringGroupObj);
        ipfs.files.write('/user/'+userId+"/"+"groupInformationTable",stringGroupObj, { create: true },(error,results)=>{
            console.log("inside");
            console.log(results);
              ipfs.files.stat('/user/'+userId+"/"+"/groupInformationTable", (error,results)=>{
                console.log("inside");
              console.log(results);
              this.state.contract.methods.createGroup(userId,results.hash).send({from: this.state.account}).then((r)=>{
                console.log(r);
                console.log("done");
            });

            })
   })
        
 
      }

      Login=()=>{
        this.props.history.push({
          pathname: '/login2',})
      }

      generateHexString=()=> {
        var ret = "";
        while (ret.length < 32) {
          ret += Math.random().toString(16).substring(2);
        }
        return ret.substring(0,32);
      }

      render(){
        return(
            <div>
                <div style={{textAlign:"center",padding:"30px"}}>
                    <h4 style={{
                        fontWeight:"bold",
                        fontSize:"30px",
                        color:"rgb(66, 103, 178)",
                        opacity:".9",
                         }}>Register</h4>
                 </div>
           
                <div className="container">
                    <div className="mystyle2">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>
                                     <span style={{fontSize:"15px"}}>First Name</span>
                                </Form.Label>
                                < Form.Control type="text" id="firstName"  placeholder="Enter First Name" />
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>
                                        <span style={{fontSize:"15px"}}>Last Name</span>
                                    </Form.Label>
                                    <Form.Control type="text" id="lastName" placeholder="Enter Last Name" />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>
                                    <span style={{fontSize:"15px"}}>Email address</span></Form.Label>
                                    <Form.Control type="email" id="emailId" placeholder="Enter email" />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                        <Form.Label>
                                        <span style={{fontSize:"15px"}}>Password</span></Form.Label>
                                        <Form.Control type="password" id="password" placeholder="Enter password" />
                                </Form.Group>
                            </Form.Group>
                            <Button variant="primary" type="button" id="RegisterUser" onClick={this.register}>Register</Button>
                             <br>
                             </br>
                            <Form.Text className="text-muted">
                                    If you are already register 
                            </Form.Text>
                            <Button variant="primary" type="button" onClick={this.Login}>Login</Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default register2;
