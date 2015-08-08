package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import modelObjects.DevicesGroup;
import modelObjects.User;

import org.apache.commons.dbutils.DbUtils;

public class UserInGroupHandler{

	public static final String USER_IN_GROUP_ADD_SUCCESS_MESSAGE = "User has been added to group";
	public static final String USER_IN_GROUP_REMOVE_SUCCESS_MESSAGE = "User has been removed from group";

	public static void addUserToDeviceGroup(int userID,int deviceGroupID) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;	

		if(userID < 1 || deviceGroupID<1){
			throw new Exception("User or device group hasn't been provided");
		}
		try{
			conn = DBConn.getConnection();
			String insertSql = "INSERT into user_in_group VALUES(?,?)";
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setInt(1, userID);
			statement.setInt(2, deviceGroupID);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded>0) {
				System.out.println("User " + userID + " has been added to group " + deviceGroupID + " successfully");
			}
			else{
				throw new Exception("A problem has occured while trying adding the user " + userID +  " to the group " + deviceGroupID);
			}
		}
		catch(SQLException ex){
			System.err.println(ex.getMessage());
			throw new Exception("A problem has occured while trying adding the user " + userID +  " to the group " + deviceGroupID);
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

	}

	public static void removeUserFromDeviceGroup(int userID,int deviceGroupID) throws Exception{

		Connection conn = null;
		PreparedStatement statement = null;

		if(userID < 1 || deviceGroupID<1){
			throw new Exception("User or device group hasn't been provided");
		}

		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM user_in_group "
					+  "WHERE groupID =" + deviceGroupID + " and userID=" + userID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded>0) {
				System.out.println("User " + userID + " has been removed from group " + deviceGroupID);
			}
			else{
				throw new Exception("Couldn't remove user " + userID + " from group " + deviceGroupID);
			}
		}
		catch(SQLException ex){
			throw new Exception("Couldn't remove user " + userID + " from group " + deviceGroupID);
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static List<User> getAuthorizedUsersOfDevicesGroup(int groupID) throws Exception{
		List<User> users = new ArrayList<User>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		if(groupID<1){
			throw new Exception("Please provide a valid group");
		}
		try{
			conn = DBConn.getConnection();
			String query = "SELECT user.* "
					+ "FROM user,user_in_group "
					+ "WHERE user.userID = user_in_group.userID and user_in_group.groupID=" +groupID;
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				users.add(UserHandler.mapRow(resultSet,true));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get users in group");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return users;
	}

	public static List<DevicesGroup> getDevicesGroupsUserIsMemberOf(int userID) throws Exception{
		List<DevicesGroup> devicesGroups = new ArrayList<DevicesGroup>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		if(userID<1){
			throw new Exception("Please provide a valid user");
		}
		try{
			conn = DBConn.getConnection();
			String query = "SELECT devices_group.* "
					+ "FROM devices_group,user_in_group "
					+ "WHERE user_in_group.userID =" + userID 
					+ " and user_in_group.groupID=devices_group.groupID" ;
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				devicesGroups.add(DevicesGroupHandler.mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get devices groups of a user");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return devicesGroups;
	}
	
}
