package modelObjects;

import java.sql.Timestamp;

public class Timer {
	private int timerID;
	private Device device;
	private String timerName;
	private User user;
	private Timestamp turnOnTime;
	private Timestamp turnOffTime;
	private TimerState state;
	
	public int getTimerID() {
		return timerID;
	}

	public void setTimerID(int timerID) {
		this.timerID = timerID;
	}

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public String getTimerName() {
		return timerName;
	}

	public void setTimerName(String timerName) {
		this.timerName = timerName;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public void setTurnOffTime(Timestamp turnOffTime) {
		this.turnOffTime = turnOffTime;
	}

	public TimerState getState() {
		return state;
	}

	public void setState(TimerState state) {
		this.state = state;
	}

	public enum TimerState{
		Active,
		Inactive;
	}
}
