import { useEffect, useState } from "react";
import axios from "axios";
import PersonCard from "../components/cards/PersonCard";
import type { Person } from "../types/Person";
import AddPersonModal from "@/components/modals/AddPersonModal";
import AgeDistributionChartModal from "@/components/modals/AgeDistributionChartModal";
import { Button } from "@/components/common/Button";

const PeopleGridPage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAgeChartModalOpen, setIsAgeChartModalOpen] = useState(false);

  const fetchPeople = () => {
    setLoading(true);
    axios
      .get<Person[]>("http://localhost:3001/people")
      .then((res) => setPeople(res.data))
      .catch((err) => console.error("Error fetching people:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <>
      <div className={`p-6 transition-filter duration-300`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">People</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="green"
              onClick={() => setIsAgeChartModalOpen(true)}
            >
              Show Age Chart
            </Button>
            <Button onClick={() => setIsAddPersonModalOpen(true)}>
              Add New Person
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>

      <AgeDistributionChartModal
        isOpen={isAgeChartModalOpen}
        onClose={() => setIsAgeChartModalOpen(false)}
        people={people}
      />

      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        onClose={() => setIsAddPersonModalOpen(false)}
        onSuccess={() => {
          fetchPeople();
          setIsAddPersonModalOpen(false);
        }}
      />
    </>
  );
};

export default PeopleGridPage;