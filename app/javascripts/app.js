// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tracer_artifacts from '../../build/contracts/Tracer.json'

//our usable abstraction, which we'll use through the code below.
var Tracer = contract(tracer_artifacts);

var account;
var accounts;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the abstraction for Use.
    Tracer.setProvider(web3.currentProvider);

    // Get the initial account
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    console.log(message);
    status.innerHTML = message;
  },

  setTable: function(data){
    var table = document.createElement("table");

    if(Object.keys(data).length >= 1)
    {
      var tr = table.insertRow(-1);
      var th = document.createElement("th");
      th.innerHTML = 'Date';
      tr.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = 'Temperature';
      tr.appendChild(th);
      this.setStatus("");
      data.forEach(function(data){
        console.log(data.args);

        var tr = table.insertRow(-1);
        var tabcell = tr.insertCell(-1);
        tabcell.innerHTML = data.args.date;
        var tabcell = tr.insertCell(-1);
        tabcell.innerHTML = data.args.temperature;

          var divContainer = document.getElementById("showData");
          divContainer.innerHTML = "";
          divContainer.appendChild(table);
      });
    } else {
      var divContainer = document.getElementById("showData");
      divContainer.innerHTML = "";
      this.setStatus("No data found.");
    }
  },

  readlogs: function() {
    var self = this;
    var meta;
    var serial = document.getElementById("serial2").value;
    Tracer.deployed().then(function(instance) {
      meta = instance;
      var metaevent = meta.MetaLogged({serial: serial}, {fromBlock: 0, toBlock: 'latest'});
        metaevent.get(function(err, res){
          if (!err)
              {
                  console.log('Woot');
                  console.log(res);
                  res.forEach(function(res){
                    console.log(res.args);
                    //self.setStatus2(res.args.date);
                  });
                  self.setTable(res);
              } else {
                  console.log('Aww');
                  console.log(err);
              }
        })
      })
  },

  readlogs2: function() {
    var self = this;
    var meta;
    Tracer.deployed().then(function(instance) {
      meta = instance;
      var metaevent = meta.allEvents({fromBlock: 0, toBlock: 'latest'});
        metaevent.get(function(err, res){
          if (!err)
              {
                console.log('Woot');
                console.log(res);
                res.forEach(function(res){
                  console.log(res.args);
                  //self.setStatus2(res.args.date);
                });
                self.setTable(res);
                  //setStatus(result.args.serial);
              } else {
                  console.log('Aww');
                  console.log(err);
              }
        })
      })
  },

  sendTemp: function() {
    var self = this;

    var serial = document.getElementById("serial").value;
    var temp = document.getElementById("temperature").value;
    var datestr = this.datestring();

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    Tracer.deployed().then(function(instance) {
      meta = instance;

      return meta.TagMeta(serial, datestr, temp, {from: account});
    }).then(function(value) {
      self.setStatus("Transaction complete!");
      console.log(value.valueOf());
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending temp; see log.");
    });
  },

  datestring: function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var today = mm+'/'+dd+'/'+yyyy;
    return today;
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  /*if (typeof web3 !== 'undefined') {
    //console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {*/
    //console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //AS - do not inject, can't use Metamask due to issues with log filters
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  //}

  App.start();
});
