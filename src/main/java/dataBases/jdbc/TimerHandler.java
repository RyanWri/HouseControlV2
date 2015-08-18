package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;




import modelObjects.Device;
import modelObjects.Timer;
import modelObjects.User;

import org.apache.commons.dbutils.DbUtils;

public class TimerHandler {
	public static final String TIMER_DELETE_SUCCESS_MESSAGE = "The timer has been deleted";

	
	public static void addTimer(Timer timer) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;

		try{
			conn = DBConn.getConnection();
			String query = "INSERT into timer VALUES(?,?,?,?,?,?,?,?)";
			conn = DBConn.getConnection();	
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.setNull(1, java.sql.Types.INTEGER);
			statement.setInt(2,timer.getTimerID());
			statement.setString(3, timer.getTimerName());
			statement.setInt(4, timer.getUser().getUserID());
			statement.setTimestamp(5, timer.getTurnOnTime());
			statement.setTimestamp(5, timer.getTurnOffTime());
			statement.setString(7, Timer.TimerState.Active.toString());
			statement.executeUpdate();
			resultSet = statement.getGeneratedKeys();
			if (resultSet != null && resultSet.next()) {
				System.out.println("Timer was inserted with id:" + resultSet.getInt(1));
			}
			else{
				throw new SQLException();
			}
		}
		catch(SQLException ex){
			throw new Exception("An error has occured when trying add a new timer");
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

	protected static Timer mapRow(ResultSet resultSet) throws SQLException {
		Timer timer = new Timer();
		Device device = new Device();
		User user = new User();
		
		timer.setTimerID(resultSet.getInt("timerID"));
		device.setDeviceID(resultSet.getInt("deviceID"));
		timer.setDevice(device);
		timer.setTimerName("timerName");	
		user.setUserID(resultSet.getInt("userID"));
		timer.setUser(user);
		timer.setTurnOnTime(resultSet.getTimestamp("turnOnTime"));
		timer.setTurnOffTime(resultSet.getTimestamp("turnOffTime"));
		timer.setState(Timer.TimerState.valueOf(resultSet.getString("state")));
			
		return timer;
	}
	
	public static void deleteTimer(int timerID) throws Exception{	

		Connection conn = null;
		PreparedStatement statement = null;

		if(timerID<1)		{
			throw new Exception("Invalid timer to delete");
		}
		try{
			conn = DBConn.getConnection();
			String query = "DELETE FROM timer "
					+  "WHERE timerID =" + timerID;
			statement = conn.prepareStatement(query,Statement.RETURN_GENERATED_KEYS);
			statement.executeUpdate();
			System.out.println("Timer has been deleted");
		}
		catch(SQLException ex){
			throw new Exception("Cannot delete timer");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
	
	
	
	//getalltimers of device (by specific user or of all)
}
