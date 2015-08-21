package controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import modelObjects.Device;
import utils.GenericResponse;
import utils.PiGpio;

import com.google.gson.Gson;

import dataBases.jdbc.DeviceHandler;
import dataBases.jdbc.DeviceUsageHandler;
import dataBases.jdbc.RelayConnectionHandler;


@Path("/device")
public class ApiDevice{
	@POST
	@Path("/create")
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(@Context HttpServletRequest req, String deviceJson){
		Response response = null;
		Device device = null;
		Gson gson = new Gson();

		try{
			//SessionHandler.verifyAdminRequest(req);
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
	@Path("/connect_device_to_relay/{relayPort}/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response connectDeviceToRelay(@Context HttpServletRequest req, @PathParam("relayPort") int relayPort,@PathParam("deviceID") int deviceID){
		Response response = null;

		try{
			//SessionHandler.verifyAdminRequest(req);
			RelayConnectionHandler.connectDeviceToRelay(relayPort,deviceID);
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
		try{
			//SessionHandler.verifyAdminRequest(req);
			RelayConnectionHandler.disconnectDeviceFromRelay(deviceID);
			DeviceHandler.updateDeviceState(deviceID, Device.DeviceState.Inactive);
			response = Response.ok(GenericResponse.ok(RelayConnectionHandler.RELAY_CONNECTION_DISCONNECT_DEVICE_FROM_RELAY_PORT_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}

	@GET
	@Path("/get_device/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevice(@Context HttpServletRequest req, @PathParam("deviceID")int deviceID){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			Device device = DeviceHandler.getDevice(deviceID);
			response = Response.ok(GenericResponse.ok(device)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}
	
	@GET
	@Path("/get_relay_port/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDeviceRelayPort(@Context HttpServletRequest req, @PathParam("deviceID")int deviceID){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			int relayPort = RelayConnectionHandler.getRelayPortOfConnectedDevicesOnRelay(deviceID);
			response = Response.ok(GenericResponse.ok(relayPort)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}


	@POST
	@Path("/relay/{deviceID}/{action}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response relayAction(@Context HttpServletRequest req, @PathParam("deviceID")int deviceID, @PathParam("action") int action){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			String st = PiGpio.controlGpioPin(deviceID, action); 
			response = Response.ok(GenericResponse.ok("GREAT the relay port status is: " + st)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}

	@GET
	@Path("/relay/{port}/status")
	@Produces(MediaType.APPLICATION_JSON)
	public Response relayStatus(@Context HttpServletRequest req, @PathParam("port")int port){
		Response response = null;
		
		try{
//			SessionHandler.isAuthUser(req);
			JSONObject currentPinState = PiGpio.getJsonPinState(port); 
			response = Response.ok(GenericResponse.ok(currentPinState)).build();
		} 
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}
	
	@GET
	@Path("/relay/{port}/inUse")
	@Produces(MediaType.APPLICATION_JSON)
	public Response isRelayPortAvailable(@Context HttpServletRequest req, @PathParam("port")int port){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			boolean isAvailable = RelayConnectionHandler.isRelayPortAvailable(port);
			response = Response.ok(GenericResponse.ok(!isAvailable)).build();
		} 
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}

	@GET
	@Path("/statistics/{timeFrame}/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response allDevicesStatistics(@Context HttpServletRequest req, @PathParam("timeFrame")String timeFrame){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			String sumAllDevicesStatistics = PiGpio.getAllDevicesStatistics(timeFrame);
			response = Response.ok(GenericResponse.ok("The total sum of elctricity used during the last " + timeFrame + " is: "+ sumAllDevicesStatistics + "!")).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}

	@GET
	@Path("/statistics/{timeFrame}/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response DeviceStatistics(@Context HttpServletRequest req, @PathParam("timeFrame")String timeFrame, @PathParam("deviceID") int deviceID){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			String sumAllDevicesStatistics = PiGpio.getDeviceStatistics(timeFrame, deviceID);
			response = Response.ok(GenericResponse.ok(sumAllDevicesStatistics)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	} 
	
	@GET
	@Path("/statistics/devices_group/{groupID}/{timeFrame}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response DevicesGroupStatistics(@Context HttpServletRequest req, @PathParam("groupID") int groupID, @PathParam("timeFrame")String timeFrame){
		Response response = null;

		try{
//			SessionHandler.isAuthUser(req);
			JSONArray groupDevicesConsumption = DeviceUsageHandler.getDeviceStatisticsByGroupID(timeFrame, groupID);
			response = Response.ok(GenericResponse.ok(groupDevicesConsumption)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}
	
	
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllDevices(@Context HttpServletRequest req){
		Response response = null;
		List<Device> devicesGroups = null;

		try{
//			SessionHandler.isAdmin(req);
			devicesGroups = DeviceHandler.getAllDevices();
			response = Response.ok(GenericResponse.ok(devicesGroups)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@GET
	@Path("/user_turned_on_devices/{userID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevicesTurnOnByUserID(@Context HttpServletRequest req, @PathParam("userID") int userID){
		Response response = null;
		List<Device> devices = null;
		try{
			//SessionHandler.verifyAdminRequest(req);
			devices = DeviceHandler.getTurnedOnDevicesByUserID(userID);
			response = Response.ok(GenericResponse.ok(devices)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@GET
	@Path("/sensor/temp_humidity")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getTempAndHumidityFromSensor(@Context HttpServletRequest req){
		Response response = null;
	    JSONObject tempAndHumidity;
		try{
			//SessionHandler.verifyAdminRequest(req);
			tempAndHumidity = DeviceUsageHandler.getTempAndHumidityFromSensor();
			response = Response.ok(GenericResponse.ok(tempAndHumidity)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build(); 
		}

		return response;
	}

}
