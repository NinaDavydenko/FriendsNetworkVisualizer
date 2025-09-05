import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Person } from "@/types/Person";
import PersonForm from "../forms/PersonForm";
import { Button } from "../common/Button";

interface EditPersonModalProps {
  person: Person | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPersonModal({
  person,
  isOpen,
  onClose,
  onSuccess,
}: EditPersonModalProps) {
  const [formData, setFormData] = useState<Omit<
    Person,
    "id" | "issuedDateAndTime"
  > | null>(null);

  useEffect(() => {
    if (person) {
      const { ...rest } = person;
      setFormData(rest);
    }
  }, [person]);

  const handleSubmit = async () => {
    if (!formData || !person) return;

    const updatedPerson: Person = {
      ...person,
      ...formData,
    };

    try {
      await axios.patch(
        `http://localhost:3001/people/${person.id}`,
        updatedPerson
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to update person:", err);
    }
  };

  if (!person || !formData) return null;

  return (
    <>
      <div
        className={`fixed top-0 right-0 bottom-0 left-0 opacity-60 bg-black z-0 ${
          isOpen ? "" : "hidden"
        }`}
      ></div>

      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl">
          <Dialog.Title className="text-xl font-bold mb-4">
            Edit Person
          </Dialog.Title>

          <PersonForm
            initialData={formData}
            onChange={setFormData}
            showLocationInfo={true}
          />

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="gray" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex justify-end items-start">
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
