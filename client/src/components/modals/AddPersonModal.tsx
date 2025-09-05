import { Dialog } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import type { Person } from "@/types/Person";
import { useState } from "react";
import PersonForm from "../forms/PersonForm";
import { Button } from "../common/Button";

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPersonModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPersonModalProps) {
  const [formState, setFormState] =
    useState<Omit<Person, "id" | "issuedDateAndTime">>();

  const handleSubmit = async () => {
    if (!formState) return;

    const newPerson: Person = {
      id: uuidv4(),
      issuedDateAndTime: new Date().toISOString(),
      ...formState,
    };

    try {
      await axios.post("http://localhost:3001/people", newPerson);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to add person:", err);
    }
  };

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
            Add New Person
          </Dialog.Title>
          <PersonForm onChange={setFormState} />
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="gray" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
