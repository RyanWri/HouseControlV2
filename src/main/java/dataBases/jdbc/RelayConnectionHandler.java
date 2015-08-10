package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import modelObjects.Device;
import modelObjects.RelayConnection;
import modelObjects.RelayConnection.PortState;
import utils.PiGpio;
import org.apache.commons.dbutils.DbUtils;

public class RelayConnectionHandler{
	public static final int DISCONNECTED_DEVICE = -1;
	public static final String RELAY_CONNECTION_UPDATE_RELAY_PORT_SUCCESS_MESSAGE = "The device was connected successfully to the relay port";
	public static final String RELAY_CONNECTION_INIT_RELAY_PORTS_SUCCESS_MESSAGE = "Relay ports were initiallized successfully";
	public static final int PIN_NOT_CONNECTED = -1;
	public static void initRelayPorts() throws Exception{
		Connection conn = null;
		Statement statement = null;
		PreparedStatement pst = null;
		try{
			conn = DBConn.getConnection();
			//			String query = "DELETE * FROM relay_connection";
			//			statement = conn.createStatement();
			//			int isSucceeded = statement.executeUpdate(query);
			//			if(isSucceeded > 0){
			//				System.out.println("Table relay connection has been cleared");
			//			}
			//			else{
			//				System.out.println("A problem has occured while trying initialize relay_connection table");
			//				throw new SQLException();
			//			}

			String insertSql = "INSERT into relay_connection VALUES(?,?)";
			for (int i=0 ; i<=3 ; i++){
				pst = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
				pst.setInt(1,i);
				pst.setNull(2, java.sql.Types.INTEGER);
				pst.setInt(3, PIN_NOT_CONNECTED);
				pst.setString(4, RelayConnection.PortState.Disabled.toString());
				pst.executeUpdate();
				pst.clearParameters();
			}
		}
		catch(SQLException ex){
			throw new Exception("A problem has occured while trying to initialize relay ports");
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(pst);
			DbUtils.closeQuietly(conn);
		}
	}

	public static void connectDeviceToRelay(int relayPort,int deviceID) throws Exception{
		try{
			if (isRelayPortAvailable(relayPort)){
				updateDeviceToRelayPort(relayPort, deviceID);
			}
			else{
				throw new Exception("Another device is already connected to this port");
			}
		}
		catch (Exception ex) {
			throw ex;
		}
	}

	private static boolean isRelayPortAvailable(int relayPort) throws Exception{
		boolean isAvailable = true;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;

		try{
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+  "FROM relay_connection "
					+  "WHERE relay_connection.relayPort ="+ relayPort ;
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if (resultSet!= null && resultSet.next()){
				RelayConnection relayConnection = mapRow(resultSet);
				if (relayConnection.getDevice().getDeviceID() > 0)
				{
					isAvailable = false;
				}
			}
			else{
				throw new Exception("Relay port doesn't exist!");
			}
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		
		return isAvailable;
	}

	private static RelayConnection mapRow(ResultSet resultSet) throws SQLException {
		RelayConnection relayConnection = new RelayConnection();
		Device device = new Device();

		relayConnection.setRelayPort(resultSet.getInt("relayPort"));
		device.setDeviceID(resultSet.getInt("deviceID"));
		relayConnection.setDevice(device);
		relayConnection.setPinNumber(resultSet.getInt("pinNumber"));		
		relayConnection.setState(RelayConnection.PortState.valueOf(resultSet.getString("portState")));
		return relayConnection;
	}

	//if deviceID = 0 ,this means we want to remove the device from the port
	private static void updateDeviceToRelayPort(int relayPort,int deviceID) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		boolean setDeviceIDToNull = false;

		if(deviceID == DISCONNECTED_DEVICE){
			setDeviceIDToNull = true;
		}

		try{
			conn = DBConn.getConnection();
			String insertSql = "UPDATE relay_connection "
					+"Set deviceID = ?, portState = ? "
					+"WHERE relayPort=" + relayPort;
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setInt(1, deviceID);
			if(setDeviceIDToNull){
				statement.setNull(1, java.sql.Types.INTEGER);
				statement.setString(2, RelayConnection.PortState.Disabled.toString());
			}
			else{
				statement.setInt(1, deviceID);
				statement.setString(2, RelayConnection.PortState.Off.toString());
			}

			int isSucceeded = statement.executeUpdate();
			if (isSucceeded > 0) {
				System.out.println("The device " + deviceID + " has been connected to relay port " + relayPort);
			}
			else{
				throw new Exception("A problem has occured while trying to connect a device to the relay");
			}
		}
		catch(SQLException ex){
			System.err.println(ex.getMessage());
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}

	public static RelayConnection[] initRpiPinsFromDB() throws Exception{
		RelayConnection[] relayConnection = new RelayConnection[PiGpio.NUMBER_OF_PINS_IN_RPI];
		RelayConnection tempRelayConnection;
		Device tempDevice;
		Connection conn = null;
		Statement statement = null;
		ResultSet resultSet = null;
		try{
			for (int i=0; i<PiGpio.NUMBER_OF_PINS_IN_RPI; i++){
				tempDevice = new Device();
				tempRelayConnection = new RelayConnection();
				tempDevice.setDeviceID(0);
				tempRelayConnection.setDevice(tempDevice);
				tempRelayConnection.setRelayPort(i);
				tempRelayConnection.setPinNumber(i);
				tempRelayConnection.setState(PortState.Disabled);
				relayConnection[i] = tempRelayConnection;
			}
			conn = DBConn.getConnection();
			String query = "SELECT * "
					+  "FROM relay_connection ";
			statement = conn.createStatement();
			resultSet = statement.executeQuery(query);
			if (resultSet!= null ){
				while (resultSet.next()){
					RelayConnection mappedRelayConnection = mapRow(resultSet);
					if (mappedRelayConnection.getDevice().getDeviceID() > 0 && mappedRelayConnection.getState() != PortState.Disabled)
					{
						relayConnection[mappedRelayConnection.getPinNumber()].setDevice(mappedRelayConnection.getDevice());
						relayConnection[mappedRelayConnection.getPinNumber()].setPinNumber(mappedRelayConnection.getPinNumber());
						relayConnection[mappedRelayConnection.getPinNumber()].setRelayPort(mappedRelayConnection.getRelayPort());
						relayConnection[mappedRelayConnection.getPinNumber()].setState(mappedRelayConnection.getState());
					}
				}
			}
			else{
				throw new Exception("Couldn't initialize RPi pins from DB!");
			}
		}
		catch(Exception ex){
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(resultSet);
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
		return relayConnection;
	}
	
	public static void setDeviceOnOrOffInTheDB(int deviceID, int relayPort, PortState state) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		
		try{
			if(relayPort < 0 || deviceID < 0){
				throw new Exception("A problem has occured while trying to destroy");		
			}
			conn = DBConn.getConnection();
			String insertSql = "UPDATE relay_connection "
					+"Set portState = ? "
					+"WHERE relayPort=" + relayPort + " AND deviceID="+deviceID;
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setString(1, state.toString());
			int isSucceeded = statement.executeUpdate();
			if (isSucceeded > 0) {
				System.out.println("The device " + deviceID + " has been toggled to " + state +" state!");
			}
			else{
				throw new Exception("A problem has occured while trying to toggle the device state in the DB");
			}
		}
		catch(SQLException ex){
			System.err.println(ex.getMessage());
			throw ex;
		}
		finally{
			DbUtils.closeQuietly(statement);
			DbUtils.closeQuietly(conn);
		}
	}
}
