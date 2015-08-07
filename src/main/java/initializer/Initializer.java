package initializer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import dataBases.jdbc.DBHandler;

public class Initializer implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		System.out.println("Initializer init.");
        setup();
		
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		System.out.println("Initializer destroy");		
	}
	
	private void setup() {
		try{
		DBHandler.createTables();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}

}
