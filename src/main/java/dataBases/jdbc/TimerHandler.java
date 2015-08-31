package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.dbutils.DbUtils;

import modelObjects.Device;
import modelObjects.Timer;
import modelObjects.User;
import utils.HouseControlTimerTask;
import utils.JDBCUtils;


public class TimerHandler {
	public static final String TIMER_DELETE_SUCCESS_MESSAGE = "The timer has been deleted";
	public static final String ON = "on";
	public static final String OFF = "off";
	public static final Object TIMER_UPDATE_SUCCESS_MESSAGE = "Timer was update successfully";

	public static Map<String, java.util.Timer> myTimers = new HashMap<String, java.util.Timer>();


	public static void addTimer(Timer timers) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		try{
			conn = DBConn.getConnection();
			String query = "INSERT into timer VALUES(?,?,?,?,?,?,?)";
			conn = DBConn.getConnection();	
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setNull(1, java.sql.Types.INTEGER);
			statement.setInt(2,timers.getDevice().getDeviceID());
			statement.setString(3, timers.getTimerName());
			statement.setInt(4, timers.getUser().getUserID());
			statement.setTimestamp(5, timers.getTurnOnTime());
			statement.setTimestamp(6, timers.getTurnOffTime());
			statement.setString(7, timers.getState().toString());
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("Timer was inserted with id:" + resultSet.getInt(1));
				if(timers.getState().equals(Timer.TimerState.Active)){
					addAndInsertOnOffTimers(timers, resultSet.getInt(1));
				}
			}
			else{
				throw new SQLException();
			}
		}
		catch(SQLException ex){
			JDBCUtils.checkIfDuplicate(ex);
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static Timer getTimerByID(int timerID) throws Exception{
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		Timer timer = null;

		try{
			String query = "SELECT * FROM timer WHERE timerID=" + timerID;
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if(resultSet.next()){
				timer = mapRow(resultSet);
			}
			else{
				throw new Exception("The timer you have requested doesn't exist");
			}
		}
		catch(SQLException ex){
			System.out.println("SQL error while trying to get timer");
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return timer;
	}

	private static Timer mapRow(ResultSet resultSet) throws SQLException {
		Timer timer = new Timer();
		Device device = new Device();
		User user = new User();

		timer.setTimerID(resultSet.getInt("timerID"));
		device.setDeviceID(resultSet.getInt("deviceID"));
		timer.setDevice(device);
		timer.setTimerName(resultSet.getString("timerName"));	
		user.setUserID(resultSet.getInt("userID"));
		timer.setUser(user);
		timer.setTurnOnTime(resultSet.getTimestamp("turnOnTime"));
		timer.setTurnOffTime(resultSet.getTimestamp("turnOffTime"));
		timer.setState(Timer.TimerState.valueOf(resultSet.getString("state")));

		return timer;
	}

	public static Boolean deleteTimerFromDB(int timerID) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;
		Boolean isDeleted = false;

		if(timerID<1)		{
			throw new Exception("Invalid timer to delete");
		}
		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM timer "
					+  "WHERE timerID =" + timerID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			int isSucceeded = statement.executeUpdate();
			if(isSucceeded > 0){
				System.out.println("Timer has been deleted");
				isDeleted = true;
			}
			else{
				throw new Exception("Deleting timer has failed");
			}
		}
		catch(SQLException ex){
			throw new Exception("Cannot delete timer");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		return isDeleted;
	}

	public static void deleteTimer(int timerID) throws Exception{
		try {
			if(deleteTimerFromDB(timerID))
			{
				CancelAndDeleteMyTimer(timerID, ON);
				CancelAndDeleteMyTimer(timerID, OFF);	
			}
		} 
		catch (Exception e) {
		}
	}

	private static void addAndInsertMyTimer(Timer timer, int timerID, String action) {
		java.util.Timer time=new java.util.Timer();
		if(action.equals(ON)){
			time.schedule(new HouseControlTimerTask(timer.getDevice().getDeviceID(), timerID , 1)
					, new java.sql.Date(timer.getTurnOnTime().getTime()));
		}
		else{
			time.schedule(new HouseControlTimerTask(timer.getDevice().getDeviceID(), timerID, 0)
					,new java.sql.Date(timer.getTurnOffTime().getTime()));
		}	
		myTimers.put(timerID + action, time);
	}

	public static void CancelAndDeleteMyTimer(int timerID, String action) throws Exception {
		try{
			if (myTimers.containsKey(timerID + action))
			{
				myTimers.get(timerID + action).cancel();
				myTimers.remove(timerID + action);
			}
		}
		catch(Exception ex){
			throw new Exception("An error has occured while trying cancel and delete timer");
		}
	}

	public static void updateTimer(Timer timer) throws Exception {
		if (timer.getTurnOnTime().after(new Timestamp(System.currentTimeMillis()))){
			updateTimerFromDB(timer);
		}
		else{
			timer.setTurnOnTime(null);
			updateTimerFromDB(timer);
		}
	}
	
	public static void updateTimerFromDB(Timer timer) throws Exception {
		Connection conn = null;
		PreparedStatement statement = null;

		if(timer == null){
			throw new Exception("An error has occured while trying update timer");
		}
		if(timer.getTimerID()<1){
			throw new Exception("Cannot update a timer that doesn't exist");
		}
		try{
			String query = "UPDATE timer "
					+"SET timerName=? ,turnOnTime =?,"
					+"turnOffTime = ? ,state = ? "
					+"WHERE timerID = " + timer.getTimerID();
			conn = DBConn.getConnection();
			conn.setAutoCommit(false);
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.clearParameters();
			statement.setString(1, timer.getTimerName());
			statement.setTimestamp(2, timer.getTurnOnTime());
			statement.setTimestamp(3, timer.getTurnOffTime());
			statement.setString(4, timer.getState().toString());

			int isSucceeded = statement.executeUpdate();
			if(isSucceeded == 0){
				throw new Exception("Failed to update timer");
			}
			CancelAndDeleteMyTimer(timer.getTimerID(), ON);
			CancelAndDeleteMyTimer(timer.getTimerID(), OFF);
			addAndInsertOnOffTimers(timer, timer.getTimerID());
			System.out.println("User has been updated");

			conn.commit();
		}
		catch(SQLException ex){
			conn.rollback();
			throw new Exception(ex);
		}
		finally{
			conn.setAutoCommit(true);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

	}


	public static List<Timer> getAllTimersByDeviceID(int deviceID) throws Exception {

		List<Timer> timers = new ArrayList<Timer>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		String query = "SELECT * "
				+ "FROM timer "
				+ "WHERE deviceID=" + deviceID;
		if(deviceID<1){
			throw new Exception("Please provide a valid device");
		}
		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				timers.add(mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get timers of device");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return timers;
	}

	private static List<Timer> getAllTimers () throws Exception {
		List<Timer> timers = new ArrayList<Timer>();
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		String query = "SELECT * "
				+ "FROM timer ";	
		try{
			conn = DBConn.getConnection();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			while(resultSet.next()){
				timers.add(mapRow(resultSet));
			}
		}
		catch (Exception e) {
			throw new Exception("Failed to get timers of all the devices");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}

		return timers;
	}

	public static void initilizeMyTimers() throws Exception {
		List<Timer> timers = new ArrayList<Timer>();

		try {
			timers = getAllTimers();
			for( Timer timer : timers){
				if (timer.getTurnOnTime().after( new Timestamp(System.currentTimeMillis()))){
					addAndInsertOnOffTimers(timer, timer.getTimerID());
				}
				else if(timer.getTurnOffTime().after( new Timestamp(System.currentTimeMillis()))){
					addAndInsertMyTimer(timer, timer.getTimerID(), OFF);
				}
				else{
					deleteTimerFromDB(timer.getTimerID());
				}
			}

		} catch (Exception ex) {

			throw new Exception("An error has occured while trying to initialize myTimers");
		}
	}
	private static void addAndInsertOnOffTimers(Timer timer, int timerID) {
		addAndInsertMyTimer(timer, timerID, ON);
		addAndInsertMyTimer(timer, timerID, OFF);
	}
}
