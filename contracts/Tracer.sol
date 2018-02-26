pragma solidity ^0.4.17;

contract Tracer {

	event MetaLogged(bytes32 indexed serial, string date, string temperature);

  function TagMeta(bytes32 _serial, string _date, string _temp) public{			
			MetaLogged(_serial, _date, _temp);
  }
}
