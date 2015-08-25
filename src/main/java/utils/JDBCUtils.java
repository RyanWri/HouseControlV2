package utils;

import java.sql.SQLException;

public class JDBCUtils {
	final static String DUPLICATE_ENTRY_ERROR = "23000"; 
	
	public static void checkIfDuplicate(SQLException ex) throws Exception{
		if(ex.getSQLState().equals(DUPLICATE_ENTRY_ERROR)){
			throw new Exception("Already exists");
		}
		else{
			throw new Exception("An error has occured");
		}
	}
}
