package utils;

import com.google.gson.Gson;


public class GenericResponse {
    private String status;
    private Object data;

    private GenericResponse(String status,Object data) {
        this.status = status;
        this.data = data;

    }

    /**
     * Generate a uniformed error message with data
     * @param val error code or msg
     * @return a json payload string
     */
    public static String error(Object val) {
        GenericResponse gr = new GenericResponse("error",val);
        return new Gson().toJson(gr);
    }

    /***
     * Generate a uniformed ok message with data
     * @param val any object data
     * @return a json payload string
     */
    public static String ok(Object val) {
        GenericResponse gr = new GenericResponse("ok",val);
        return new Gson().toJson(gr);
    }
}
