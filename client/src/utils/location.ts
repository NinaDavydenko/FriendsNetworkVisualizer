import axios from "axios";

export async function reverseGeocode(lat: number, lon: number) {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    return {
      city: res.data.address.city || res.data.address.town || "",
      country: res.data.address.country || "",
    };
  } catch {
    return { city: "", country: "" };
  }
}
