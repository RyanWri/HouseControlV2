package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.dbutils.DbUtils;

import modelObjects.DevicesGroup;

public class DevicesGroupHandler {
	private static final int DEVICES_GROUP_ERROR_CODE = -1;
	public static final String DEVICES_GROUP_CREATE_SUCCESS_MESSAGE = "The devices group has been created successfully";
	public static final String DEVICES_GROUP_UPDATE_SUCCESS_MESSAGE = "The devices group has been updated";
	public static final String DEVICES_GROUP_DELETE_SUCCESS_MESSAGE = "The devices group has been deleted";
	
	public static void insertNewGroup(String groupName, String picData) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		int groupID = DEVICES_GROUP_ERROR_CODE;

		try{
			conn = DBConn.getConnection();
			String insertSql = "INSERT into devices_group VALUES(?,?,?)";
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, null);
			statement.setString(2, groupName);
			statement.setString(3, picData);
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				groupID = resultSet.getInt(1);
				System.out.println("Devices group was inserted with id:" + groupID);
			}
			else{
				throw new Exception("A problem has occured while trying adding the devices group");
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

	public static void updateGroup(DevicesGroup devicesGroup) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;
		
		if (devicesGroup == null){
			throw new Exception("Information is missing");
		}
		if(devicesGroup.getGroupID()<1)		{
			throw new Exception("Invalid device group to update");
		}
		if(devicesGroup.getGroupName().isEmpty()){
			throw new Exception("Devices group name cannot be empty");
		}
		try{
			 conn = DBConn.getConnection();
			String query = "UPDATE devices_group "
					+  "SET name = ?, picData = ? "
					+  "WHERE groupID =" + devicesGroup.getGroupID();
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, devicesGroup.getGroupName());
			statement.setString(2, devicesGroup.getPicData());
			statement.executeUpdate();
			System.out.println("Devices group has been updated");
			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception("Cannot update device group");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
			conn.setAutoCommit(true);
		}
	}
	
	public static void deleteDevicesGroup(int devicesGroupID) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;
		
		if(devicesGroupID<1)		{
			throw new Exception("Invalid device group to delete");
		}
		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM devices_group "
					+  "WHERE groupID =" + devicesGroupID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.executeUpdate();
			System.out.println("Devices group has been deleted");
		}
		catch(SQLException ex){
			throw new Exception("Cannot delete device group");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

}
