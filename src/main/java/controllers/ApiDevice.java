package controllers;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import modelObjects.Device;
import utils.GenericResponse;
import utils.PiGpio;

import com.google.gson.Gson;

import dataBases.jdbc.DeviceHandler;
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

		//To implement

		return response;
	}

	@GET
	@Path("/get_device/{deviceID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getDevice(@Context HttpServletRequest req, @PathParam("deviceID")int deviceID){
		Response response = null;

		try{
			Device device = DeviceHandler.getDevice(deviceID);
			response = Response.ok(GenericResponse.ok(device)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}


	@POST
	@Path("/relay/{port}/{action}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response relayAction(@Context HttpServletRequest req, @PathParam("port") int port,@PathParam("action") int action){
		Response response = null;

		try{
			String st = PiGpio.controlGpioPin(port, action);
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
			String currentPinState = PiGpio.getPinState(port);
			response = Response.ok(GenericResponse.ok("Port "+port+" status is: " + currentPinState)).build();
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
			String sumAllDevicesStatistics = PiGpio.getDeviceStatistics(timeFrame, deviceID);
			response = Response.ok(GenericResponse.ok(sumAllDevicesStatistics)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		return response;
	}

}
