package controllers;

import java.sql.SQLException;
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

import org.json.JSONObject;

import utils.GenericResponse;
import utils.SessionHandler;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import dataBases.jdbc.UserHandler;
import modelObjects.User;
import modelObjects.User.UserType;


@Path("/user")
public class ApiUser{
	
	@GET
	@Path("/authenticateuser")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAuthenticateUser(@Context HttpServletRequest req) {
		User user = new User();
		Response response = null;

		try {
			if(SessionHandler.isAuthUser(req) == false) {
				throw new Exception("Access Denied - Login First");
			}

			UserType type = SessionHandler.getType(req);

			user.setUserID(SessionHandler.getId(req));
			user.setType(type);

			String fullName = SessionHandler.getFullname(req);
			String[] fullNameArr = fullName.split(" ");

			user.setFirstname(fullNameArr[0]);
			user.setLastname(fullNameArr[1]);

			response = Response.ok(GenericResponse.ok(user)).build();

		} catch(Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}

		return response;
	}	
	
	@POST
	@Path("/register")
	@Produces(MediaType.APPLICATION_JSON)
	public Response insert(@Context javax.servlet.http.HttpServletRequest req  , @FormParam("username") String username,@FormParam("password") String password, @FormParam("firstname") String firstname, @FormParam("lastname") String lastname,@FormParam("email") String email,@FormParam("mobile") String mobile) {
		// String hashedPassword = PasswordHash.hash(password);

		Response response = null;
		try {
//			if(SessionHandler.isAuthUser(req) == false){
//				throw new Exception("Access Denied - Login First");
//			}
//			if(SessionHandler.getType(req) != UserType.Admin){
//				throw new Exception("Access Denied - Only an admin can create user");
//			}
			UserHandler.insertNewUser(username.toLowerCase() , password, firstname , lastname,email,mobile);   
			response = Response.ok(GenericResponse.ok("user has been created successfully")).build();
		} 
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		return response;
	}

	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(@Context javax.servlet.http.HttpServletRequest req  , @FormParam("username") String username,@FormParam("password") String password) {
		Response response = null;
		try{
			if(SessionHandler.isAuthUser(req) == true ) {
				throw new Exception("Access Denied - You Are Already Logged In");
			}
			User user = UserHandler.getUserByUsername(username);
			if(user==null){
				throw new Exception("Wrong UserName Or Password");
			}
			if(user.getPassword().equals(password)){
				user.setPassword("********");
				
				SessionHandler.authUser(user.getUserID(),user.getType(),user.getFirstname(),user.getLastname(), req);	
				response = Response.ok(GenericResponse.ok(user)).build();
			}
			else{
				response = Response.ok(GenericResponse.error(Response.Status.UNAUTHORIZED)).build();
			}
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@POST
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout(@Context HttpServletRequest req){
		Response response = null;
		
		try{
			if (SessionHandler.isAuthUser(req) == false){
				throw new Exception("Access Denied - Login First");
			}
			SessionHandler.unAuthUser(req);
			response = Response.ok(GenericResponse.ok(UserHandler.USER_LOGOUT_SUCCESS_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}
		
		return response;
	}

	@PUT
	@Path("/update")
	@Produces(MediaType.APPLICATION_JSON)
	public Response update(@Context HttpServletRequest req, String userJson){
		Response response = null;
		User user = null;
		Gson gson = new Gson();

		try{
			user = gson.fromJson(userJson, User.class);
			UserHandler.updateUser(user);
			response = Response.ok(GenericResponse.ok(UserHandler.USER_UPDATE_SUCCESS_MESSAGE)).build();
		}
		catch(JsonSyntaxException ex){
			response = Response.ok(GenericResponse.error("Internal error")).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	@PUT
	@Path("/change_password")
	@Produces(MediaType.APPLICATION_JSON)
	public Response changePassword(@Context HttpServletRequest req, String passwordJson){
		Response response = null;
		//json structure :{userID:X ,oldPassword: X ,newPassword: X}
		//example: {userID:4,oldPassword:"12345678",newPassword:"1234"}
		try{
			JSONObject jsonObject = new JSONObject(passwordJson);
			int userID = jsonObject.getInt("userID");
			String oldPassword = jsonObject.getString("oldPassword");
			String newPassword = jsonObject.getString("newPassword");
			UserHandler.changeUserPassword(userID, oldPassword, newPassword);
			response = Response.ok(GenericResponse.ok(UserHandler.USER_CHANGE_PASSWORD_SUCCESS_MESSAGE)).build();
		}
		catch(JsonSyntaxException ex){
			response = Response.ok(GenericResponse.error("Internal error")).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}

	@GET
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@Context HttpServletRequest req, @PathParam("username") String username) {

		User user = null;
		Response response = null;
		try{
			user = UserHandler.getUserByUsername(username);
			user.setPassword("********");
		}
		catch (SQLException e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}
		if (user == null ){
			response = Response.ok(GenericResponse.error("user wasn't found")).build();
		}
		else{
			response = Response.ok(GenericResponse.ok(user)).build();
		}
		return response;
	}
	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllUsers(@Context HttpServletRequest req) {

		List<User> users = null;
		Response response = null;
		try{
			users = UserHandler.getAllUsers();
			response = Response.ok(GenericResponse.ok(users)).build();
		}
		catch (Exception e) {
			response = Response.ok(GenericResponse.error(e.getMessage())).build();
		}

		return response;
	}

	@DELETE
	@Path("/delete/{userID}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response delete(@Context HttpServletRequest req,@PathParam("userID") int userID){
		Response response = null;
		try{
			UserHandler.deleteUser(userID);
			response = Response.ok(GenericResponse.ok(UserHandler.USER_UPDATE_DELETE_MESSAGE)).build();
		}
		catch(Exception ex){
			response = Response.ok(GenericResponse.error(ex.getMessage())).build();
		}

		return response;
	}
	
	

}
