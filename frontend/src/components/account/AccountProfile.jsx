import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button"; // adjust path if needed
//import { updateProfile } from "../../api/user"; // create this API if not yet

export default function AccountProfile() {
  const { user, setUser } = useAuth(); // make sure setUser exists in your context
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedUser = await updateProfile(formData);

      // Update auth context so UI refreshes
      setUser(updatedUser);

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Account Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500">Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-neutral-200"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 ">Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-neutral-200"
            disabled
          />
        </div>
      </div>

      {/* <div className="mt-6 flex gap-3">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div> */}
    </div>
  );
}
