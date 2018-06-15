function Product(element, names, partcode)
{
    this.element = element;
    this.partcode = partcode;   // data member that store a simple value
    this.names = names || []; //if objarray isn't passed it'll initiate an empty array
}
var productList = [];
$( ".item" ).each(function( index, element ) {
    var tempProduct = new Product();
    tempProduct.element = $(this);
    tempProduct.names = $(this).find(".product-name a").text().trim().split(' ');
    tempProduct.partcode = $(this).find(".pde-description").text().trim().split(' ')[1];
    productList.push(tempProduct);
});
for (var i = 0; i < productList.length; i++) {
    productList[i].element.find(".product-name a").append("<br/><span class='lots-stockcard lots-stockcard-accept'>" + productList[i].partcode + "</span>");
    console.log(productList[i]);
}