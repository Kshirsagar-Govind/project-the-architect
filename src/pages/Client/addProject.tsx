import React, { useState } from "react";

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    desc: "",
    projectType: "",
    client: "",
    manager: "",
    members: [],
    status: "active",
    appFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembersChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, members: values }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, appFile: e.target.files[0] }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      id: `PROJ-${Date.now()}`,
    };
    console.log(payload);
  };

  return (
    <div className="w-full h-[85vh] overflow-y-auto bg-white p-8 rounded-lg shadow space-y-5">

      <h2 className="text-xl font-semibold">Add New Project</h2>

      {/* Title + Project Type */}
      <div className="flex gap-2">
        <input
          name="title"
          placeholder="Project Title"
          className="input-field w-full"
          value={form.title}
          onChange={handleChange}
        />

        <select
          name="projectType"
          value={form.projectType}
          onChange={handleChange}
          className="bg-slate-50 shadow-inner border border-primary-light outline-none px-3 py-2 rounded-md"
        >
          <option hidden value="">Project Type</option>
          <option value="web">Web Application</option>
          <option value="mobile">Mobile Application</option>
          <option value="api">API</option>
        </select>
      </div>

      {/* Description */}
      <textarea
        name="desc"
        value={form.desc}
        placeholder="Project Description"
        className="input-field w-full"
        rows={3}
        onChange={handleChange}
      />

      

      {/* Status + File */}
      <div className="grid grid-cols-2 gap-4">
       

        <input
          type="file"
          onChange={handleFileChange}
          className="bg-slate-50 shadow-inner border border-primary-light outline-none px-3 py-2 rounded-md"
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-primary text-white rounded"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}
