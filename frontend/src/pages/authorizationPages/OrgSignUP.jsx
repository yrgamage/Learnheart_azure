import { CreateOrganization } from "@clerk/clerk-react";

export default function OrgSignUP() {
  return (
    <div className="flex items-center justify-center h-screen bg-custom-page">
      <div className="w-full px-4 py-6 md:w-1/3">
        <CreateOrganization
          afterCreateOrganizationUrl={"/organization/details"}
          className="p-4 space-y-4 rounded-lg shadow-lg bg-custom-green"
        >
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-full py-2 text-white transition duration-300 ease-in-out rounded-lg shadow-lg bg-custom-orange hover:bg-orange-600"
            >
              Create Organization
            </button>
          </div>
        </CreateOrganization>
      </div>
    </div>
  );
}
