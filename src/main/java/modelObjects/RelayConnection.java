package modelObjects;

public class RelayConnection {
	private int relayPort;
	private Device device;
	
	public int getRelayPort() {
		return relayPort;
	}
	
	public void setRelayPort(int relayPort) {
		this.relayPort = relayPort;
	}
	
	public Device getDevice() {
		return device;
	}
	
	public void setDevice(Device device) {
		this.device = device;
	}
}
