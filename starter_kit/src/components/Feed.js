import React, { Component } from 'react';
import Web3 from 'web3';
import Meme from '../abis/Meme.json';
import { Form, Button, FormGroup, FormControl, ControlLabel,Card,ButtonToolbar } from "react-bootstrap";

var ipfsClient = require('ipfs-http-client');
// var ipfs = ipfsClient({host:'infura.io',port:'5001',protocol: 'https' }) 
var ipfs = ipfsClient({host:'ipfs.infura.io',port:'5001',protocol: 'https' }) ;;

class Feed  extends Component{


    constructor(props){
        super(props);
        this.state={
          account:'',
          buffer:null,
          contract:null,
          memHash:'QmNZNHWxYqPY57bodafqkzqmXYVu9LE3FteJhMmZGBackw',
          userData:null,
          userInformationHash:'',
          userEmail:'',
          postCount:0,
          userCount:0,
          userEmailId:[],
          postContent:[]
        };
      }


    async componentWillMount(){

      // var tempName =this.props.location.name;
      // var tempEmailId =this.props.location.data;
      // this.setState({emailIdToSend:tempEmailId});
      // tempEmailId=tempEmailId[1];
      // this.setState({currentName:tempName});
      // this.setState({currentEmailId:tempEmailId});

        console.log("in component will mount");
        await this.loadWeb3()
        await this.loadBlockChainData();
      }



      async loadWeb3(){
        console.log("hello in load web3");
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
        console.log("load Blockchain load data");
        const web3_2 = window.web3;
        const accounts =  await web3_2.eth.getAccounts();
        console.log(accounts);
        this.setState({account:accounts[0]});
        console.log(this.state);
       
        const networkId = await web3_2.eth.net.getId();
        console.log(networkId);
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
            this.setState({userCount:userCount});
            console.log(userCount);
            this.setState({userCount:userCount});
            console.log("After Setting");
            for(var i=0;i<=userCount;i++){
                console.log(i);
                const userEmailId = await this.state.contract.methods.userInformation(i).call();
                console.log(userEmailId);
                this.setState({
                    userEmailId:[...this.state.userEmailId, userEmailId]
                })
            }

            var postCount= await this.state.contract.methods.postCount().call();
           var count=0;
            for(var i=0;i<=postCount;i++){
              console.log(i);
              const content = await this.state.contract.methods.postList(i).call();
              if(content.username==this.state.currentEmailId){
                // const validContent=content;
                count++;
                this.setState({
                  postContent:[...this.state.postContent, content]
                })
              }      
          }
          this.setState({postCount:count});
          console.log(this.state.postContent);
        }
        else{
          window.alert("Smart contract not deployed to detected the network");
        }
      }

 
    CreateAccountPage=()=>{
        console.log("list od users");
        console.log("list od users2");
        let path = `Login`;
        this.props.history.push(path);
       
      }
    
    render(){



      var lists=[];
      for(var i=0;i<this.state.postContent.length;i++){
        // var y = "https://ipfs.infura.io/ipfs/";
        // var trail =this.state.postContent[i][2];
        // var final = y.concat(trail);
        console.log(this.state.postContent[i]);
        lists[i]=this.state.postContent[i];
        console.log(lists[i][2]);

      }
      // for(var i=0;i<this.state.userInformation.length;i++){
      //   console.log(this.state.userInformation[i]);
      //   var first = this.state.userInformation[i].firstName;
      //   var mid=" ";
      //   var second = this.state.userInformation[i].lastName;
      //   var ans = first+mid+second;
      //   console.log(ans);
      //   myMap.set(this.state.userInformation[i].email,ans);
      // }


   
    //   let images = lists.map(image => {
    //     // return <img key={image} src={require(`${image}`)} alt="" className="img-responsive" />
    //     return ( <img src= {`https://ipfs.infura.io/ipfs/${image}`}   style={{height: "160px"}}   className="App-logo" alt="logo" />
    //     );
        
    //  });

     let images = lists.map(image => 
      <Card    style={{padding: "50px" }} >
      {/* <Card.Header>Rutvik Patel</Card.Header> */}
      <Card.Title>{this.state.currentName}</Card.Title>
      <Card.Img variant="top" src= {`https://ipfs.infura.io/ipfs/${image.hashValue}`}   style={{height: "100%",  width:"300px" }}   />
      {/* { image } */}
      <Card.Body>
        <Card.Text>
          {/* Some quick example text to build on the card title and make up the bulk
          of the card's content. */}
          {image.postText}
        </Card.Text>
      </Card.Body>
    </Card>
);





        return(
            <div className="container">
               {/* <div className="row pt-5">
                <div class="col-12 "> */}
                {/* <h1>Hello,{this.state.currentName} </h1> */}
                {/* <h1 class="site-logo text-center ">Timeline</h1>
                <br></br>
                <h1 class="site-logo text-center ">Welcome</h1>
                <hr></hr>
                </div>
               </div> */}
                  <Card    style={{padding: "50px" }} >
                  {/* <Card.Header>Rutvik Patel</Card.Header> */}
                  {/* <Card.Img variant="top" src= {`https://ipfs.infura.io/ipfs/${this.state.memHash}`}   style={{height: "100%",  width:"300px" }}   /> */}
                  { images }
                  <Card.Body>
                    <Card.Text>
                      {/* Some quick example text to build on the card title and make up the bulk
                      of the card's content. */}
                    
                    </Card.Text>
                  </Card.Body>
                </Card>
            </div>
        );
    }
}

export default Feed;