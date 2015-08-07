package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import modelObjects.DeviceType;

import org.apache.commons.dbutils.DbUtils;

public class DeviceTypeHander {
	public static final String DEVICES_TYPE_CREATE_SUCCESS_MESSAGE = "The device type has been created successfully";
	public static final String DEVICES_TYPE_UPDATE_SUCCESS_MESSAGE = "The device type has been updated";
	public static final String DEVICES_TYPE_DELETE_SUCCESS_MESSAGE = "The device type has been deleted";

	public static void insertNewDeviceType(String deviceTypeName,String picData) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		int deviceTypeID ;

		try{
			conn = DBConn.getConnection();
			String insertSql = "INSERT into device_type VALUES(?,?,?)";
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, null);
			statement.setString(2, deviceTypeName);
			statement.setString(3, picData);
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				deviceTypeID = resultSet.getInt(1);
				System.out.println("Device type was inserted with id:" + deviceTypeID);
			}
			else{
				throw new Exception("A problem has occured while trying adding a new device type");
			}
		}
		catch(SQLException ex){
			System.err.println(ex.getMessage());
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

	}

	public static void updateDeviceType(DeviceType deviceType) throws Exception{	
		Connection conn = null;
		PreparedStatement statement = null;

		if (deviceType == null){
			throw new Exception("Information is missing");
		}
		if(deviceType.getTypeID()<1)		{
			throw new Exception("Invalid device type to update");
		}
		if(deviceType.getName().isEmpty()){
			throw new Exception("Devices group name cannot be empty");
		}
		try{
			conn = DBConn.getConnection();
			String query = "UPDATE device_type "
					+  "SET name = ?, picData = ? "
					+  "WHERE typeID =" + deviceType.getTypeID();
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, deviceType.getName());
			statement.setString(2, deviceType.getPicData());
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded== 0){
				throw new Exception("Failed to update the requested devices type");
			}
			System.out.println("Device type has been updated");
			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception("Cannot update device type");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
			conn.setAutoCommit(true);
		}
	}

	public static void deleteDeviceType(int deviceTypeID) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;

		if(deviceTypeID<1)		{
			throw new Exception("Invalid device type to delete");
		}
		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM device_type "
					+  "WHERE typeID =" + deviceTypeID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.executeUpdate();
			System.out.println("Device Type has been deleted");
		}
		catch(SQLException ex){
			throw new Exception("Cannot delete device type");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

}
