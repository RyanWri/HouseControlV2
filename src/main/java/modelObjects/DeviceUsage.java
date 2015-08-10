package modelObjects;

import java.sql.Timestamp;

public class DeviceUsage {
	private Device device;
	private Timestamp turnOnTime;
	private Timestamp turnOffTime;
	
	public Device getDevice() {
		return device;
	}
	
	public void setDevice(Device device) {
		this.device = device;
	}
	
	public Timestamp getTurnOnTime() {
		return turnOnTime;
	}
	
	public void setTurnOnTime(Timestamp turnOnTime) {
		this.turnOnTime = turnOnTime;
	}
	
	public Timestamp getTurnOffTime() {
		return turnOffTime;
	}
	
	public void setTurnOffTime(Timestamp turnOfTime) {
		this.turnOffTime = turnOfTime;
	}
	
	
}
