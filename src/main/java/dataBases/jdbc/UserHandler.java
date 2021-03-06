package dataBases.jdbc;

import org.apache.commons.dbutils.DbUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import modelObjects.User;

public class UserHandler{
	public static final String USER_UPDATE_SUCCESS_MESSAGE = "User details has been updated";
	public static final String USER_UPDATE_DELETE_MESSAGE = "User has been deleted";
	public static final String USER_LOGOUT_SUCCESS_MESSAGE = "You have been logged out";
	public static final String USER_CHANGE_PASSWORD_SUCCESS_MESSAGE = "User password has been updated";
	public static final String USER_RESET_PASSWORD_SUCCESS_MESSAGE = "User password has been set to 'password'"  ;
	public static final String USER_DEFAULT_RESET_PASSWORD = "password";
	public static void insertNewUser(String username,String password,String firstname,String lastname, String email,String mobile) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(isMailAlreadyInUse(email)){
			throw new Exception("Email already in use");
		}
		if(isUsernameAlreadyInUse(username)){
			throw new Exception("Username already in use");
		}
		if(password.isEmpty() || firstname.isEmpty() || lastname.isEmpty()){
			throw new Exception("You have to fill all fields");
		}
		try{
			String query = "INSERT into user VALUES(?,?,?,?,?,?,?,?)";
			conn = DBConn.getConnection();
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setString(1, null);
			statement.setString(2, username);
			statement.setString(3, password);
			statement.setString(4, firstname);
			statement.setString(5, lastname);
			statement.setString(6, User.UserType.Regular.toString());
			statement.setString(7, email);
			statement.setString(8, mobile);
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
			throw new Exception("A problem has occured while trying adding the user");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static boolean isMailAlreadyInUse(String email) throws Exception{
		boolean isMailInUse = false;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		if(email.isEmpty()){
			throw new Exception("Email address hasn't been provided");
		}
		try{
			String query = "SELECT * FROM user WHERE email='" + email + "'";
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				isMailInUse = true;
				System.out.println("User's mail is already in use");
			}
		}
		catch(SQLException ex){
			System.out.println("SQL error while trying to check if user email already exists");
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return isMailInUse;
	}

	public static boolean isUsernameAlreadyInUse(String username) throws Exception{
		boolean isUsernameInUse = false;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		if(username.isEmpty()){
			throw new Exception("Username hasn't been provided");
		}
		try{
			String query = "SELECT * FROM user WHERE username='" + username + "'";
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				isUsernameInUse = true;
				System.out.println("Username is already in use");
			}
		}
		catch(SQLException ex){
			System.out.println("SQL error while trying to check if username already exists");
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return isUsernameInUse;
	}

	public static void updateUser(User user) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(user == null){
			throw new Exception("An error has occured while trying update user info");
		}
		if(user.getUserID()<1){
			throw new Exception("Cannot update a user that doesn't exist");
		}
		try{
			String query = "UPDATE user "
					+"SET firstname=? ,lastname =?,"
					+"email = ? ,mobile = ? "
					+"WHERE userID = " + user.getUserID();
			conn = DBConn.getConnection();
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setString(1, user.getFirstname());
			statement.setString(2, user.getLastname());
			statement.setString(3, user.getEmail());
			statement.setString(4, user.getMobile());

			int isSucceeded = statement.executeUpdate();
			if(isSucceeded == 0){
				throw new Exception("Failed to update user details");
			}
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("User has been updated");
			}
			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception("A problem has occured while trying updating user details");
		}
		finally{
			conn.setAutoCommit(true);
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
	
	public static void resetUserPassword(int userID,String newPassword) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(newPassword.isEmpty()){
			throw new Exception("Please provide and new password");
		}
		if(userID<1){
			throw new Exception("Cannot update a user that doesn't exist");
		}
		try{
			String query = "UPDATE user "
					+"SET password=? "
					+"WHERE userID = " + userID;
			conn = DBConn.getConnection();
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setString(1, newPassword);

			int isSucceeded = statement.executeUpdate();
			if(isSucceeded == 0){
				throw new Exception("Failed to reset password");
			}
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("User password has been set to 'password'");
			}
		}
		catch(SQLException ex){
			throw new Exception("A problem has occured while trying reset user password");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static void changeUserPassword(int userID,String oldPassword,String newPassword) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		if(oldPassword.isEmpty() || newPassword.isEmpty()){
			throw new Exception("Please provide your old and new password");
		}
		if(userID<1){
			throw new Exception("Cannot update a user that doesn't exist");
		}
		try{
			User user = getUserByUserID(userID);
			if(!user.getPassword().equals(oldPassword)){
				throw new Exception("Your current password is wrong");
			}
			String query = "UPDATE user "
					+"SET password=? "
					+"WHERE userID = " + userID;
			conn = DBConn.getConnection();
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setString(1, newPassword);

			int isSucceeded = statement.executeUpdate();
			if(isSucceeded == 0){
				throw new Exception("Failed to update user password");
			}
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("User password has been updated");
			}
		}
		catch(SQLException ex){
			throw new Exception("A problem has occured while trying updating user password");
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static void deleteUser(int userID) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;

		if(userID<1)
		{
			throw new Exception("Invalid user to delete");
		}

		try{
			User user = getUserByUserID(userID);
			if(user == null){
				throw new Exception("Cannot delete a user which doesn't exist ");
			}
			else{
				if(user.getUsername().equals("admin")){
					throw new Exception("Cannot delete admin user");
				}
			}
			conn = DBConn.getConnection();
			String query = "DELETE FROM user "
					+  "WHERE userID =" + userID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded < 1){
				throw new Exception("Can't delete a user which doesn't exist");
			}
			System.out.println("User has been deleted");
			
		}
		catch(SQLException ex){
			throw new Exception("Cannot delete user");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static User getUserByUsername(String username) throws Exception{
		User user = null;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		String query = "SELECT *"
				+ " FROM user"
				+ " WHERE user.username ='" + username +"'";

		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				user = mapRow(resultSet,false);
			}
			else{
				throw new Exception("User doesn't exist");
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

		return user;
	}
	
	private static User getUserByUserID(int userID) throws Exception{
		User user = null;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		String query = "SELECT *"
				+ " FROM user"
				+ " WHERE user.userID =" + userID;

		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				user = mapRow(resultSet,false);
			}
			else{
				throw new Exception("The user you have provided doesn't exist");
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

		return user;
	}
	
	protected static boolean isUserExists(int userID){
		boolean isUserExists = false;
		try{
			if(getUserByUserID(userID)!=null){
				isUserExists = true;
			}
		}
		catch(Exception ex){
			isUserExists = false;
		}

		return isUserExists;
	}

	protected static User mapRow(ResultSet rs,boolean hidePassword) throws SQLException{
		User user = new User();
		String password ;
		if(hidePassword){
			password = "********";
		}
		else{
			password = rs.getString("password");
		}
		user.setUserID(Integer.parseInt(rs.getString("userID")));
		user.setUsername(rs.getString("username"));
		user.setFirstname(rs.getString("firstname"));
		user.setLastname(rs.getString("lastname"));
		user.setPassword(password);
		user.setEmail(rs.getString("email"));
		user.setMobile(rs.getString("mobile"));
		user.setType(User.UserType.valueOf(rs.getString("type")));	

		return user;
	}
	
	public static List<User> getAllUsers() throws Exception{
		List<User> users =  new ArrayList<User>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		
		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+ "FROM user";
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				users.add(UserHandler.mapRow(resultSet,true));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get users list");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		
		return users;
 	}
}
