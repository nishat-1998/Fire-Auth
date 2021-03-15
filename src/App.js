import React, { useState } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';


!firebase.apps.length && firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser,setNewUser]=useState(false);
  const [user,setUser]= useState({
    isSignedIn:false,
    newUser:false,
    name:'',
    email:'',
    photo:''
  })
 
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  const handelSignIn = () =>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res=>{
      const {displayName,email,photoURL}=res.user;
      const signInUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signInUser)
      console.log(displayName,email,photoURL)
    })
    .catch(err=>{
      console.log(err);
    })

  }
  const handelFbSignIn=()=>{
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;
  console.log('after using facebook',user)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
    const  signOutUser={
      isSignedIn:false,
      name:'',
      email:'',
      password:'',
      photo:'',
      error:'',
      success:false
    }
setUser(signOutUser);
    })
    .catch(err=>{
      console.log(err)
    })
  }
  const handleBlur=(e)=>{
    //debugger;
  let isFieldValid=true;
    if(e.target.name==='email'){
 isFieldValid= /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name==='password'){
const isPasswordValid=e.target.value.length >6;
const passwordHasNumber=/\d{1}/.test(e.target.value);
isFieldValid=isPasswordValid && passwordHasNumber
    }
if(isFieldValid){
const newUserInfo= {...user};
newUserInfo[e.target.name]=e.target.value;
setUser(newUserInfo)
}
  }
  const handleSubmit=(e)=>{
    //console.log(user.email,user.password)
if (newUser && user.name &&user.password){
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res=>{
    const newUserInfo={...user};
    newUserInfo.error= '';
    newUserInfo.success=true;
setUser(newUserInfo);
updateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error= error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
    // ..
  })
}
if(! newUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo={...user};
    newUserInfo.error= '';
    newUserInfo.success=true;
setUser(newUserInfo);
console.log('sign in user info', res.user);
  })
  .catch((error) => {
    const newUserInfo={...user};
    newUserInfo.error= error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);

  });
}

e.preventDefault();
  }
  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
})
.then(function() {
  console.log("user name successfully update")
}).catch(function(error) {
  console.log(error)
});
  }
  return (
    <div className="App">
{
  user.isSignedIn? <button onClick={handleSignOut}>Sign Out</button>:
  <button onClick={handelSignIn}>Sign In</button>
}
<br/>
<button onClick={handelFbSignIn}>Sign In Using Facebook</button>
{user.isSignedIn && <div>
<h4>Welcome,{user.name}</h4> 
<p>Your Email: {user.email}</p>
<img src={user.photo} alt=""/>
</div>
}  
<h1>Our Own Authentation</h1>
<input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
<label htmlFor="newUser" > New User Sign up</label>

<form onSubmit={handleSubmit}>
 {newUser &&  <input name="name"type="text" onBlur={handleBlur} placeholder="Your Name"/>}
  <br/>
<input type="text" name="email"onBlur={handleBlur}placeholder="Enter Your Email" required/> 
<br/>
<input type="password" name="password"onBlur={handleBlur} placeholder="Your password" required/><br/>
<input type="submit" value={newUser ? 'sign up': 'sign in'}/>
</form>
<p style={{color:'red'}}>{user.error}</p>
{user.success &&<p style={{color:'green'}}>User {newUser? 'Created':'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
