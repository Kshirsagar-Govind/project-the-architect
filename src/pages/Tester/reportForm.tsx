import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createVulnerability, fetchVulnerability } from "../../services/project.services"
import { VULNERABILITY_SEVERITY, VULNERABILITY_TYPES } from '../../utils/constants';
import { useParams } from "react-router-dom";

export default function ReportForm({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const { p_id } = useParams()
  const [report_id, setReportId] = useState(() => {
    const param = window.location.search.split('?')[1];
    if (param && param.includes('report_id')) {
      return param.split('=')[1];
    }
    return ''
  });
  const { isLoading, error, data } = useQuery({
    queryKey: ['report_id', report_id],
    queryFn: () => fetchVulnerability({ projectId: p_id, reportId: report_id })
  })

  const [form, setForm] = useState({
    title: "",
    vulnerabilityType: "",
    desc: "",
    stepToReproduce: "",
    severity: "medium",
    status: "open",
    impact: "",
    recommendation: "",
    affectedEndpoint: "",
    proofOfConcept: "",
    tags: "",
    cvss: 1,
  })

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data, "<<-----------");

      const reportForm = {
        title: data.title,
        vulnerabilityType: data.vulnerabilityType,
        desc: data.desc,
        stepToReproduce: data.stepToReproduce,
        severity: data.severity,
        status: data.status,
        impact: data.impact,
        recommendation: data.recommendation,
        affectedEndpoint: data.affectedEndpoint,
        proofOfConcept: data.proofOfConcept,
        tags: data.tags,
        cvss: data.cvss,
      }
      setForm(reportForm);
    }
  }, [isLoading, data])

  const mutation = useMutation({
    mutationFn: () =>
      createVulnerability({
        projectId: p_id || '',
        report: {
          ...form,
          severity: "medium",
          status: "open",
          proofOfConcept: form.proofOfConcept
            .split("\n")
            .filter(Boolean),
          tags: form.tags.split(",").map(t => t.trim()),
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vulnerability", projectId] })
      alert("Vulnerability reported successfully")
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="w-full h-[85vh] overflow-y-auto bg-white p-8 rounded-lg shadow space-y-5">

      <h2 className="text-xl font-semibold">Report New Vulnerability</h2>

      <div className="flex justify-between gap-2">
        {/* Title */}
        <input
          name="title"
          placeholder="Vulnerability Title"
          className="input-field w-full"
          value={form.title}
          onChange={handleChange}
        />
        {/* Type */}
        <select
          className="bg-slate-50 shadow-inner border border-primary-light outline-none px-3 py-2 rounded-md"
          onChange={handleChange}
          value={form.vulnerabilityType}
          name="vulnerabilityType"
          id="">
          <option hidden defaultValue={''}>Vulnerability Type</option>
          {
            VULNERABILITY_TYPES.map(vul => {
              return (
                <option key={vul.id} value={vul.id}>{vul.label}</option>
              )
            })
          }
        </select>
      </div>



      {/* Severity + cvss */}
      <div className="grid grid-cols-2 gap-4">
        <select 
        name="severity" 
        className="input-field" 
        onChange={handleChange}>
          {VULNERABILITY_SEVERITY.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Endpoint */}
        <input
          name="cvss"
          value={form.cvss}
          type="number"
          placeholder="CVSS Score"
          className="input-field w-full"
          onChange={handleChange}
        />

      </div>

      {/* Description */}
      <textarea
        name="desc"
        value={form.desc}

        placeholder="Description"
        className="input-field w-full"
        rows={3}
        onChange={handleChange}
      />

      {/* Steps */}
      <textarea
        name="stepToReproduce"
        value={form.stepToReproduce}

        placeholder="Steps to Reproduce"
        className="input-field w-full"
        rows={3}
        onChange={handleChange}
      />

      {/* Impact */}
      <textarea
        name="impact"
        value={form.impact}

        placeholder="Impact"
        className="input-field w-full"
        rows={2}
        onChange={handleChange}
      />

      {/* Recommendation */}
      <textarea
        name="recommendation"
        value={form.recommendation}

        placeholder="Recommendation / Fix"
        className="input-field w-full"
        rows={2}
        onChange={handleChange}
      />

      {/* Endpoint */}
      <input
        name="affectedEndpoint"
        value={form.affectedEndpoint}
        placeholder="Affected Endpoint (e.g. /api/login)"
        className="input-field w-full"
        onChange={handleChange}
      />

      {/* Proof of Concept */}
      <textarea
        name="proofOfConcept"
        value={form.proofOfConcept}
        placeholder="Proof of Concept (one per line)"
        className="input-field w-full"
        rows={3}
        onChange={handleChange}
      />

      {/* Tags */}
      <input
        name="tags"
        value={form.tags}
        placeholder="Tags (comma separated)"
        className="input-field w-full"
        onChange={handleChange}
      />

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="px-5 py-2 bg-primary text-white rounded"
        >
          {mutation.isPending ? "Submitting..." :report_id?"Update Report": "Submit Report"}
        </button>
      </div>
    </div>
  )
}
