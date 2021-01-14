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

    
    let token = credential.accessToken;
    
    let user = result.user;
    console.log(user.email);
  }).catch((error) => {
    
    let errorCode = error.code;
    let errorMessage = error.message;
    
    let email = error.email;
    
    let credential = error.credential;
    
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
        } else {
          
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
