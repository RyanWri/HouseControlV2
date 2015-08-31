package utils;

import java.util.TimerTask;

import dataBases.jdbc.TimerHandler;

public class HouseControlTimerTask extends TimerTask{
	private int deviceID;
	private int action;
	private int timerID;

	public HouseControlTimerTask(int deviceID, int timerID, int action) {
		this.deviceID = deviceID;
		this.action = action;
		this.timerID = timerID;
	}

	@Override
	public void run() {
		try {
			String pinState = PiGpio.controlGpioPin(deviceID, action);
			System.out.println("Timer has updated device " + deviceID + "to " + pinState + " state");
		} 
		catch (Exception ex) {
			System.out.println("A problem has occured  while trying to run timer!");
		}
		finally {
			try {
				if(action==1) 
					TimerHandler.CancelAndDeleteMyTimer(timerID, TimerHandler.ON); 
				else
					TimerHandler.CancelAndDeleteMyTimer(timerID, TimerHandler.OFF); 
				if (!TimerHandler.myTimers.containsKey(timerID+TimerHandler.ON) && !TimerHandler.myTimers.containsKey(timerID+TimerHandler.OFF))
					TimerHandler.deleteTimerFromDB(timerID);
			}catch (Exception e) {
				System.out.println("A problem has occured  while trying to run timer!");
			}
		}

	}

}




