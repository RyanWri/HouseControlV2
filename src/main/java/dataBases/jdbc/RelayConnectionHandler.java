package dataBases.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import modelObjects.Device;
import modelObjects.Device.ConnectionType;
import modelObjects.RelayConnection;

import org.apache.commons.dbutils.DbUtils;

public class RelayConnectionHandler {
	public static int PORT_NOT_CONNECTED = 0;
	public static final String RELAY_CONNECTION_UPDATE_RELAY_PORT_SUCCESS_MESSAGE = "The device was connected successfully to the relay port";
	public static final String RELAY_CONNECTION_INIT_RELAY_PORTS_SUCCESS_MESSAGE = "Relay ports were initiallized successfully";
	
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
			for (int i=1 ; i<=4 ; i++){
				pst = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
				pst.setInt(1,i);
				pst.setNull(2, java.sql.Types.INTEGER);
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
	
	public static void connectToRelayPort(RelayConnection relayConnection) throws Exception{
		updateRelayPort(relayConnection.getDevice().getDeviceID(), relayConnection.getRelayPort());
	}
	
	protected static void clearRelayPort(int relayPort) throws Exception{
		updateRelayPort(PORT_NOT_CONNECTED,relayPort);
	}
		
	//if deviceID = 0 ,this means we want to remove the device from the port
	private static void updateRelayPort(int deviceID,int relayPort) throws Exception{
		Connection conn = null;
		PreparedStatement statement = null;
		boolean setDeviceIDToNull = false;
		
		try{
			if (relayPort < 1){
				throw new Exception("Relay port hasn't been provided");
			}
			if(deviceID == PORT_NOT_CONNECTED){
				setDeviceIDToNull=true;
			}
			else{
				Device device = DeviceHandler.getDevice(deviceID);
				if( !device.getConnectionType().equals(ConnectionType.Relay)){
					throw new Exception("Cannot connect a device which it's connection type isn't relay ");
				}
			}
			conn = DBConn.getConnection();
			String insertSql = "UPDATE relay_connection "
							  +"Set relayPort = ? , deviceID = ? "
							  +"WHERE relayPort=" + relayPort;
			statement = conn.prepareStatement(insertSql,Statement.RETURN_GENERATED_KEYS);
			statement.setInt(1, relayPort);
			if(setDeviceIDToNull){
				statement.setNull(2, java.sql.Types.INTEGER);
			}
			else{
				statement.setInt(2, deviceID);
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
}
