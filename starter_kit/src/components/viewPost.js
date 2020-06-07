import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Button,Navbar,Nav,ListGroup,Modal,Card } from "react-bootstrap";
import { MDBInput } from 'mdbreact';
import './file2.scss'; 


import { Player } from 'video-react';

var ipfsClient = require('ipfs-http-client');
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;
var CryptoJS = require("crypto-js");


class viewViewer extends Component{ 
    
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

      render(){
        return(
            <div>
                Hello World from view viewr 
                    <link rel="stylesheet" href="/css/video-react.css" />
                    <link
  rel="stylesheet"
  href="https://video-react.github.io/assets/video-react.css"
/>
                    <Player
                        playsInline
                        poster="/assets/poster.png"
                        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                        />
            </div>
        );
      }
}
export default viewViewer;