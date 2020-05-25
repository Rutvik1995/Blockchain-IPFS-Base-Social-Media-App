pragma solidity 0.5.8;

contract Meme{
    //Smarty Contract code goes here
    string memeHash;

    mapping(address=>bool) public checkFunction;

  struct userHash{
        uint userId;
        string userEmailId;
        string userHash;
        string publickey;
    }

    struct groupHash{
        uint groupId;
        string groupEmailId;
        string groupHash;
        uint groupVersion;
    }
    struct postHash{
        uint postId;
        string postedEmailId;
        string postHash;
        uint uniqueNumber;
        string date;
    }

    //Write function
  
       mapping(uint=>userHash) public userInformation;
       mapping(uint=>groupHash) public groupInformation;
       mapping(uint=>postHash) public postInformation;

    function addUser(string memory _userEmailId,string memory _userHash,string memory _publicKey) public {
        userCount++;
         userInformation[userCount]= userHash(userCount,_userEmailId,_userHash, _publicKey);
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


    function changeGroupInformation(uint  _userId,string memory _newHash) public {
        uint checkId = _userId;
        string memory newHash=_newHash;
       // require((checkId<= userCount) && (checkId>0), “message to be displayed”);
       
            string memory k= groupInformation[_userId].groupHash;
            k=newHash;
            groupInformation[_userId].groupHash=k;
        
    }





    uint public groupCount=0;
    function createGroup(string memory _groupEmailId,string memory _groupHash, uint  _versionId)  public {
        groupCount++;
        groupInformation[groupCount]=groupHash(groupCount,_groupEmailId,_groupHash,_versionId);
    }

  
       
    

    uint public postCount=0;
    function createPost(string memory _postedByEmailId,string memory _postHash, uint _uniquePostId ,string memory _currentDateAndTime)  public {
        postCount++;
        postInformation[postCount]=postHash(postCount,_postedByEmailId,_postHash,_uniquePostId,_currentDateAndTime);
    }



       function getuserCount() public view returns(uint)
    {
        return userCount;
    }

  


}