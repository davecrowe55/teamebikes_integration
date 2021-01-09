$(document).ready(function(){
    getposts();
})

function handleSignIn() {
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    console.log(user.email);
  }).catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
    // ...
  });
}
function addMessage(postTitle, postBody){
    let postData = {
        title: postTitle,
        body: postBody
    }
    var database = firebase.database().ref("posts");

    var newPostRef = database.push();
    newPostRef.set(postData, (error) => {
        if (error) {
          // The write failed...
        } else {
          // Data saved successfully!
          window.location.reload();
        }
      });
    }

function handleMessageFormSubmit(){
    let postTitle = $('#post-title').val();
    let postBody = $('#post-body').val();
    console.log(postTitle);
    addMessage(postTitle, postBody);
};

function getposts(){

    return firebase.database().ref("posts").once('value').then(function(snapshot) {
        let posts = snapshot.val();
        console.log(posts);
       

        for(let postKey in posts) {
            let post = posts[postKey];
            $("#post-listing").append("<div>"+post.title+" - "+post.body+"</div>");
        }
      });    
};
