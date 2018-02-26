pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Tracer.sol";

contract TestTracer {

  function testSetTracerUsingDeployedAddress() {
    Tracer meta = Tracer(DeployedAddresses.Tracer());

    string storage serial = "1234";
    string storage temp = "12";

    Assert.equal(meta.TagMeta(serial, temp), temp, "Temp should be 12.");
  }

  function testInitialBalanceWithNewMetaCoin() {
    Tracer meta = new Tracer();

    string storage serial = "1234";
    string storage temp = "12";

    Assert.equal(meta.TagMeta(serial, temp), temp, "Temp should be 12.");
  }

}
