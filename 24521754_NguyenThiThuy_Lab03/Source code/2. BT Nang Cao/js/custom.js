var products = [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg",
    "images/7.jpg",
    "images/8.jpg",
    "images/9.jpg",
    "images/10.jpg",
    "images/11.jpg",
    "images/12.jpg",
    "images/13.jpg",
    "images/14.jpg",
    "images/15.jpg",
    "images/16.jpg",
    "images/17.jpg",
    "images/18.jpg",
    "images/19.jpg",
    "images/20.jpg",
    "images/21.jpg",
    "images/22.jpg",
    "images/23.jpg",
    "images/24.jpg"
];

//Handle SeeMore button by Tin Trinh 2020.04.19
var btnSeeMore = document.getElementById("btnSeeMore");
btnSeeMore.onclick = function(){
    displayMoreProducts(); //Display next 4 products
};

document.onscroll = function(){
    if (document.offsetHeight + document.scrollTop >= document.scrollHeight) {
        displayMoreProducts();
      }
}


function displayMoreProducts(){
    document.getElementById("divSearchResult").innerHTML += '<img class="col-md-4 thumbnail" src="images/7.jpg"/>';
    document.getElementById("divSearchResult").innerHTML += '<img class="col-md-4 thumbnail" src="images/8.jpg"/>';
    document.getElementById("divSearchResult").innerHTML += '<img class="col-md-4 thumbnail" src="images/9.jpg"/>';
    document.getElementById("divSearchResult").innerHTML += '<img class="col-md-4 thumbnail" src="images/10.jpg"/>';
}
