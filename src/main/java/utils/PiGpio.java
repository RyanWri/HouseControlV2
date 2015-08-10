package utils;


import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.pi4j.io.gpio.GpioController;
import com.pi4j.io.gpio.GpioFactory;
import com.pi4j.io.gpio.GpioPinDigitalOutput;
import com.pi4j.io.gpio.Pin;
import com.pi4j.io.gpio.PinState;
import com.pi4j.io.gpio.RaspiPin;

import dataBases.jdbc.DeviceHandler;
import dataBases.jdbc.DeviceUsageHandler;
import dataBases.jdbc.RelayConnectionHandler;
import modelObjects.Device;
import modelObjects.RelayConnection;
import modelObjects.RelayConnection.PortState;

public class PiGpio {

	
	public static final int NUMBER_OF_PINS_IN_RPI = 29;
	public static final String LOW = "LOW";
	public static final String HIGH = "HIGH";
	private static GpioPinDigitalOutput[] myPins;
	private static GpioController gpio;

	public static String controlGpioPin(int pinNumber , int action) throws Exception{
		try{
			if(pinNumber >=0 && pinNumber <NUMBER_OF_PINS_IN_RPI && action >=0 & action <=1)
			{
				if(myPins[pinNumber] != null && checkifActionConsistent(pinNumber ,action)){
					RelayConnection[] relayConnectionsFromDB = RelayConnectionHandler.initRpiPinsFromDB();
					if(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID() > 0 ){
						myPins[pinNumber].toggle();	
						if(relayConnectionsFromDB[pinNumber].getState() == PortState.On){
							RelayConnectionHandler.setDeviceOnOrOffInTheDB(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID(), relayConnectionsFromDB[pinNumber].getRelayPort(), PortState.Off);
							DeviceUsageHandler.updateDeviceUsageTurnOffTimeStamp(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID(), DeviceUsageHandler.getCurrentTimeStamp());
						}
						else if(relayConnectionsFromDB[pinNumber].getState() == PortState.Off) {
							RelayConnectionHandler.setDeviceOnOrOffInTheDB(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID(), relayConnectionsFromDB[pinNumber].getRelayPort(), PortState.On);
							DeviceUsageHandler.insertNewDeviceUsage(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID(), DeviceUsageHandler.getCurrentTimeStamp());
						}	
					}
					else{
						throw new Exception("There is no device connected to this pin in the DB!");
					}
				}
				else{
					throw new Exception("The Action is not consistent with the device current status");
				}
			}
			return getPinState(pinNumber);
		}
		catch(Exception ex) {
			throw ex;
		}
	}

	private static boolean checkifActionConsistent(int pinNumber, int action) throws Exception {
		boolean actionConsistent = false;
		try{
			String currentPinState = getPinState(pinNumber);
			if (currentPinState == LOW && action == 1)
				actionConsistent = true;
			else if ( currentPinState == HIGH && action == 0)
				actionConsistent = true ;
			return actionConsistent;
		}
		catch(Exception ex){
			throw ex;
		}
	}

	public static String getPinState(int pinNumber) throws Exception {

		try{
			if(myPins[pinNumber] != null){
				PinState currentPinState = myPins[pinNumber].getState();
				return getPinStringState(currentPinState);	
			}
			else{
				throw new Exception("Port is not activated!");
			}
		}
		catch (Exception ex){
			throw ex;
		}
	}

	private static String getPinStringState(PinState currentPinState) {

		if (currentPinState == PinState.HIGH){
			return LOW;
		}
		else 
			return HIGH;
	}

	public static void shutDownGpio() throws Exception {
		DeviceUsageHandler.turnOffAllTurnedOnDevicesInDB();
		//gpio.shutdown();  ///???? DO I NEED TO SHUT EVERYTHING DOWN????
	}

	private static Pin getPinGPIO(int pinNumber) 
	{
		Pin retPin = null;
		switch (pinNumber) {
		case 0:
			retPin = RaspiPin.GPIO_00;
			break;	
		case 1:
			retPin = RaspiPin.GPIO_01;
			break;	
		case 2:
			retPin = RaspiPin.GPIO_02;
			break;	
		case 3:
			retPin = RaspiPin.GPIO_03;
			break;	
		case 4:
			retPin = RaspiPin.GPIO_04;
			break;	
		case 5:
			retPin = RaspiPin.GPIO_05;
			break;	
		case 6:
			retPin = RaspiPin.GPIO_06;
			break;	
		case 7:
			retPin = RaspiPin.GPIO_07;
			break;	
		case 8:
			retPin = RaspiPin.GPIO_08;
			break;	
		case 9:
			retPin = RaspiPin.GPIO_09;
			break;	
		case 10:
			retPin = RaspiPin.GPIO_10;
			break;	
		case 11:
			retPin = RaspiPin.GPIO_11;
			break;	
		case 12:
			retPin = RaspiPin.GPIO_12;
			break;	
		case 13:
			retPin = RaspiPin.GPIO_13;
			break;	
		case 14:
			retPin = RaspiPin.GPIO_14;
			break;	
		case 15:
			retPin = RaspiPin.GPIO_15;
			break;	
		case 16:
			retPin = RaspiPin.GPIO_16;
			break;	
		case 17:
			retPin = RaspiPin.GPIO_17;
			break;	
		case 18:
			retPin = RaspiPin.GPIO_18;
			break;	
		case 19:
			retPin = RaspiPin.GPIO_19;
			break;	
		case 20:
			retPin = RaspiPin.GPIO_20;
			break;	
		case 21:
			retPin = RaspiPin.GPIO_21;
			break;	
		case 22:
			retPin = RaspiPin.GPIO_22;
			break;	
		case 23:
			retPin = RaspiPin.GPIO_23;
			break;	
		case 24:
			retPin = RaspiPin.GPIO_24;
			break;	
		case 25:
			retPin = RaspiPin.GPIO_25;
			break;	
		case 26:
			retPin = RaspiPin.GPIO_26;
			break;	
		case 27:
			retPin = RaspiPin.GPIO_27;
			break;	
		case 28:
			retPin = RaspiPin.GPIO_28;
			break;	
		case 29:
			retPin = RaspiPin.GPIO_29;
			break;				
		}
		return retPin;
	}
	
	public static void initializePiGpio() throws Exception {
		myPins = new GpioPinDigitalOutput [NUMBER_OF_PINS_IN_RPI];
		
		//gpio = GpioFactory.getInstance(); //$$ FOR DEBUG

		try{
			RelayConnection[] relayConnectionsFromDB = RelayConnectionHandler.initRpiPinsFromDB();
			//doc: init to low ( bug in pi4j : HIGH is off and LOW is ON)		
			for (int pinNumber = 0; pinNumber < NUMBER_OF_PINS_IN_RPI; pinNumber++){
				Pin gpioPin = getPinGPIO(pinNumber);
				if (relayConnectionsFromDB[pinNumber].getState() == PortState.On){
					myPins[pinNumber] = gpio.provisionDigitalOutputPin(gpioPin);
					myPins[pinNumber].setState(PinState.LOW);
					DeviceUsageHandler.insertNewDeviceUsage(relayConnectionsFromDB[pinNumber].getDevice().getDeviceID(), DeviceUsageHandler.getCurrentTimeStamp());
				}
				else 
					myPins[pinNumber] = gpio.provisionDigitalOutputPin(gpioPin,PinState.HIGH);
			}
		}
		catch (Exception ex){
			throw ex;
		}
	}


	public static String getAllDevicesStatistics(String timeFrame) {
		List<Device> devices = new ArrayList<Device>();
		JSONObject deviceConsumption = new JSONObject();
		double sum = 0;
		Device currentDevice;
		double hours;
		
		try{
			if(timeFrame.equals("day") || timeFrame.equals("week") || timeFrame.equals("month"))
			{
				devices = DeviceHandler.getAllDevicesIDs();
				for (Device device : devices) {
					deviceConsumption = DeviceUsageHandler.getDeviceSumVoltageStatistics(device.getDeviceID(), timeFrame);
					hours = (double) deviceConsumption.get("hours");
					currentDevice = (Device) deviceConsumption.get("device");
					sum += currentDevice.getVoltage() *((int) hours) + (currentDevice.getVoltage() * (((hours % 1d)/60d)*100d));
				}
			}
			else{
			throw new Exception("Please select day/week/month as a time frame!");
			}
			
		}
		
		catch(Exception ex){
			
		}
		return String.format("%.3f",sum);
	}
	
	public static String getDeviceStatistics(String timeFrame, int deviceID) throws Exception {
		String DeviceUsage = "";
		JSONObject deviceConsumption = new JSONObject();
		Device device;
		double hours;
		double voltage;
		String totalConsumption;
		try{
			if(timeFrame.equals("day") || timeFrame.equals("week") || timeFrame.equals("month"))
			{
				deviceConsumption = DeviceUsageHandler.getDeviceSumVoltageStatistics(deviceID, timeFrame);
				device = (Device) deviceConsumption.get("device");
				hours = (double)deviceConsumption.get("hours");
				voltage = (double)device.getVoltage();
				totalConsumption = String.format("%.3f",voltage *((int) hours) + (voltage * (((hours % 1d)/60d)*100d)));
				
				DeviceUsage = "In the last "+ timeFrame + " device "+deviceID +":" + device.getName() + " consumed " + totalConsumption + " volts in "+ String.format("%.2f", hours) + " hours";
			}
			else{
			throw new Exception("Please select day/week/month as a time frame!");
			}			
		}		
		catch(Exception ex){
			throw ex;
		}
		return DeviceUsage;
	}

}
