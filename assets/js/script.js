
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
productList.forEach(function(product) {
    chrome.runtime.sendMessage({type: 'partCode',partcode: product.partcode}, function(response) {
        if(response) {
            console.log(response.result.data[0]);
            product.element.append("" +
                "<div class='modal fade' id='" + response.result.data[0].StockID + "' tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">" +
                "  <div class=\"modal-dialog modal-lg\">" +
                "        <button type=\"button\" class='btn btn-warning' data-dismiss=\"modal\" aria-label=\"Close\">Close</button>" +
                "    <div class=\"modal-content\">" +

                "<table class='table'>" +
                "<thead><tr>" +
                "<th scope='col'>StockID</th>" +
                "<th scope='col'>TradeName</th>" +
                "<th scope='col'>SOH</th>" +
                "<th scope='col'>MinimumSOH</th>" +
                "<th scope='col'>Reorder</th>" +
                "<th scope='col'>PLU</th>" +
                "<th scope='col'>LastOrderDate</th>" +
                "<th scope='col'>UPI</th>" +
                "<th scope='col'>MinOrdQty</th>" +
                "<th scope='col'>MaximumSOH</th>" +
                "</tr></thead>" +
                "<tbody><tr>" +
                "<td>" + response.result.data[0].StockID + "</td>" +
                "<td>" + response.result.data[0].TradeName + "</td>" +
                "<td>" + response.result.data[0].SOH + "</td>" +
                "<td>" + response.result.data[0].MinimumSOH + "</td>" +
                "<td>" + response.result.data[0].Reorder + "</td>" +
                "<td>" + response.result.data[0].PLU + "</td>" +
                "<td>" + response.result.data[0].LastOrderDate + "</td>" +
                "<td>" + response.result.data[0].UPI + "</td>" +
                "<td>" + response.result.data[0].MinOrdQty + "</td>" +
                "<td>" + response.result.data[0].MaximumSOH + "</td>" +
                "</tr></tbody>" +
                "</table>" +
                "</div>");
            product.element.find(".product-name a").after(
                "<span class='badge badge-success small'>" + response.result.data[0].SOH + "</span>" +
                "<br/><span class='badge badge-warning small'>" + response.result.data[0].TradeName + "</span>" +
                "<br/><span class='badge badge-info small' data-toggle='modal' data-target='#" + response.result.data[0].StockID + "'>StockCards Info</span>"
            );
            product.element.find(".product-name").after(
                );
        }
    });
});