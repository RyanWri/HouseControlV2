package dataBases.jdbc;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class DBHandler {

	public static void createTables() throws SQLException {
		Connection conn = DBConn.getConnection();

		System.out.println("Got DBConn, starting to create the tabels");

		try (Statement sqlSatement = conn.createStatement()) {
			createDeviceTypeTable();
			createDeviceTable();
			createGroupTable();
			createRelayConnectionTable();
			createUserTable();
			createUserInGroupTable();
			createDeviceInGroupTable();
			createTimerTable();
			createDeviceUsageTable();
		} catch (SQLException ex) {
			System.err.println(ex.getMessage());
			throw ex;
		}
	}

	private static void createDeviceUsageTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createTimerTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createDeviceInGroupTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createUserInGroupTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createUserTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createRelayConnectionTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createGroupTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createDeviceTypeTable() {
		// TODO Auto-generated method stub
		
	}

	private static void createDeviceTable() {
		// TODO Auto-generated method stub
		
	}
}
