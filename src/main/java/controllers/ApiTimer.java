package controllers;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import modelObjects.Timer;
import utils.GenericResponse;

import com.google.gson.Gson;

import dataBases.jdbc.TimerHandler;

@Path("/timer")
public class ApiTimer {
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String timerJson){
		Response response = null;
		Timer timer = null;
		Gson gson = new Gson();

		try{
			//SessionHandler.verifyAdminRequest(req);
			timer = gson.fromJson(timerJson, Timer.class);
			TimerHandler.addTimer(timer);
			response = Response.ok(GenericResponse.ok(timer)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@GET
	@Path("/get_timer/{timerID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevice(@Context HttpServletRequest req, @PathParam("timerID")int timerID){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			Timer timer = TimerHandler.getTimerByID(timerID);
			response = Response.ok(GenericResponse.ok(timer)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}
	
	@DELETE
	@Path("/delete/{timerID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(@Context HttpServletRequest req,@PathParam("timerID") int timerID){
		Response response = null;
		try{
//			SessionHandler.isAdmin(req);
			TimerHandler.deleteTimer(timerID);
			response = Response.ok(GenericResponse.ok(TimerHandler.TIMER_DELETE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
//	@GET
//	@Path("/get_timers_of_device/{deviceID}")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response getTimersOfDevice(@Context HttpServletRequest req, @PathParam("deviceID")int deviceID){
//		Response response = null;
//		List<Timer> timers = new ArrayList<Timer>();
//		
//		try{
////			SessionHandler.isAuthUser(req);
//			Timer timer = TimerHandler.getTimerByID(deviceID);
//			response = Response.ok(GenericResponse.ok(timer)).build();
//		}
//		catch(Exception ex){
//			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
//		}
//		return response;
//	}
}


