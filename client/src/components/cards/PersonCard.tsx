import { Link } from "react-router-dom";
import type { Person } from "../../types/Person";
import { Image } from "../common/Image";

interface Props {
  person: Person;
}

const PersonCard: React.FC<Props> = ({ person }) => {
  return (
    <Link
      to={`/people/${person.id}`}
      className="border border-neutral-default hover:border-primary-focus rounded-xl p-4 transition-all hover:shadow-lg flex flex-col items-center"
    >
      <Image
        src={`http://localhost:3001/${person.image}`}
        alt={`${person.forename} ${person.surname}`}
        className="w-16 h-16 object-cover rounded-full mb-2"
        fallback={
          <div className="w-16 h-16 bg-neutral-default rounded-full flex items-center justify-center mb-2 text-xl font-bold text-neutral-focus">
            {person.forename[0]}
            {person.surname[0]}
          </div>
        }
      />
      <p className="font-medium text-center">
        {person.forename} {person.surname}
      </p>
    </Link>
  );
};

export default PersonCard;
