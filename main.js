var app = angular.module ('mysaleinvoice', [])

.constant('DEFAULT_INVOICE', {
  invtax: 12.00,
  invdisc: 0.00,
  invpaid: 0.00,
  invoice_number: 1001,
  items:[
    { addqty: 1, pdetail: 'PACK', addprice: 0 , pdiscount: 0 }
  ]
})

.service('LocalStorage', [function() {

  var Service = {};

  
  var hasLogo = function()
  {
    return !!localStorage['logo'];
  };

  Service.getLogo = function()
  {
    if (hasLogo())
    {
      return localStorage['logo'];
    }
    else
    {
      return false;
    }
  };

  Service.setLogo = function(logo)
  {
    localStorage['logo'] = logo;
  };

 
  var hasInvoice = function()
  {
    return !(localStorage['invoice'] == '' || localStorage['invoice'] == null);
  };

  Service.getInvoice = function()
  {
    if (hasInvoice()) {
      return JSON.parse(localStorage['invoice']);
    } else {
      return false;
    }
  };

  Service.setInvoice = function(invoice)
  {
    localStorage['invoice'] = JSON.stringify(invoice);
  };

  Service.clearLogo = function()
  {
    localStorage['logo'] = '';
  };

  Service.clearinvoice = function()
  {
    localStorage['invoice'] = '';
  };

  Service.clear = function()
  {
    localStorage['invoice'] = '';
    Service.clearLogo();
  };

  return Service;

}])
  
  .service('Currency', [function(){
  
    var service = {};
  
    service.all = function() {
      return [
        {
          name: 'Pakistani Rupees ( PKR )',
          symbol: ' PKR '
        },
        {
          name: 'British Pound (£)',
          symbol: '£'
        },
        {
          name: 'Canadian Dollar ($)',
          symbol: 'CAD $ '
        },
        {
          name: 'Euro (€)',
          symbol: '€'
        },
        {
          name: 'Indian Rupees (₹)',
          symbol: '₹'
        },
        {
          name: 'Norwegian krone (kr)',
          symbol: 'kr '
        },
        {
          name: 'US Dollar ($)',
          symbol: '$'
        }
      ]
    }
  
    return service;
    
  }])
  

app.controller ('salectrl',  ['$scope' , '$http' , 'DEFAULT_INVOICE' , 'LocalStorage' , 'Currency', 
  function ($scope, $http, DEFAULT_INVOICE, LocalStorage, Currency ) {

    (function init() 
    {
        $scope.currencySymbol = 'PKR';
        $scope.logoremoved = false ;
        $scope.printmode = false ;

      !function () 
      {
        var invoice = LocalStorage.getInvoice();
        $scope.invoice = invoice ? invoice : DEFAULT_INVOICE ;
      }();

      $scope.availableCurrencies = Currency.all();
    })()
      
    $scope.additem = function () 
    {
        $scope.invoice.items.push({addqty:0 , pdetail: '' , addprice:0 , pdiscount: 0});
    }

    $scope.removeItem = function(item) 
    {
        $scope.invoice.items.splice($scope.invoice.items.indexOf(item), 1);
    };

    $scope.invoiceSubTotal = function() 
    {
      var total = 0.00;
      angular.forEach($scope.invoice.items, function(item, key)
      {
        total += (item.addqty * item.addprice - item.pdiscount);
      });
      return total;
    };

    $scope.calculatetax = function () 
    {
      return (($scope.invoice.invtax * $scope.invoiceSubTotal())/100);
    };

    $scope.calculateGrandTotal = function () 
    {
      return $scope.invoiceSubTotal() + $scope.calculatetax();
    };

    $scope.calculatediscount = function () 
    {
      return (($scope.invoice.invdisc * $scope.calculateGrandTotal())/100);
    };

    $scope.calculateNetTotal = function () 
    {
      return $scope.calculateGrandTotal() - $scope.calculatediscount();
    };

    $scope.calculateprevious = function () 
    {
      return ($scope.calculateNetTotal() - $scope.invoice.invpaid );
    };

    $scope.clearLocalStorage = function() {
      var confirmClear = confirm('Are you sure you would like to clear the invoice?');
      if(confirmClear) {
        LocalStorage.clear();
        setInvoice(DEFAULT_INVOICE);
      }
    };
  
  var setInvoice = function(invoice) {
    $scope.invoice = invoice;
    saveInvoice();
  };

  var readUrl = function(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('company_logo').setAttribute('src', e.target.result);
        LocalStorage.setLogo(e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  };

  var saveInvoice = function() {
    LocalStorage.setInvoice($scope.invoice);
  };

  angular.element(document).ready(function () {
    
    document.getElementById('invoice-number').focus();

    document.getElementById('imgInp').onchange = function() {
      readUrl(this);
    };
  });

  $scope.printfun = function () 
  {
    window.print();
  };
  
  }])