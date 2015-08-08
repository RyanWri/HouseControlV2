package modelObjects;

public class RelayConnection{
	private int relayPort;
	private Device device;
	private int pinNumber;
	private PortState state;
	
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
	
	public int getPinNumber() {
		return pinNumber;
	}

	public void setPinNumber(int pinNumber) {
		this.pinNumber = pinNumber;
	}

	public PortState getState() {
		return state;
	}

	public void setState(PortState state) {
		this.state = state;
	}

	public enum PortState{
		On,
		Off,
		Disabled
	}
}
