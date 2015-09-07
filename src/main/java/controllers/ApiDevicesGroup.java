package controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;

import modelObjects.Device;
import modelObjects.DevicesGroup;
import modelObjects.RelayConnection;
import modelObjects.User;
import modelObjects.User.UserType;
import utils.GenericResponse;
import utils.SessionHandler;
import dataBases.jdbc.DeviceHandler;
import dataBases.jdbc.DeviceInGroupHandler;
import dataBases.jdbc.DevicesGroupHandler;
import dataBases.jdbc.RelayConnectionHandler;
import dataBases.jdbc.UserInGroupHandler;

@Path("/devices_group")
public class ApiDevicesGroup {
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String groupJson){
		Response response = null;
		DevicesGroup parsedDevicesGroup = null;
		DevicesGroup devicesGroup = null;
		Gson gson = new Gson();
		
		try{
			SessionHandler.verifyAdminRequest(req);
			parsedDevicesGroup = gson.fromJson(groupJson, DevicesGroup.class);
			devicesGroup = DevicesGroupHandler.insertNewGroup(parsedDevicesGroup.getGroupName(), parsedDevicesGroup.getPicData());
			response = Response.ok(GenericResponse.ok(devicesGroup)).build();
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
			SessionHandler.verifyAdminRequest(req);
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
			SessionHandler.verifyAdminRequest(req);
			DevicesGroupHandler.deleteDevicesGroup(devicesGroupID);
			response = Response.ok(GenericResponse.ok(DevicesGroupHandler.DEVICES_GROUP_DELETE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}
	
	@POST
	@Path("/add_user")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUser(@Context HttpServletRequest req, @FormParam("userID") int userID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			SessionHandler.verifyAdminRequest(req);
			UserInGroupHandler.addUserToDeviceGroup(userID, deviceGroupID);
			response = Response.ok(GenericResponse.ok(UserInGroupHandler.USER_IN_GROUP_ADD_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}

	@DELETE
	@Path("/remove_user")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeUser(@Context HttpServletRequest req, @FormParam("userID") int userID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			SessionHandler.verifyAdminRequest(req);
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
			SessionHandler.verifyAdminRequest(req);
			users = UserInGroupHandler.getAuthorizedUsersOfDevicesGroup(devicesGroupID);
			response = Response.ok(GenericResponse.ok(users)).build();
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}
	
	@GET
	@Path("/get_group/{devicesGroupID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevicesGroup(@Context HttpServletRequest req, @PathParam("devicesGroupID") int devicesGroupID) {
		Response response = null;
		DevicesGroup devicesGroup = null;
		
		try{
			SessionHandler.verifyAuthenticatedUserRequest(req);
			devicesGroup = DevicesGroupHandler.getDevicesGroupByID(devicesGroupID, false);
			response = Response.ok(GenericResponse.ok(devicesGroup)).build();
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}
	
	@GET
	@Path("/get_devices/{devicesGroupID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevicesInDeviceGroup(@Context HttpServletRequest req, @PathParam("devicesGroupID") int devicesGroupID) {
		Response response = null;
		List<Device> devices = null;
		
		try{
			SessionHandler.verifyAuthenticatedUserRequest(req);
			if(SessionHandler.getType(req).equals(UserType.Admin) || UserInGroupHandler.isUserAuthorizedGettingDevicesGroupData(SessionHandler.getId(req), devicesGroupID)){
				//devices = DeviceInGroupHandler.getAllDevicesOfDevicesGroupByID(devicesGroupID);
				devices = DeviceInGroupHandler.getAllActiveDevicesOfDevicesGroupByID(devicesGroupID);
				response = Response.ok(GenericResponse.ok(devices)).build();
			}
			else{
				throw new Exception("You are not allowed accessing this method");
			}
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}
	
	@GET
	@Path("/get_devices_extra/{devicesGroupID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevicesInDeviceGroupAndPortStatus(@Context HttpServletRequest req, @PathParam("devicesGroupID") int devicesGroupID) {
		JSONArray groupDevices = new JSONArray();
		Response response = null;
		
		try{
			SessionHandler.verifyAuthenticatedUserRequest(req);
			if(SessionHandler.getType(req).equals(UserType.Admin) || UserInGroupHandler.isUserAuthorizedGettingDevicesGroupData(SessionHandler.getId(req), devicesGroupID)){
				
				groupDevices = DeviceInGroupHandler.getAllDevicesOfDevicesGroupByIDAndPortsAndStatuses(devicesGroupID);
				
				response = Response.ok(GenericResponse.ok(groupDevices)).build();
			}
			else{
				throw new Exception("You are not allowed accessing this method");
			}
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}
	
	@GET
	@Path("/user_devices_groups/{userID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevicesGroupsByUserID(@Context HttpServletRequest req, @PathParam("userID") int userID) {
		Response response = null;
		List<DevicesGroup> devicesGroups = null;
		
		try{
			SessionHandler.verifyUserIsAuthorized(req,userID);
			devicesGroups = UserInGroupHandler.getDevicesGroupsUserIsMemberOf(userID);
			response = Response.ok(GenericResponse.ok(devicesGroups)).build();
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		
		return response;
	}
	
	@POST
	@Path("/add_device")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addDevice(@Context HttpServletRequest req, @FormParam("deviceID") int deviceID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			SessionHandler.verifyAdminRequest(req);
			DeviceInGroupHandler.addDeviceToDevicesGroup(deviceID, deviceGroupID);
			response = Response.ok(GenericResponse.ok(DeviceInGroupHandler.DEVICE_IN_GROUP_ADD_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@DELETE
	@Path("/remove_device")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeDevice(@Context HttpServletRequest req, @FormParam("deviceID") int deviceID, @FormParam("deviceGroupID") int deviceGroupID){
		Response response = null;

		try{
			SessionHandler.verifyAdminRequest(req);
			RelayConnectionHandler.disconnectDeviceFromRelay(deviceID);
			DeviceInGroupHandler.removeDeviceFromDevicesGroup(deviceID, deviceGroupID);
			response = Response.ok(GenericResponse.ok(DeviceInGroupHandler.DEVICE_IN_GROUP_REMOVE_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	} 
	 
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllDevicesGroups(@Context HttpServletRequest req){
		Response response = null;
		List<DevicesGroup> devicesGroups = null;

		try{
			SessionHandler.verifyAdminRequest(req);
			devicesGroups = DevicesGroupHandler.getAllDevicesGroups();
			response = Response.ok(GenericResponse.ok(devicesGroups)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
}



