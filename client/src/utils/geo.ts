import axios from "axios";

export async function geocodeCityCountry(city: string, country: string) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      city,
      country,
      format: "json",
      limit: 1,
    },
    headers: {
      "User-Agent": "InterviewApp/1.0 ninadavydenko1992@gmail.com",
    },
  });

  if (res.data.length === 0) {
    throw new Error("No results found");
  }

  const { lat, lon } = res.data[0];
  return {
    lat: parseFloat(lat),
    lon: parseFloat(lon),
  };
}
