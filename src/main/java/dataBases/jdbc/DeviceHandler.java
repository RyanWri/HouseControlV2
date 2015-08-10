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
	
//	public void disconnectDevice(int deviceID) throws Exception{
//		Device device = getDevice(deviceID);
//		
//		if(device == null){
//			throw new Exception("Device wasn't supply");
//		}
//		if(device.getState().equals(Device.DeviceState.Inactive)){
//			throw new Exception("It's not possible disconnecting inactive device");
//		}
//		try{
//			if(device.getConnectionType().equals(Device.ConnectionType.Relay)){
//				
//			}
//		}
//	}

}
