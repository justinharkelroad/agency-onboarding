"use client";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  photo: File | null;
}

interface Props {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export default function TeamMemberFields({ members, onChange }: Props) {
  function update(index: number, field: keyof TeamMember, value: string | File | null) {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  function addMember() {
    if (members.length >= 8) return;
    onChange([...members, { name: "", title: "", bio: "", photo: null }]);
  }

  function removeMember(index: number) {
    if (members.length <= 1) return;
    onChange(members.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-6">
      {members.map((member, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl p-5 space-y-4 relative"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Team Member {i + 1}
            </h3>
            {members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMember(i)}
                className="text-red-500 text-sm hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name {i === 0 && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                required={i === 0}
                value={member.name}
                onChange={(e) => update(i, "name", e.target.value)}
                placeholder="John Maxwell"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={member.title}
                onChange={(e) => update(i, "title", e.target.value)}
                placeholder="Agency Owner"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Bio
            </label>
            <textarea
              rows={2}
              value={member.bio}
              onChange={(e) => update(i, "bio", e.target.value)}
              placeholder="A brief description of this team member's experience and role..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headshot Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                update(i, "photo", e.target.files?.[0] || null)
              }
              className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
          </div>
        </div>
      ))}

      {members.length < 8 && (
        <button
          type="button"
          onClick={addMember}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
        >
          + Add Another Team Member
        </button>
      )}
    </div>
  );
}
