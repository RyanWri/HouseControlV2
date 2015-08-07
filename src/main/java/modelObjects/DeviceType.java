package modelObjects;

public class DeviceType {
	private int typeID;
	private String name;
	private String picData;
	
	public int getTypeID() {
		return typeID;
	}
	
	public void setTypeID(int typeID) {
		this.typeID = typeID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getPicData() {
		return picData;
	}

	public void setPicData(String picData) {
		this.picData = picData;
	}
}
