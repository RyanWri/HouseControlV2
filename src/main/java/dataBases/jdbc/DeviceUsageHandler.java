package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.DbUtils;
import org.json.JSONObject;

import modelObjects.Device;
import modelObjects.DeviceUsage;

public class DeviceUsageHandler {
	public static final int DAY_OFFSET = 24*60*60000 ; //HOURS*MINUTES*MILLISECONDS
	public static final int WEEK_OFFSET = 168*60*60000;
	public static final int MONTH_30_OFFSET = 720*60*60000;
	public static final int HOUR_IN_MILLISECONDS = 60*60000;
	public static final int MINUTES_IN_MILLISECONDS = 1000*60;


	public static DeviceUsage getLastDeviceUsage(int deviceID) throws Exception{
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		DeviceUsage deviceUsages = null;

		if(deviceID <1){
			throw new Exception("Please provide a valid device");
		}

		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+"FROM device_usage "
					+"WHERE deviceID=" +deviceID + " "
					+"ORDER BY turnOnTime DESC LIMIT 1";
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				deviceUsages = mapRow(resultSet);
				System.out.println("Getting device  " + deviceID + " usage");
			}
			else{
				throw new Exception("Device with id: " + deviceID + " doesn't exist");
			}	
		}
		catch(SQLException ex){
			throw new Exception("An error has occured while trying to get device " + deviceID + " usage");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return deviceUsages;

	}

	private static DeviceUsage mapRow(ResultSet resultSet) throws SQLException{		
		DeviceUsage deviceUsages = new DeviceUsage();
		Device device = new Device();

		device.setDeviceID(resultSet.getInt("deviceID"));
		deviceUsages.setDevice(device);
		deviceUsages.setTurnOnTime(resultSet.getTimestamp("turnOnTime"));
		deviceUsages.setTurnOffTime(resultSet.getTimestamp("turnOffTime"));


		return deviceUsages;
	}

	public static void insertNewDeviceUsage(int deviceID, Timestamp turnOnTime) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(deviceID <1){
			throw new Exception("Please provide a valid device");
		}
		try{

			String query = "INSERT into device_usage VALUES(?,?,?)";
			conn = DBConn.getConnection();
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setInt(1, deviceID);
			statement.setTimestamp(2, turnOnTime);
			statement.setString(3, null);
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("Device " + deviceID + " usage was inserted");
			}
		}
		catch(SQLException ex){
			throw new Exception("A problem has occured while trying adding the device usage");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static void updateDeviceUsageTurnOffTimeStamp(int deviceID, Timestamp turnOffTime) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(deviceID <1){
			throw new Exception("Please provide a valid device");
		}
		try{
			DeviceUsage lastDeviceUsage = getLastDeviceUsage(deviceID);  
			String insertSql = "UPDATE device_usage "
					+"SET turnOffTime = ?, "
					+"turnOnTime = ? "
					+"WHERE deviceID = ? "
					+"ORDER BY turnOnTime DESC LIMIT 1";

			conn = DBConn.getConnection();
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setTimestamp(1, turnOffTime);
			statement.setTimestamp(2, lastDeviceUsage.getTurnOnTime());
			statement.setInt(3, deviceID);			

			int isSucceeded = statement.executeUpdate();
			if(isSucceeded == 0){
				throw new Exception("Failed to update device " + deviceID +" turn off timestamp");
			}
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("Device " + deviceID +" turn off timestamp was updated");
			}
			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception("A problem has occured while trying updating device " + deviceID +" turn off timestamp");
		}
		finally{
			conn.setAutoCommit(true);
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}		
	}


	public static List<DeviceUsage> GetAllDevicesAllUsage () throws Exception{
		List<DeviceUsage> deviceUsages =  new ArrayList<DeviceUsage>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+"FROM device_usage ";			
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				deviceUsages.add(mapRow(resultSet));
			}
		}
		catch (Exception ex) {
			throw new Exception("Failed to get all devices usages list");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return deviceUsages;	
	}

	public static List<DeviceUsage> getDeviceAllUsages(int deviceID) throws Exception{
		List<DeviceUsage> allDevicesUsage =  new ArrayList<DeviceUsage>();
		List<DeviceUsage> deviceUsage = new ArrayList<DeviceUsage>();
		try{
			allDevicesUsage = GetAllDevicesAllUsage();
			for (DeviceUsage currentDeviceUsage : allDevicesUsage) {
				if(currentDeviceUsage.getDevice().getDeviceID() == deviceID){
					deviceUsage.add(currentDeviceUsage);
				}
			}
		}
		catch (Exception ex) {
			throw new Exception("Failed to get device "+ deviceID +" usages list");
		}

		return deviceUsage;

	}

	public static void turnOffAllTurnedOnDevicesInDB() throws Exception {
		List<DeviceUsage> deviceUsages =  new ArrayList<DeviceUsage>();

		try{
			deviceUsages = getAllTurnedOnDevicesInDB();
			for (DeviceUsage deviceUsage : deviceUsages) {
				if(deviceUsage.getTurnOffTime() == null){
					updateDeviceUsageTurnOffTimeStamp(deviceUsage.getDevice().getDeviceID(),getCurrentTimeStamp());
				}
			}		
		}
		catch (Exception ex) {
			throw new Exception("An error has occured while trying to turn Off the working devices from DB");
		}
	}

	public static List<DeviceUsage> getAllTurnedOnDevicesInDB() throws Exception {
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		List<DeviceUsage> deviceUsages =  new ArrayList<DeviceUsage>();

		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+"FROM device_usage "
					+"WHERE turnOffTime IS NULL";			
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				deviceUsages.add(mapRow(resultSet));
			}
		}
		catch (Exception ex) {
			throw new Exception("An error has occured while trying to get all turned On devices from DB");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return deviceUsages;
	}


	public static Timestamp getCurrentTimeStamp() {
		Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());

		return(currentTimestamp);
	}


	/****************************************STATISTICS****************************************/
	public static long getDeviceSumWorkTimeStatistics(int deviceID, String timeFrame) throws Exception{
		long sum = 0, diff = 0;
		List<DeviceUsage> deviceUsages;

		Timestamp timeFrameInMilliseconds = new Timestamp(getTimeFrameInMilliseconds(timeFrame));
		try{		
			deviceUsages =  getDeviceAllUsages(deviceID);
			for (DeviceUsage deviceUsage : deviceUsages) {
				Timestamp ts = new Timestamp(getCurrentTimeStamp().getTime() - timeFrameInMilliseconds.getTime());
				if(deviceUsage.getTurnOnTime().compareTo(ts) >= 0 && deviceUsage.getTurnOffTime() != null){
					diff= (long)deviceUsage.getTurnOffTime().getTime() - (long)deviceUsage.getTurnOnTime().getTime();
					sum += diff;
				}
			}
		}
		catch (Exception ex){
			throw new Exception("An error has occured while trying to calculate device "+deviceID +" all usages");
		}	
		return sum;
	}

	public static long getAllDevicesSumWorkTimeStatistics(String timeFrame) throws Exception{
		long sum = 0;
		List<DeviceUsage> deviceUsages;

		Timestamp timeFrameInMilliseconds = new Timestamp(getTimeFrameInMilliseconds(timeFrame));
		try{		
			deviceUsages =  GetAllDevicesAllUsage();
			for (DeviceUsage deviceUsage : deviceUsages) {
				if(deviceUsage.getTurnOnTime().compareTo(timeFrameInMilliseconds) >= 0 ){
					sum += deviceUsage.getTurnOffTime().getTime() - deviceUsage.getTurnOnTime().getTime();
				}
			}
		}
		catch (Exception ex){
			throw new Exception("An error has occured while trying to calculate the all usages of all the devices");
		}

		return sum;
	}

	public static JSONObject getDeviceSumVoltageStatistics(int deviceID, String timeFrame) throws Exception {
		long deviceSumWorkTime;
		Device device;
		double hours;
		JSONObject obj = new JSONObject();

		try{
			deviceSumWorkTime = getDeviceSumWorkTimeStatistics(deviceID, timeFrame);
			hours = translateConsumedTimeToHours(deviceSumWorkTime);
			device = DeviceHandler.getDevice(deviceID);			
			obj.put("device", device);
			obj.put("hours", hours);
		}
		catch(Exception ex){
			throw ex;
		}
		return obj;
	}

	private static double translateConsumedTimeToHours(long deviceSumWorkTime) {
		double minutes ;
		double hours  ;

		minutes = (double) ((deviceSumWorkTime / (MINUTES_IN_MILLISECONDS)) % 60);
		hours   = (double) ((deviceSumWorkTime / HOUR_IN_MILLISECONDS) % 24);
		return (hours +(minutes/100));
	}

	private static long getTimeFrameInMilliseconds(String timeFrame) throws Exception {
		long timeFrameInMilliseconds = 0;

		try{
			switch (timeFrame) {
			case "day":
				timeFrameInMilliseconds = DAY_OFFSET;
				break;
			case "week":
				timeFrameInMilliseconds = WEEK_OFFSET;
				break;
			case "month":
				timeFrameInMilliseconds = MONTH_30_OFFSET;
				break;
			default:
				if(timeFrameInMilliseconds == 0)
					throw new Exception("Couldn't retrieve the time frame in Milliseconds!");
			}	
		}
		catch (Exception ex){
			throw ex;
		}

		return timeFrameInMilliseconds;
	}
}
