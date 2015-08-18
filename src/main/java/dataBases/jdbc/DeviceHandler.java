package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import modelObjects.Device;
import modelObjects.Device.ConnectionType;
import modelObjects.Device.DeviceState;
import modelObjects.DeviceType;

import org.apache.commons.dbutils.DbUtils;

public class DeviceHandler{
	public static final String DEVICE_ADD_SUCCESS_MESSAGE = "Device has been added successfully";

	public static void addDevice(Device device) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		try{
			conn = DBConn.getConnection();
			String query = "INSERT into device VALUES(?,?,?,?,?,?,?)";
			conn = DBConn.getConnection();	
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setNull(1, java.sql.Types.INTEGER);
			statement.setString(2, device.getName());
			statement.setString(3,device.getDescription());
			statement.setInt(4, device.getDeviceType().getTypeID());
			statement.setString(5, device.getConnectionType().toString());
			statement.setFloat(6, device.getVoltage());
			statement.setString(7, DeviceState.Inactive.toString());
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("User was inserted with id:" + resultSet.getInt(1));
			}
			else{
				throw new SQLException();
			}
		}
		catch(SQLException ex){
			throw new Exception("An error has occured when trying add a new device");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
	
	public static void updateDeviceState(int deviceID, Device.DeviceState deviceState) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;


		if(deviceID<1)		{
			throw new Exception("Invalid device to update");
		}
		try{
			conn = DBConn.getConnection();
			String query = "UPDATE device "
					+  "SET state = ? "
					+  "WHERE deviceID =" + deviceID;
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, deviceState.toString());
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded== 0){
				throw new Exception("Failed to update the requested device");
			}
			System.out.println("Device has been updated");
			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception("Cannot update device");
		}
		finally{
			conn.setAutoCommit(true);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
	
//	public static void updateDevice(DeviceType deviceType) throws Exception{	
//		Connection conn = null;
//		PreparedStatement statement = null;
//
//		if (deviceType == null){
//			throw new Exception("Information is missing");
//		}
//		if(deviceType.getTypeID()<1)		{
//			throw new Exception("Invalid device type to update");
//		}
//		if(deviceType.getName().isEmpty()){
//			throw new Exception("Devices group name cannot be empty");
//		}
//		try{
//			conn = DBConn.getConnection();
//			String query = "UPDATE device_type "
//					+  "SET name = ?, picData = ? "
//					+  "WHERE typeID =" + deviceType.getTypeID();
//			conn.setAutoCommit(false);
//			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
//			statement.setString(1, deviceType.getName());
//			statement.setString(2, deviceType.getPicData());
//			int isSucceeded = statement.executeUpdate();
//			if(isSucceeded== 0){
//				throw new Exception("Failed to update the requested devices type");
//			}
//			System.out.println("Device type has been updated");
//			conn.commit();
//		}
//		catch(SQLException ex){
//			conn.rollback();
//			throw new Exception("Cannot update device type");
//		}
//		finally{
//			conn.setAutoCommit(true);
//			DbUtils.closeQuietly(statement);
//			DbUtils.closeQuietly(conn);
//		}
//	}

	public static Device getDevice(int deviceID) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		Device device = null;

		if(deviceID <1){
			throw new Exception("Please provide a valid device");
		}

		try{
			conn = DBConn.getConnection();
			String query = "SELECT device.*,device_type.* "
					+"FROM device,device_type "
					+"WHERE device.deviceID=" +deviceID + " and device.typeID=device_type.typeID ";
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				device = mapRow(resultSet);
				System.out.println("Getting device " + deviceID);
			}
			else{
				throw new Exception("Device with id: " + deviceID + " doesn't exist");
			}	
		}
		catch(SQLException ex){
			throw new Exception("An error has occured while trying to get device " + deviceID);
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return device;
	}
	
	protected static Device mapRow(ResultSet resultSet) throws SQLException{		
		Device device = new Device();

		device.setDeviceID(resultSet.getInt("device.deviceID"));
		device.setName(resultSet.getString("device.name"));
		device.setDescription(resultSet.getString("device.description"));
		DeviceType deviceType = DeviceTypeHander.mapRow(resultSet);
		device.setDeviceType(deviceType);
		device.setConnectionType(ConnectionType.valueOf(resultSet.getString("device.connectionType")));
		device.setVoltage(resultSet.getFloat("device.voltage"));
		device.setState(DeviceState.valueOf(resultSet.getString("device.state")));

		return device;
	}
	
	public static List<Device> getAllDevicesIDs() throws Exception {
		List<Device> devices =  new ArrayList<Device>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		
		
		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+"FROM device";			
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				Device device = new Device();
				device.setDeviceID(resultSet.getInt("deviceID"));
				devices.add(device);
			}
		}
		catch (Exception ex) {
			throw new Exception("Failed to get all devices list");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		
		return devices;
	}

	public static List<Device> getAllDevices() throws Exception {
		List<Device> devices = new ArrayList<Device>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		try{
			conn = DBConn.getConnection();
			String query = "SELECT device.*,device_type.* "
			+"FROM device,device_type "
			+"WHERE device.typeID=device_type.typeID";
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				devices.add(mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get deviceslist");
		}
		finally{
			DbUtils.close(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		
		return devices;
	}
	
	public static List<Device> getTurnedOnDevicesByUserID(int userID) throws Exception{
		String query = "SELECT device.*,device_type.* "
				+"FROM device "
				+"JOIN device_usage on device_usage.deviceID = device.deviceID "
				+"JOIN device_in_group on device_in_group.deviceID = device.deviceID "
				+"JOIN device_type on device_type.typeID = device.typeID "
				+"JOIN user_in_group on user_in_group.userID =" + userID + " "
				+"WHERE device_in_group.groupID = user_in_group.groupID "
				+"AND device.typeID=device_type.typeID "
				+"AND device_usage.turnOffTime IS NULL";
				
		List<Device> devices = new ArrayList<Device>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		
		if(!UserHandler.isUserExists(userID)){
			throw new Exception("User doesn't exist");
		}
		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				devices.add(mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get deviceslist");
		}
		finally{
			DbUtils.close(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		
		return devices;
	}
	
}
