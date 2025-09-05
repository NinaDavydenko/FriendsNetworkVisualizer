import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { Person } from "../types/Person";
import EditPersonModal from "@/components/modals/EditPersonModal";
import { Image } from "@/components/common/Image";
import PersonCard from "@/components/cards/PersonCard";
import { reverseGeocode } from "@/utils/location";
import { Button } from "@/components/common/Button";

export default function PersonDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ city: string; country: string }>({
    city: "",
    country: "",
  });
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([
      axios.get<Person>(`http://localhost:3001/people/${id}`),
      axios.get<Person[]>(`http://localhost:3001/people`),
    ])
      .then(async ([personRes, peopleRes]) => {
        setPerson(personRes.data);
        setAllPeople(peopleRes.data);

        const [lon, lat] = personRes.data.primaryLocation.coordinates;
        const loc = await reverseGeocode(lat, lon);
        setLocation(loc);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Person not found</p>;

  const friends = allPeople.filter((p) => person.friends.includes(p.id));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-[auto_1fr_auto] gap-6 mb-10 items-start">
        <div className="flex justify-center sm:justify-start w-32">
          <Image
            src={`http://localhost:3001/${person.image}`}
            alt={`${person.forename} ${person.surname}`}
            className="w-32 h-32 rounded-full object-cover shadow-md"
            fallback={
              <div className="w-32 h-32 bg-neutral-default rounded-full flex items-center justify-center text-4xl font-bold text-neutral-focus">
                {person.forename[0]}
                {person.surname[0]}
              </div>
            }
          />
        </div>

        <div className="space-y-2 min-w-0">
          <h1 className="text-4xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
            {person.forename} {person.surname}
          </h1>
          <p>
            <strong>Date of Birth:</strong> {person.dob}
          </p>
          <p>
            <strong>SSN:</strong> {person.ssn}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {location.city && location.country
              ? `${location.city}, ${location.country}`
              : "Unknown"}
          </p>
        </div>

        <div className="flex justify-end items-start">
          <Button onClick={() => setEditOpen(true)}>Edit Person</Button>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Friends</h2>
      {friends.length === 0 ? (
        <p className="italic text-neutral-focus">No friends added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {friends.map((f) => (
            <PersonCard key={f.id} person={f} />
          ))}
        </div>
      )}

      {editOpen && person && (
        <EditPersonModal
          isOpen={editOpen}
          person={person}
          onClose={() => setEditOpen(false)}
          onSuccess={() => {
            axios
              .get<Person>(`http://localhost:3001/people/${id}`)
              .then((res) => setPerson(res.data));
            setEditOpen(false);
          }}
        />
      )}
    </div>
  );
}
