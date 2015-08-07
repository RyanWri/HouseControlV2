package controllers;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import modelObjects.Device;
import modelObjects.RelayConnection;
import utils.GenericResponse;

import com.google.gson.Gson;

import dataBases.jdbc.DeviceHandler;
import dataBases.jdbc.RelayConnectionHandler;

/* Test */

@Path("/device")
public class ApiDevice {
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String deviceJson)
	{
		Response response = null;
		Device device = null;
		Gson gson = new Gson();
		try{	
			device = gson.fromJson(deviceJson, Device.class);
			DeviceHandler.addDevice(device);
			response = Response.ok(GenericResponse.ok(DeviceHandler.DEVICE_ADD_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
	@POST
	@Path("/connect_to_relay")
	@Produces(MediaType.APPLICATION_JSON)
	public Response connectToRelay(@Context HttpServletRequest req, String relayConnectionJson){
		Response response = null;
		RelayConnection relayConnection = null;
		Gson gson = new Gson();
		try{
			relayConnection = gson.fromJson(relayConnectionJson, RelayConnection.class);
			RelayConnectionHandler.connectToRelayPort(relayConnection);
			response = Response.ok(GenericResponse.ok(RelayConnectionHandler.RELAY_CONNECTION_UPDATE_RELAY_PORT_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
	@POST
	@Path("/disconnect_device/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response diconnectDevice(@Context HttpServletRequest req,@PathParam("deviceID") int deviceID){
		Response response = null;
		
		
		return response;
	}
}
