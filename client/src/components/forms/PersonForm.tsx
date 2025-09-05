import { useEffect, useState } from "react";
import axios from "axios";
import type { Person } from "@/types/Person";
import { readImageAsBase64 } from "@/utils/image";
import { geocodeCityCountry } from "@/utils/geo";
import { reverseGeocode } from "@/utils/location";

interface PersonFormProps {
  initialData?: Partial<Omit<Person, "id" | "issuedDateAndTime">>;
  onChange: (data: Omit<Person, "id" | "issuedDateAndTime">) => void;
  showLocationInfo?: boolean;
}

const defaultFormData: Omit<Person, "id" | "issuedDateAndTime"> = {
  forename: "",
  surname: "",
  dob: "",
  ssn: "",
  image: "",
  friends: [],
  primaryLocation: {
    type: "Point",
    coordinates: [0, 0],
  },
};

export default function PersonForm({
  initialData,
  onChange,
  showLocationInfo,
}: PersonFormProps) {
  const [formData, setFormData] = useState<Omit<
    Person,
    "id" | "issuedDateAndTime"
  >>({
    ...defaultFormData,
    ...initialData,
  });

  const [people, setPeople] = useState<Person[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    axios
      .get<Person[]>("http://localhost:3001/people")
      .then((res) => setPeople(res.data))
      .catch((err) => console.error("Failed to fetch people", err))
      .finally(() => setLoadingPeople(false));
  }, []);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  useEffect(() => {
    if (!showLocationInfo) return;

    const [lng, lat] = formData.primaryLocation.coordinates;
    if (lng === 0 && lat === 0) return;

    reverseGeocode(lat, lng)
      .then(({ city, country }) => {
        setCity(city);
        setCountry(country);
      })
      .catch((err) => {
        console.error("Failed to reverse geocode", err);
      });
  }, [formData.primaryLocation, showLocationInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      setFormData((prev) => ({
        ...prev,
        primaryLocation: {
          ...prev.primaryLocation,
          coordinates:
            name === "longitude"
              ? [parseFloat(value), prev.primaryLocation.coordinates[1]]
              : [prev.primaryLocation.coordinates[0], parseFloat(value)],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await readImageAsBase64(file);
    setFormData((prev) => ({ ...prev, image: base64 }));
  };

  const handleGeocode = async () => {
    if (!city || !country) return;
    try {
      const { lat, lon } = await geocodeCityCountry(city, country);
      setFormData((prev) => ({
        ...prev,
        primaryLocation: {
          type: "Point",
          coordinates: [lon, lat],
        },
      }));
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handleFriendSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, friends: selected }));
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Forename</label>
        <input
          name="forename"
          placeholder="Enter first name"
          onChange={handleChange}
          value={formData.forename}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Surname</label>
        <input
          name="surname"
          placeholder="Enter last name"
          onChange={handleChange}
          value={formData.surname}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date of Birth</label>
        <input
          name="dob"
          type="date"
          onChange={handleChange}
          value={formData.dob}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SSN</label>
        <input
          name="ssn"
          placeholder="Enter Social Security Number"
          onChange={handleChange}
          value={formData.ssn}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="col-span-2">
        <label className="text-sm font-medium mb-1 block">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          name="city"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onBlur={handleGeocode}
          className="border p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <input
          name="country"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onBlur={handleGeocode}
          className="border p-2 rounded w-full"
        />
      </div>

      {loadingPeople ? (
        <p className="col-span-2 text-center text-gray-500">
          Loading people...
        </p>
      ) : (
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Choose friends for this person (hold Ctrl to select multiple)
          </label>
          <select
            multiple
            value={formData.friends}
            onChange={handleFriendSelect}
            className="border p-2 rounded w-full h-32"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.forename} {p.surname}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
