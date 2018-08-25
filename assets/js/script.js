var host,active;
chrome.storage.sync.get(function (obj) {
    if(obj['active'] && obj['active'] !== null) {
        active = obj['active'];
        console.log(active);
    }
    if((window.location.host === 'my.api.net.au' || window.location.host === 'sigmaws.signet.com.au' || window.location.host === 'www.barrettwebstore.com.au') && active === true) {
        loadScript();
    }else{
        licenseProblem();
    }
});

function licenseProblem() {
    chrome.storage.sync.get(function (obj) {
        $(".page-title h1").after(
            "<div class=''>" +
                "<div class='invalid-license' id='showAlert'><span class='badge badge-warning pointer'>Show License warning</span></div><br/>" +
                "<div class='alert alert-warning' id='tg-alert-invalid'>" +
                "<a href='#' class='close' id='closeAlert'>&times;</a>" +
                "TechGorilla Stock Interface<br/><strong>License Invalid!</strong> Enter a valid key into the <a href='#' id='openSettings'>settings</a> or contact support at <a href='https://billing.techgorilla.io'>TechGorilla</a>" +
                "<br/>Stock data cannot be loaded without a valid license" +
                "<br/><a href='#' id='checkLicense'>Force re-check</a>" +
                "</div>" +
            "</div>");
        $("#openSettings").click(function () {
            chrome.runtime.sendMessage({type: 'options'}, function (res) {
            });
        });
        $("#checkLicense").click(function () {
            chrome.runtime.sendMessage({type: 'license'}, function (res) {
            });
        });
        $("#showAlert").click(function () {
            $("#tg-alert-invalid").toggle();
        });
        $("#closeAlert").click(function () {
            $("#tg-alert-invalid").hide();
        });
    });

}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].partcode === obj) {
            return true;
        }
    }
    return false;
}

function loadScript() {
    function Product(element, names, partcode, name)
    {
        this.element = element;
        this.partcode = partcode;   // data member that store a simple value
        this.names = names || []; //if objarray isn't passed it'll initiate an empty array
        this.name = name;
    }
    if(window.location.host === 'www.barrettwebstore.com.au') {
        var productList = [];
        $(".item").each(function (index, element) {
            //console.log( $(this).find(".product-name a").text().trim());
            console.log($(this).find(".product-shop-inner span").text().trim());
            var tempProduct = new Product();
            tempProduct.element = $(this);
            tempProduct.name = $(this).find(".product-name a").text().trim();
            tempProduct.partcode = $(this).find(".product-shop-inner span").text().trim();
            if(!containsObject(tempProduct.partcode,productList)) {
                productList.push(tempProduct);
            }
        });
        productList.forEach(function (product) {
            chrome.runtime.sendMessage({
                type: 'partCode',
                partcode: product.partcode,
                name: product.name
            }, function (response) {
                if (response) {
                    console.log(response.result.data[0]);
                    product.element.append("" +
                        "<div id=" + response.result.data[0].StockID +"  class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">" +
                        "  <div class=\"modal-dialog\" role=\"document\">" +
                        "    <div class=\"modal-content\">" +
                        "       <div class=\"modal-header\">" +
                        "           <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
                        "           <h4 class=\"modal-title\" id=\"myModalLabel\">" +response.result.data[0].TradeName + "</h4>" +
                        "       </div>" +
                        "      <div class=\"modal-body\">" +
                        "<table class='table'>" +
                        "<thead><tr>" +
                        "<th scope='col'>StockID</th>" +
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
                        "      </div>" +
                        "      <div class=\"modal-footer\">" +
                        "        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>" +
                        "      </div>" +
                        "    </div>" +
                        "  </div>" +
                        "</div>");
                    product.element.find(".product-name a").after(
                        "<br/><span class='tg-badge tg-badge-success small'>" + response.result.data[0].SOH + "</span>" +
                        "<br/><span class='tg-badge tg-badge-warning small'>" + response.result.data[0].TradeName + "</span>" +
                        "<br/><span class='tg-badge tg-badge-info small pointer'>StockCards Info</span>" // data-toggle='modal' data-target='#" + response.result.data[0].StockID + "'
                    );
                    product.element.find(".product-name").after(
                    );
                }
            });
        });
    }
    if(window.location.host === 'my.api.net.au') {
        var productList = [];
        $(".item").each(function (index, element) {
            var tempProduct = new Product();
            tempProduct.element = $(this);
            tempProduct.name = $(this).find(".product-name a").text().trim();
            tempProduct.names = $(this).find(".product-name a").text().trim().split(' ');
            tempProduct.partcode = $(this).find(".pde-description").text().trim().split(' ')[1];
            productList.push(tempProduct);
        });
        productList.forEach(function (product) {
            chrome.runtime.sendMessage({
                type: 'partCode',
                partcode: product.partcode,
                name: product.name
            }, function (response) {
                if (response) {
                    console.log(response.result.data[0]);
                    product.element.append("" +
                        "<div id=" + response.result.data[0].StockID +"  class=\"modal fade\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">" +
                        "  <div class=\"modal-dialog\" role=\"document\">" +
                        "    <div class=\"modal-content\">" +
                        "       <div class=\"modal-header\">" +
                        "           <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>" +
                        "           <h4 class=\"modal-title\" id=\"myModalLabel\">" +response.result.data[0].TradeName + "</h4>" +
                        "       </div>" +
                        "      <div class=\"modal-body\">" +
                        "<table class='table'>" +
                            "<thead><tr>" +
                            "<th scope='col'>StockID</th>" +
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
                        "      </div>" +
                        "      <div class=\"modal-footer\">" +
                        "        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>" +
                        "      </div>" +
                        "    </div>" +
                        "  </div>" +
                        "</div>");
                    product.element.find(".product-name a").after(
                        "<br/><span class='badge badge-success small'>" + response.result.data[0].SOH + "</span>" +
                        "<br/><span class='badge badge-warning small'>" + response.result.data[0].TradeName + "</span>" +
                        "<br/><button class='badge badge-info small pointer' data-toggle='modal' data-target='#" + response.result.data[0].StockID + "'>StockCards Info</button>"
                    );
                    product.element.find(".product-name").after(
                    );
                }
            });
        });
    }
}

