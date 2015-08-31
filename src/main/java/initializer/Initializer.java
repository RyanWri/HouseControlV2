package initializer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import dataBases.jdbc.DBHandler;
import dataBases.jdbc.TimerHandler;
import utils.PiGpio;

public class Initializer implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		System.out.println("Initializer init.");
        setup();
		
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
		System.out.println("Initializer destroy");	
		try{
			PiGpio.shutDownGpio();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}
	
	private void setup() {
		try{
		DBHandler.createTables();
		//PiGpio.initializePiGpio();//$$FOR DEBUG
		TimerHandler.initilizeMyTimers();
		}
		catch(Exception ex){
			ex.printStackTrace();
		}
	}

}
