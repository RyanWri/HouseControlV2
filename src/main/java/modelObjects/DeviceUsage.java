package modelObjects;

import java.sql.Timestamp;

public class DeviceUsage {
	private Device device;
	private Timestamp turnOnTime;
	private Timestamp turnOfTime;
	
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
	
	public Timestamp getTurnOfTime() {
		return turnOfTime;
	}
	
	public void setTurnOfTime(Timestamp turnOfTime) {
		this.turnOfTime = turnOfTime;
	}
	
	
}
