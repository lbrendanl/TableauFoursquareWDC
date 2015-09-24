// Called when web page first loads
$(document).ready(function() {
    var accessToken = false
    var hasAuth = accessToken && accessToken.length > 0;
    updateUIWithAuthState(hasAuth);
});

// This function togglels the label shown depending
// on whether or not the user has been authenticated
function updateUIWithAuthState(hasAuth) {
    if (hasAuth) {
        $(".notsignedin").css('display', 'none');
        $(".signedin").css('display', 'block');
    } else {
        $(".notsignedin").css('display', 'block');
        $(".signedin").css('display', 'none');
    }
}
