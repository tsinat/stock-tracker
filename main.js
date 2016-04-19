$(function() {

    // initializing our event handlers
    function init() {
        renderStored();
        $('.form').submit(searchApi);
        $('.searchResult').on('click', 'div.parentContainer', addToLocalStorage);
        $('.stored').on('click', 'div.storedContainer', renderDetail)
        $('.stored').on('click', '.delete', deleteStock)
    }
    //search button event handler
    function searchApi(event) {
        event.preventDefault();
        var searchString = $('.searchInput').val();
        var promise = $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${searchString}&callback=?`);
        promise.done(function(data) {
            displayOnPage(data);
        });
    }
    //deletes stock from local storage and the side bar  display
    function deleteStock(e) {
        var indexToDelete = $(e.target).closest('div').index();
        var storedStock = storage.get();
        storedStock.splice(indexToDelete, 1);
        storage.set(storedStock);
        renderStored();

    }
    //renders detaill of the stock that we are following
    //when a stock is clicked on the side bar the detail will be displayed below
    function renderDetail(e) {
        var x = this.children;
        var ajaxToSend = $($(this)[0].firstChild).text();

        var promise = $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${ajaxToSend}&callback=?`);
        promise.done(function(data) {
            displayDetail(data);
        });
    }
    //displays details of the selected stocks if they are clicked from the list
    function displayDetail(data) {
        var result = [];
        var $div = $('<div>').addClass('oneDetail');
        var $companyName = $('<h3>').text(`${data.Name}`);
        var $high = $('<h4>').text(`High: ${data.High}`);
        var $low = $('<h4>').text(`Low: ${data.Low}`);
        var $change = $('<h4>').text(`Change:  ${data.Change}`);
        $div.append($companyName, $high, $low, $change);
        result.push($div);
        $('.detailed').empty().append(result);
    }

    // renders the stored stocks on page load
    //automatically addes clicked stock from the search result to the stored and localStorage
    function renderStored() {
        var storedStock = storage.get();
        var result = []
        for (var i = 0; i < storedStock.length; i++) {
            var $div = $('<div>').addClass('storedContainer');
            var $symbol = $('<p>').text(`${storedStock[i].Symbol}`);
            var $name = $('<p>').text(`${storedStock[i].Name}`);
            var $exchange = $('<p>').text(`${storedStock[i].Exchange}`);
            var $btndelete = $('<button>').addClass('btn btn-danger delete').text('Delete')
            $div.append($symbol, $name, $exchange, $btndelete);
            result.push($div);
        }
        $('.stored').empty().append(result);

    }
    //displays the matched companies to when we hit search button
    function displayOnPage(data) {
        var result = [];
        for (var i = 0; i < data.length - 1; i++) {
            var $div = $('<div>').addClass('parentContainer');
            var $symbol = $('<p>').text(`${data[i].Symbol}`);
            var $name = $('<p>').text(`${data[i].Name}`);
            var $exchange = $('<p>').text(`${data[i].Exchange}`);
            $div.append($symbol, $name, $exchange);
            result.push($div);
        }
        $('.searchResult').empty().append(result);
    }
    //will find the targeted stock to the local storage
    function addToLocalStorage(e) {
        var storedStock = storage.get();
        var x = this.children;
        var name = $(x[1]).text();
        var exchange = $(x[2]).text()
        var symbol = $($(this)[0].firstChild).text();
        var stockToAdd = {
            'Symbol': symbol,
            'Name': name,
            'Exchange': exchange
        };
        // console.log(stockToAdd);
        // console.log(storedStock.indexOf(stockToAdd) !== -1);
        // if(){}
        storedStock.push(stockToAdd);
        storage.set(storedStock);
        renderStored();

    }
    //object that handles our local srorage
    //will have setter and getter methods
    var storage = {
        get: function() {
            var result;
            try {
                result = JSON.parse(localStorage.stocks);
            } catch (err) {
                result = [];
            }
            return result;
        },
        set: function(data) {
            localStorage.stocks = JSON.stringify(data);
        }
    };

    init();
});
