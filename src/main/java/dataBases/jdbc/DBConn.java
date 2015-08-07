package dataBases.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;


//  Holds connection to DB Mysql. Singletone
 
public class DBConn {
	static Connection conn;
	// User name and pwd only for local testing
	private static final String USER_NAME	= "root";
	private static final String PASSWORD	= "password";

	// Static initialization block
	static
	{
		openConnection();
	}

	
	//Open and initialize connection to MySQL db
	 
	private static void openConnection() {
		try
		{
			System.out.println("Loading the driver...");
			Class.forName("com.mysql.jdbc.Driver");
			System.out.println("Loading successed ---------------");

			// Create database if non exists
			Connection tempConn = null;
			System.out.println("Creating database `hc_db` if non exists");
			try {
				String url = "jdbc:mysql://localhost/";
				tempConn = DriverManager.getConnection(url, USER_NAME, PASSWORD);
				Statement stmt = tempConn.createStatement();
				String sql = "CREATE DATABASE IF NOT EXISTS hc_db;";
				stmt.executeUpdate(sql);
				System.out.println("Creating database successed");
			} finally {
				if (tempConn != null) {
					tempConn.close();
				}
			}
			String url = "jdbc:mysql://localhost/hc_db?useUnicode=yes&characterEncoding=UTF-8";
			System.out.println("Connected local host url=" + url);
			conn= DriverManager.getConnection(url, USER_NAME, PASSWORD);
			System.out.println("connection string is: " + conn);

			// DB settings
			try (Statement statement = conn.createStatement()) {
				System.out.println("set the DB charset");
				String sql = "SET character_set_client = utf8";
				sql = "SET character_set_results = utf8";
				sql = "SET character_set_connection = utf8";
				statement.executeUpdate(sql);
			} catch (SQLException ex) {
				System.err.println("Error!" + ex.getMessage());
				throw ex;
			}

			System.out.println((new StringBuilder("conn successed. conn=")).append(conn).toString());
		}
		catch(ClassNotFoundException ex)
		{
			System.err.println((new StringBuilder("error loading:")).append(ex.getMessage()).toString());
		}
		catch(SQLException ex)
		{
			System.err.println((new StringBuilder("error loading:")).append(ex.getMessage()).toString());
		}
	}
	


	// Gets connection and opens if closed
	public static Connection getConnection() {
		try {
			if (conn == null || conn.isClosed() || !conn.isValid(5)) {
				openConnection();
			}
		} catch (SQLException e) {
			System.err.println("Conn error: " + e.toString());
			return null;
		}

		return conn;
	}
}
