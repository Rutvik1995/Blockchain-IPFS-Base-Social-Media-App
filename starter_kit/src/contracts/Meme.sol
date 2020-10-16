pragma solidity 0.5.8;

contract Meme{
    //Smarty Contract code goes here
    string memeHash;

    mapping(address=>bool) public checkFunction;

  struct userHash{
        uint Id;
        string userId;
        string userHash;
        string publickey;
    }

    struct groupHash{
        uint groupId;
        string groupOwnerUserId;
        string groupHash;
    }
    struct postHash{
        uint postId;
        string postOwnerUserId;
        string postHash;
    }

struct friendRequestHash{
        uint friendRequestId;
        string fiendRequestHash;
    }



    //Write function
  
       mapping(uint=>userHash) public userInformation;
       mapping(uint=>groupHash) public groupInformation;
       mapping(uint=>postHash) public postInformation;
       mapping(uint=>friendRequestHash) public friendRequestInformation;


    // Adding informtion of userInformation table 
    function addUser(string memory _userId,string memory _userHash,string memory _publicKey) public {
        userCount++;
         userInformation[userCount]= userHash(userCount,_userId,_userHash, _publicKey);
     }

    uint public userCount=0;
    function changeUserInformation(uint  _userId,string memory _newHash) public {
        uint checkId = _userId;
        string memory newHash=_newHash;
       // require((checkId<= userCount) && (checkId>0), “message to be displayed”);
        if((checkId<= userCount) && (checkId>0)){
            string memory k= userInformation[_userId].userHash;
            k=newHash;
            userInformation[_userId].userHash=k;
        }
    }

    uint public friendRequestCount=0;

    function addFriendRequestInformation(string memory _friendRequestHash) public {
         friendRequestCount++;
         friendRequestInformation[1]= friendRequestHash( 1,_friendRequestHash);
     }


    function changeFriendRequestInformation(uint  _friendRequestId,string memory _newHash) public {
        uint checkId = _friendRequestId;
        string memory newHash=_newHash;
       // require((checkId<= userCount) && (checkId>0), “message to be displayed”);
        
            string memory k= friendRequestInformation[_friendRequestId].fiendRequestHash;
            k=newHash;
            friendRequestInformation[_friendRequestId].fiendRequestHash=k;
        
    }





    function changeGroupInformation(uint  _userId,string memory _newHash) public {
        uint checkId = _userId;
        string memory newHash=_newHash;
       // require((checkId<= userCount) && (checkId>0), “message to be displayed”);
       
            string memory k= groupInformation[_userId].groupHash;
            k=newHash;
            groupInformation[_userId].groupHash=k;
        
    }



    uint public groupCount=0;
    function createGroup(string memory _groupOwnerUserId,string memory _groupHash)  public {
        groupCount++;
        groupInformation[groupCount]=groupHash(groupCount,_groupOwnerUserId,_groupHash);
    }

  

    uint public postCount=0;
    function createPost(string memory _postOwnerUserId,string memory _postHash)  public {
        postCount++;
        postInformation[postCount]=postHash(postCount,_postOwnerUserId,_postHash);
    }

    function changePostInformation(uint  _userId,string memory _newHash) public {
        uint checkId = _userId;
        string memory newHash=_newHash;
       // require((checkId<= userCount) && (checkId>0), “message to be displayed”);
       
            string memory k= postInformation[_userId].postHash;
            k=newHash;
            postInformation[_userId].postHash=k;
        
    }
       
    

    // uint public postCount=0;
    // function createPost(string memory _postedByEmailId,string memory _postHash, string memory _uniquePostId)  public {
    //     postCount++;
    //     postInformation[postCount]=postHash(postCount,_postedByEmailId,_postHash,_uniquePostId);
    // }



       function getuserCount() public view returns(uint)
    {
        return userCount;
    }

 


}