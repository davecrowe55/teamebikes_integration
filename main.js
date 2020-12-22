$(document).ready(function(){
    getContacts();
})

function getContacts(){
    let url = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=10&paginateAssociations=false&archived=false&hapikey'=+apiKey;

    $.ajax(url,{success: function(data){
        console.log(data);
    }})
}