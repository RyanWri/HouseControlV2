package utils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import modelObjects.User.UserType;

public class SessionHandler {
	public static boolean isAuthUser(HttpServletRequest req) {
		return getId(req) != null && getType(req) != null && getFullname(req)!=null;
	}
	
	public static void authUser(Integer id , UserType type ,String firstname,String lastname, HttpServletRequest req) {
		HttpSession session = req.getSession(true);
	    session.setAttribute("id", id);
	    session.setAttribute("type", type); 
	    session.setAttribute("firstname", firstname);
	    session.setAttribute("lastname", lastname);
	}
	
	public static void unAuthUser(HttpServletRequest req) {
		HttpSession session = req.getSession(true);
		session.removeAttribute("id");
		session.removeAttribute("type");
		session.removeAttribute("firstname");
		session.removeAttribute("lastname");
	}
	
	public static Integer getId(HttpServletRequest req) {
		Integer id = null;
		
		HttpSession session = req.getSession(true);
	    id = (Integer)session.getAttribute("id");
	    
		return id;
	}
	
	public static String getFullname(HttpServletRequest req){
		HttpSession session = req.getSession(true);
		String fullname = session.getAttribute("firstname") + " " + session.getAttribute("lastname");
		
		return fullname;
	}
	
	public static UserType getType(HttpServletRequest req) {
		UserType type = null;
		
		HttpSession session = req.getSession(true);
	    type = (UserType)session.getAttribute("type");
	    
		return type;
	}
	
	public static boolean isAdmin(HttpServletRequest req){
		boolean isAdmin = false;
		UserType type = getType(req);
		if(type.equals(UserType.Admin)){
			isAdmin = true;
		}
		
		return isAdmin;
	}
}
