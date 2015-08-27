package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.DbUtils;

import utils.JDBCUtils;
import modelObjects.Device;

public class DeviceInGroupHandler{
	public static final String DEVICE_IN_GROUP_ADD_SUCCESS_MESSAGE = "Device has been added to group";
	public static final String DEVICE_IN_GROUP_REMOVE_SUCCESS_MESSAGE = "Device has been removed from group";

	
	public static void addDeviceToDevicesGroup(int deviceID,int devicesGroupID) throws Exception {
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;	

		if(deviceID < 1 || devicesGroupID<1){
			throw new Exception("device or device group hasn't been provided");
		}
		try{
			conn = DBConn.getConnection();
			String insertSql = "INSERT into device_in_group VALUES(?,?)";
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setInt(1, deviceID);
			statement.setInt(2, devicesGroupID);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded>0) {
				System.out.println("Device " + deviceID + " has been added to group " + devicesGroupID + " successfully");
			}
		}
		catch(SQLException ex){
			JDBCUtils.checkIfDuplicate(ex);
//			throw new Exception("A problem has occured while trying adding the device " + deviceID +  " to the group " + devicesGroupID);
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
	
	public static void removeDeviceFromDevicesGroup(int deviceID,int deviceGroupID) throws Exception{

		Connection conn = null;
		PreparedStatement statement = null;

		if(deviceID < 1 || deviceGroupID<1){
			throw new Exception("Device or device group hasn't been provided");
		}

		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM device_in_group "
					+  "WHERE groupID=" + deviceGroupID + " and deviceID=" + deviceID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded>0) {
				System.out.println("Device " + deviceID + " has been removed from devices group " + deviceGroupID);
			}
			else{
				throw new Exception("Couldn't remove device " + deviceID + " from group " + deviceGroupID);
			}
		}
		catch(SQLException ex){
			throw new Exception("Couldn't remove device " + deviceID + " from group " + deviceGroupID);
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static List<Device> getAllDevicesOfDevicesGroupByID(int devicesGroupID) throws Exception{
		List<Device> devices = new ArrayList<Device>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		String query = "SELECT device.* ,device_type.* "
					 + "FROM device,device_in_group,device_type "
					 + "WHERE device.deviceID = device_in_group.deviceID and device_type.typeID=device.typeID and device_in_group.groupID="+ devicesGroupID;
		if(devicesGroupID<1){
			throw new Exception("Please provide a valid group");
		}
		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				devices.add(DeviceHandler.mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get devices in group");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return devices;
	}
	
	

}
