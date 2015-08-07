package controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import modelObjects.User;
import utils.GenericResponse;
import dataBases.jdbc.UserInGroupHandler;

@Path("/user_in_group")
public class ApiUserInGroup {
	@POST
	@Path("/add")
	@Produces(MediaType.APPLICATION_JSON)
	public Response add(@Context HttpServletRequest req, @FormParam("userID") int userID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			UserInGroupHandler.addUserToDeviceGroup(userID, deviceGroupID);
			response = Response.ok(GenericResponse.ok(UserInGroupHandler.USER_IN_GROUP_ADD_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}

	@DELETE
	@Path("/remove")
	@Produces(MediaType.APPLICATION_JSON)
	public Response remove(@Context HttpServletRequest req, @FormParam("userID") int userID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			UserInGroupHandler.removeUserFromDeviceGroup(userID, deviceGroupID);
			response = Response.ok(GenericResponse.ok(UserInGroupHandler.USER_IN_GROUP_REMOVE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}

	@GET
	@Path("/get_users/{devicesGroupID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsersInDeviceGroup(@Context HttpServletRequest req, @PathParam("devicesGroupID") int devicesGroupID) {
		Response response = null;
		List<User> users = null;
		
		try{
			users = UserInGroupHandler.getUsersFromDevicesGroup(devicesGroupID);
			response = Response.ok(GenericResponse.ok(users)).build();
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}


}
