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

import com.google.gson.Gson;
import modelObjects.DevicesGroup;
import utils.GenericResponse;
import dataBases.jdbc.DevicesGroupHandler;

@Path("/devices_group")
public class ApiDevicesGroup {
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String groupJson)
	{
		Response response = null;
		DevicesGroup devicesGroup = null;
		Gson gson = new Gson();
		try{
			devicesGroup = gson.fromJson(groupJson, DevicesGroup.class);
			DevicesGroupHandler.insertNewGroup(devicesGroup.getGroupName(), devicesGroup.getPicData());
			response = Response.ok(GenericResponse.ok(DevicesGroupHandler.DEVICES_GROUP_CREATE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
			
		return response;
	}
		
	@PUT
	@Path("/update")
	@Produces(MediaType.APPLICATION_JSON)
	public Response update(@Context HttpServletRequest req, String groupJson){
		Response response = null;
		DevicesGroup group = null;
		Gson gson = new Gson();
		
		try{
			group = gson.fromJson(groupJson, DevicesGroup.class);
			DevicesGroupHandler.updateGroup(group);
			response = Response.ok(GenericResponse.ok(DevicesGroupHandler.DEVICES_GROUP_UPDATE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
			
		return response;
	}
	
	@DELETE
	@Path("/delete/{devicesGroupID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(@Context HttpServletRequest req,@PathParam("devicesGroupID") int devicesGroupID){
		Response response = null;
		try{
			DevicesGroupHandler.deleteDevicesGroup(devicesGroupID);
			response = Response.ok(GenericResponse.ok(DevicesGroupHandler.DEVICES_GROUP_DELETE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
}



