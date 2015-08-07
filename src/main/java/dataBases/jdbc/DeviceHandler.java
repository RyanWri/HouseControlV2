package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import modelObjects.Device;
import modelObjects.Device.ConnectionType;
import modelObjects.Device.DeviceState;
import modelObjects.DeviceType;

import org.apache.commons.dbutils.DbUtils;

public class DeviceHandler {
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
			String query = "SELECT * "
					+"FROM device "
					+"WHERE deviceID=" +deviceID;
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
	

	private static Device mapRow(ResultSet resultSet) throws SQLException{		
		Device device = new Device();

		device.setDeviceID(resultSet.getInt("deviceID"));
		device.setName(resultSet.getString("name"));
		device.setDescription(resultSet.getString("description"));
		DeviceType deviceType = new DeviceType();
		deviceType.setTypeID(resultSet.getInt("typeID"));
		device.setDeviceType(deviceType);
		device.setConnectionType(ConnectionType.valueOf(resultSet.getString("connectionType")));
		device.setVoltage(resultSet.getFloat("voltage"));
		device.setState(DeviceState.valueOf(resultSet.getString("state")));

		return device;
	}
	
	public void disconnectDevice(int deviceID) throws Exception{
		Device device = getDevice(deviceID);
	}

}
