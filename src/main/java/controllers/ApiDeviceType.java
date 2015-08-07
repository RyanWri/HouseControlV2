package controllers;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import modelObjects.DeviceType;
import utils.GenericResponse;

import com.google.gson.Gson;
import dataBases.jdbc.DeviceTypeHander;

@Path("/device_type")
public class ApiDeviceType {
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String deviceTypeJson){
		Response response = null;
		DeviceType deviceType = null;
		Gson gson = new Gson();
		
		try{
			deviceType = gson.fromJson(deviceTypeJson, DeviceType.class);
			DeviceTypeHander.insertNewDeviceType(deviceType.getName(), deviceType.getPicData());
			response = Response.ok(GenericResponse.ok(DeviceTypeHander.DEVICES_TYPE_CREATE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
			
		return response;
	}
	
	@PUT
	@Path("/update")
	@Produces(MediaType.APPLICATION_JSON)
	public Response update(@Context HttpServletRequest req, String deviceTypeJson){
		Response response = null;
		DeviceType deviceType = null;
		Gson gson = new Gson();
		
		try{
			deviceType = gson.fromJson(deviceTypeJson, DeviceType.class);
			DeviceTypeHander.updateDeviceType(deviceType);
			response = Response.ok(GenericResponse.ok(DeviceTypeHander.DEVICES_TYPE_UPDATE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
			
		return response;
	}
	
	@DELETE
	@Path("/delete/{deviceTypeID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(@Context HttpServletRequest req,@PathParam("deviceTypeID") int deviceTypeID){
		Response response = null;
		try{
			DeviceTypeHander.deleteDeviceType(deviceTypeID);
			response = Response.ok(GenericResponse.ok(DeviceTypeHander.DEVICES_TYPE_DELETE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
	
}
