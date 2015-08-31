package controllers;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import utils.GenericResponse;
import dataBases.jdbc.RelayConnectionHandler;

@Path("/manager")
public class ApiManager {
	
	@POST
	@Path("/init_relay_ports")
	@Produces(MediaType.APPLICATION_JSON)
	public Response initRelayPorts(@Context HttpServletRequest req){
		Response response = null;
		try{
			RelayConnectionHandler.initRelayPorts();
			response = Response.ok(RelayConnectionHandler.RELAY_CONNECTION_INIT_RELAY_PORTS_SUCCESS_MESSAGE).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
	@GET
	@Path("/test_connection")
	@Produces(MediaType.APPLICATION_JSON)
	public Response or_test(@Context HttpServletRequest req) {

		Response response = Response.ok(GenericResponse.ok("Connected to HouseControl")).build();
		//add check db connection
		
		return response;
	}	
}
