import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { addNewProject } from "../../services/project.services";
import { getUser } from "../../utils/auth";

export default function AddProject() {
  const user = getUser();
  const [form, setForm] = useState({
    title: "",
    desc: "",
    clientId:user.id,
    projectType: "",

    scope: {
      websiteUrl: "",
      environment: "PROD",
      authRequired: false,
      allowedDomains: [],
      testAccounts:{}
    },

    endpoints: [{ "method": "get", "path": "/", "description": "" }],

    testingTypes: [],
  });


  const handleScopeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      scope: {
        ...prev.scope,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = () => {

    createPoject.mutate(form)
  };

  const createPoject = useMutation({
    mutationFn: addNewProject,
    onSuccess: () => { },
    onError: () => { }
  })

  return (
    <div className="w-full h-[85vh] overflow-y-auto bg-white p-8 rounded-lg shadow space-y-5">

      <h2 className="text-xl font-semibold">Add New Project</h2>

      {/* Title + Type */}
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
          className="input-field"
        >
          <option hidden value="">Project Type</option>
          <option value="WEBSITE">Website</option>
          <option value="WEB_APP">Web App</option>
          <option value="API">API</option>
        </select>
      </div>

      {/* Description */}
      <textarea
        name="desc"
        placeholder="Project Description"
        className="input-field w-full"
        rows={3}
        value={form.desc}
        onChange={handleChange}
      />

      {/* Scope */}
      <input
        name="websiteUrl"
        placeholder="Website URL"
        value={form.scope.websiteUrl}
        onChange={handleScopeChange}
        className="input-field"
      />

      <select
        name="environment"
        value={form.scope.environment}
        onChange={handleScopeChange}
        className="input-field"
      >
        <option hidden value="">Project Type</option>
        <option value="PROD">Production</option>
        <option value="STAGING">Staging</option>
        <option value="DEV">Development</option>
      </select>

      <input
        name="allowedDomains"
        placeholder="Allowed Domains (comma separated)"
        value={form.scope.allowedDomains}
        onChange={handleScopeChange}
        className="input-field"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="authRequired"
          checked={form.scope.authRequired}
          onChange={handleScopeChange}
        />
        Authentication Required
      </label>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-black text-white rounded"
        >
          Create Project
        </button>
      </div>

    </div>
  );
}

