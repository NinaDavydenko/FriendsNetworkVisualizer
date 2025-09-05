import { Dialog } from "@headlessui/react";
import { AgeDistributionChart } from "../charts/AgeDistributionChart";
import type { Person } from "@/types/Person";
import { Button } from "../common/Button";

interface AgeDistributionChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
}

export default function AgeDistributionChartModal({
  isOpen,
  onClose,
  people,
}: AgeDistributionChartModalProps) {
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
        <Dialog.Panel className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl z-10">
          <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
          <AgeDistributionChart people={people} />

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="gray" onClick={onClose}>
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
